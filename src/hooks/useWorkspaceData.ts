import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {doc, onSnapshot, setDoc} from 'firebase/firestore';
import {firebaseDb} from '../lib/firebase';
import {sanitizeForFirestore, taskStatusFromProgress} from '../lib/workspacePersistence';
import {AiMessage, Task, TeamMember, WorkspaceActions, WorkspaceData, WorkspaceSettings, WorkspaceSyncStatus, WorkspaceUser} from '../types';
import {workspaceSeed} from '../data/workspaceSchema';

const WORKSPACE_STORAGE_KEY = 'sync-pro-workspace-v1';
const USER_STORAGE_KEY = 'sync-pro-user-v1';
const WORKSPACE_DOC_PATH = ['workspaces', 'sync-pro-demo'] as const;

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const userIdFromEmail = (email: string) =>
  `user-${email.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guest'}`;

const avatarForUser = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Guest')}`;

const createNotification = (
  title: string,
  message: string,
  type: WorkspaceData['notifications'][number]['type'] = 'info',
  entityId?: string,
): WorkspaceData['notifications'][number] => ({
  id: createId('notification'),
  type,
  title,
  message,
  createdAt: new Date().toISOString(),
  read: false,
  actionLabel: entityId ? 'Open task' : undefined,
  entityType: entityId ? 'task' : 'system',
  entityId,
});

const addNotification = (current: WorkspaceData, notification: WorkspaceData['notifications'][number]) =>
  current.settings.notificationsEnabled ? [notification, ...current.notifications] : current.notifications;

const normalizeWorkspace = (input?: Partial<WorkspaceData>): WorkspaceData => {
  const parsed = input ?? {};

  return {
    ...workspaceSeed,
    ...parsed,
    settings: {...workspaceSeed.settings, ...parsed.settings},
    tasks: (parsed.tasks ?? workspaceSeed.tasks).map((task, index) => ({
      ...task,
      progress:
        typeof task.progress === 'number'
          ? task.progress
          : task.status === 'done'
            ? 100
            : task.status === 'review'
              ? 80
              : task.status === 'in-progress'
                ? 40
                : 0,
      comments: task.comments ?? workspaceSeed.tasks[index]?.comments ?? [],
    })),
    teamMembers: parsed.teamMembers ?? workspaceSeed.teamMembers,
    notifications: (parsed.notifications ?? workspaceSeed.notifications).map((notification) => ({
      ...notification,
      title: notification.title ?? 'Workspace update',
      createdAt: notification.createdAt ?? new Date().toISOString(),
    })),
    chats: parsed.chats ?? workspaceSeed.chats,
    aiConversations: parsed.aiConversations?.length ? parsed.aiConversations : workspaceSeed.aiConversations,
    activeAiConversationId: parsed.activeAiConversationId ?? workspaceSeed.activeAiConversationId,
    projectAnalytics: parsed.projectAnalytics ?? workspaceSeed.projectAnalytics,
  };
};

const loadWorkspace = (): WorkspaceData => {
  if (typeof window === 'undefined') return workspaceSeed;

  try {
    const saved = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    return saved ? normalizeWorkspace(JSON.parse(saved) as Partial<WorkspaceData>) : workspaceSeed;
  } catch {
    return workspaceSeed;
  }
};

const loadUser = (): WorkspaceUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as Partial<WorkspaceUser>;
    const email = parsed.email ?? 'member@syncpro.team';
    return {
      id: parsed.id ?? userIdFromEmail(email),
      name: parsed.name ?? 'Team Member',
      email,
      role: parsed.role ?? 'Product Lead',
    };
  } catch {
    return null;
  }
};

const memberFromUser = (user: WorkspaceUser): TeamMember => ({
  id: user.id,
  name: user.name,
  role: user.role,
  avatar: avatarForUser(user.name),
  status: 'online',
  email: user.email,
});

export function useWorkspaceData() {
  const [data, setData] = useState<WorkspaceData>(loadWorkspace);
  const [user, setUser] = useState<WorkspaceUser | null>(loadUser);
  const [syncStatus, setSyncStatus] = useState<WorkspaceSyncStatus>('connecting');
  const [remoteReady, setRemoteReady] = useState(false);
  const applyingRemoteRef = useRef(false);
  const initializedRemoteRef = useRef(false);
  const initialWorkspaceRef = useRef(data);
  const workspaceDocRef = useMemo(() => doc(firebaseDb, ...WORKSPACE_DOC_PATH), []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      workspaceDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const remoteDoc = snapshot.data() as {workspace?: Partial<WorkspaceData>};
          const remote = remoteDoc.workspace;
          applyingRemoteRef.current = true;
          setData(normalizeWorkspace(remote));
          setSyncStatus('connected');
          setRemoteReady(true);
          initializedRemoteRef.current = true;
          window.setTimeout(() => {
            applyingRemoteRef.current = false;
          }, 0);
          return;
        }

        try {
          await setDoc(workspaceDocRef, {workspace: sanitizeForFirestore(initialWorkspaceRef.current), updatedAt: new Date().toISOString()});
          setSyncStatus('connected');
          setRemoteReady(true);
          initializedRemoteRef.current = true;
        } catch {
          setSyncStatus('local');
        }
      },
      () => {
        setSyncStatus('local');
      },
    );

    return unsubscribe;
  }, [workspaceDocRef]);

  useEffect(() => {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));

    if (!remoteReady) return;
    if (applyingRemoteRef.current) return;

    setDoc(workspaceDocRef, {workspace: sanitizeForFirestore(data), updatedAt: new Date().toISOString()}, {merge: true})
      .then(() => {
        setSyncStatus('connected');
        initializedRemoteRef.current = true;
      })
      .catch(() => {
        setSyncStatus(initializedRemoteRef.current ? 'connected' : 'local');
      });
  }, [data, remoteReady, workspaceDocRef]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const updateWorkspace = useCallback((recipe: (current: WorkspaceData) => WorkspaceData) => {
    setData((current) => normalizeWorkspace(recipe(current)));
  }, []);

  const actions = useMemo<WorkspaceActions>(
    () => ({
      createTask: (input: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
        const task: Task = {
          ...input,
          id: createId('task'),
          createdAt: new Date().toISOString().slice(0, 10),
          comments: [],
        };

        updateWorkspace((current) => ({
          ...current,
          tasks: [task, ...current.tasks],
          notifications: addNotification(current, createNotification('Task created', `${task.title} was added to the workflow.`, 'success', task.id)),
        }));
        return task.id;
      },
      updateTaskStatus: (taskId: string, status: Task['status']) => {
        updateWorkspace((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          if (!task || task.status === status) return current;
          const progress = status === 'done' ? 100 : status === 'review' ? Math.max(task.progress, 80) : status === 'in-progress' ? Math.max(task.progress, 25) : task.progress;

          return {
            ...current,
            tasks: current.tasks.map((item) => (item.id === taskId ? {...item, status, progress} : item)),
            notifications: addNotification(
              current,
              createNotification('Task status updated', `${task.title} moved to ${status.replace('-', ' ')}.`, status === 'done' ? 'success' : 'info', task.id),
            ),
          };
        });
      },
      updateTaskAssignee: (taskId: string, assigneeId: string) => {
        updateWorkspace((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          const member = current.teamMembers.find((item) => item.id === assigneeId);
          if (!task || !member || task.assigneeId === assigneeId) return current;

          return {
            ...current,
            tasks: current.tasks.map((item) => (item.id === taskId ? {...item, assigneeId} : item)),
            notifications: addNotification(current, createNotification('Task assigned', `${task.title} is now assigned to ${member.name}.`, 'info', task.id)),
          };
        });
      },
      updateTaskProgress: (taskId: string, progress: number) => {
        const nextProgress = Math.min(100, Math.max(0, Math.round(progress)));

        updateWorkspace((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          if (!task) return current;
          const status = taskStatusFromProgress(nextProgress);

          return {
            ...current,
            tasks: current.tasks.map((item) => (item.id === taskId ? {...item, progress: nextProgress, status} : item)),
            notifications: addNotification(
              current,
              createNotification('Progress updated', `${task.title} is now ${nextProgress}% complete.`, nextProgress === 100 ? 'success' : 'info', task.id),
            ),
          };
        });
      },
      addTaskComment: (taskId: string, message: string) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        updateWorkspace((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          if (!task) return current;
          const authorId = user?.id ?? 'current-user';

          return {
            ...current,
            tasks: current.tasks.map((item) =>
              item.id === taskId
                ? {
                    ...item,
                    comments: [
                      ...item.comments,
                      {
                        id: createId('comment'),
                        authorId,
                        message: trimmed,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : item,
            ),
            notifications: addNotification(current, createNotification('New task comment', `A comment was added to ${task.title}.`, 'info', task.id)),
          };
        });
      },
      sendChatMessage: (memberId: string, message: string) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        updateWorkspace((current) => {
          const member = current.teamMembers.find((item) => item.id === memberId);
          if (!member) return current;
          const senderName = user?.name ?? 'A teammate';

          const userMessage = {
            id: createId('chat'),
            memberId,
            sender: 'user' as const,
            message: trimmed,
            createdAt: new Date().toISOString(),
          };

          return {
            ...current,
            chats: [...current.chats, userMessage],
            notifications: addNotification(current, createNotification('Team message sent', `${senderName} messaged ${member.name}.`, 'success')),
          };
        });
      },
      createAiConversation: () => {
        const conversationId = createId('ai-conversation');
        updateWorkspace((current) => ({
          ...current,
          activeAiConversationId: conversationId,
          aiConversations: [
            {
              id: conversationId,
              title: 'New workspace chat',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              messages: [
                {
                  id: createId('ai-message'),
                  role: 'assistant',
                  content: "I'm ready. Ask me about priorities, owners, risks, progress, or coordination plans.",
                  createdAt: new Date().toISOString(),
                },
              ],
            },
            ...current.aiConversations,
          ],
        }));
        return conversationId;
      },
      setActiveAiConversation: (conversationId: string) => {
        updateWorkspace((current) => ({...current, activeAiConversationId: conversationId}));
      },
      addAiMessage: (message: Omit<AiMessage, 'id' | 'createdAt'>) => {
        updateWorkspace((current) => {
          const activeConversation = current.aiConversations.find((conversation) => conversation.id === current.activeAiConversationId);
          const conversationId = activeConversation?.id ?? current.aiConversations[0]?.id ?? workspaceSeed.activeAiConversationId;
          const now = new Date().toISOString();
          const nextMessage = {...message, id: createId('ai-message'), createdAt: now};

          return {
            ...current,
            activeAiConversationId: conversationId,
            aiConversations: current.aiConversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    title: conversation.title === 'New workspace chat' && message.role === 'user' ? message.content.slice(0, 44) : conversation.title,
                    updatedAt: now,
                    messages: [...conversation.messages, nextMessage],
                  }
                : conversation,
            ),
          };
        });
      },
      clearAiConversation: (conversationId: string) => {
        updateWorkspace((current) => ({
          ...current,
          aiConversations: current.aiConversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  title: 'New workspace chat',
                  updatedAt: new Date().toISOString(),
                  messages: [
                    {
                      id: createId('ai-message'),
                      role: 'assistant',
                      content: "I'm ready. Ask me about priorities, owners, risks, progress, or coordination plans.",
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : conversation,
          ),
        }));
      },
      markNotificationRead: (id: string) => {
        updateWorkspace((current) => ({
          ...current,
          notifications: current.notifications.map((notification) => (notification.id === id ? {...notification, read: true} : notification)),
        }));
      },
      markAllNotificationsRead: () => {
        updateWorkspace((current) => ({
          ...current,
          notifications: current.notifications.map((notification) => ({...notification, read: true})),
        }));
      },
      clearReadNotifications: () => {
        updateWorkspace((current) => ({
          ...current,
          notifications: current.notifications.filter((notification) => !notification.read),
        }));
      },
      updateSettings: (settings: Partial<WorkspaceSettings>) => {
        updateWorkspace((current) => ({...current, settings: {...current.settings, ...settings}}));
      },
      resetWorkspace: () => {
        updateWorkspace(() => workspaceSeed);
      },
    }),
    [updateWorkspace, user?.id, user?.name],
  );

  const login = (nextUser: WorkspaceUser) => {
    const normalizedUser = {
      ...nextUser,
      id: nextUser.id || userIdFromEmail(nextUser.email),
      email: nextUser.email.trim().toLowerCase(),
      name: nextUser.name.trim() || 'Team Member',
    };
    setUser(normalizedUser);
    updateWorkspace((current) => {
      const member = memberFromUser(normalizedUser);
      const exists = current.teamMembers.some((item) => item.id === member.id);
      return {
        ...current,
        teamMembers: exists
          ? current.teamMembers.map((item) => (item.id === member.id ? {...item, ...member, status: 'online'} : item))
          : [member, ...current.teamMembers],
        notifications: addNotification(current, createNotification('Teammate online', `${member.name} joined the workspace.`, 'success')),
      };
    });
  };

  const logout = () => {
    if (user) {
      updateWorkspace((current) => ({
        ...current,
        teamMembers: current.teamMembers.map((member) => (member.id === user.id ? {...member, status: 'offline'} : member)),
      }));
    }
    setUser(null);
  };
  const unreadCount = data.notifications.filter((notification) => !notification.read).length;

  return {data, actions, user, login, logout, unreadCount, syncStatus};
}
