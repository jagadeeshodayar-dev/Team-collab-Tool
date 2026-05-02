import {useEffect, useMemo, useState} from 'react';
import {AiMessage, Task, WorkspaceActions, WorkspaceData, WorkspaceSettings, WorkspaceUser} from '../types';
import {workspaceSeed} from '../data/workspaceSchema';

const WORKSPACE_STORAGE_KEY = 'sync-pro-workspace-v1';
const USER_STORAGE_KEY = 'sync-pro-user-v1';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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

const loadWorkspace = (): WorkspaceData => {
  if (typeof window === 'undefined') return workspaceSeed;

  try {
    const saved = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!saved) return workspaceSeed;
    const parsed = JSON.parse(saved) as Partial<WorkspaceData>;
    return {
      ...workspaceSeed,
      ...parsed,
      settings: {...workspaceSeed.settings, ...parsed.settings},
      tasks: parsed.tasks ?? workspaceSeed.tasks,
      teamMembers: parsed.teamMembers ?? workspaceSeed.teamMembers,
      notifications: parsed.notifications ?? workspaceSeed.notifications,
      chats: parsed.chats ?? workspaceSeed.chats,
      aiConversations: parsed.aiConversations ?? workspaceSeed.aiConversations,
      activeAiConversationId: parsed.activeAiConversationId ?? workspaceSeed.activeAiConversationId,
      projectAnalytics: parsed.projectAnalytics ?? workspaceSeed.projectAnalytics,
    };
  } catch {
    return workspaceSeed;
  }
};

const loadUser = (): WorkspaceUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = window.localStorage.getItem(USER_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as WorkspaceUser) : null;
  } catch {
    return null;
  }
};

export function useWorkspaceData() {
  const [data, setData] = useState<WorkspaceData>(loadWorkspace);
  const [user, setUser] = useState<WorkspaceUser | null>(loadUser);

  useEffect(() => {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const actions = useMemo<WorkspaceActions>(
    () => ({
      createTask: (input: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
        const task: Task = {
          ...input,
          id: createId('task'),
          createdAt: new Date().toISOString().slice(0, 10),
          comments: [],
        };

        setData((current) => ({
          ...current,
          tasks: [task, ...current.tasks],
          notifications: [
            createNotification('Task created', `${task.title} was added to the workflow.`, 'success', task.id),
            ...current.notifications,
          ],
        }));
      },
      updateTaskStatus: (taskId: string, status: Task['status']) => {
        setData((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          if (!task || task.status === status) return current;
          const progress = status === 'done' ? 100 : status === 'review' ? Math.max(task.progress, 80) : status === 'in-progress' ? Math.max(task.progress, 25) : task.progress;

          return {
            ...current,
            tasks: current.tasks.map((item) => (item.id === taskId ? {...item, status, progress} : item)),
            notifications: [
              createNotification('Task status updated', `${task.title} moved to ${status.replace('-', ' ')}.`, status === 'done' ? 'success' : 'info', task.id),
              ...current.notifications,
            ],
          };
        });
      },
      updateTaskAssignee: (taskId: string, assigneeId: string) => {
        setData((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          const member = current.teamMembers.find((item) => item.id === assigneeId);
          if (!task || !member || task.assigneeId === assigneeId) return current;

          return {
            ...current,
            tasks: current.tasks.map((item) => (item.id === taskId ? {...item, assigneeId} : item)),
            notifications: [
              createNotification('Task assigned', `${task.title} is now assigned to ${member.name}.`, 'info', task.id),
              ...current.notifications,
            ],
          };
        });
      },
      updateTaskProgress: (taskId: string, progress: number) => {
        const nextProgress = Math.min(100, Math.max(0, Math.round(progress)));

        setData((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          if (!task) return current;
          const status = nextProgress === 100 ? 'done' : nextProgress >= 80 ? 'review' : nextProgress > 0 ? 'in-progress' : 'todo';

          return {
            ...current,
            tasks: current.tasks.map((item) => (item.id === taskId ? {...item, progress: nextProgress, status} : item)),
            notifications: [
              createNotification('Progress updated', `${task.title} is now ${nextProgress}% complete.`, nextProgress === 100 ? 'success' : 'info', task.id),
              ...current.notifications,
            ],
          };
        });
      },
      addTaskComment: (taskId: string, message: string) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        setData((current) => {
          const task = current.tasks.find((item) => item.id === taskId);
          if (!task) return current;

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
                        authorId: 'current-user',
                        message: trimmed,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : item,
            ),
            notifications: [
              createNotification('New task comment', `A comment was added to ${task.title}.`, 'info', task.id),
              ...current.notifications,
            ],
          };
        });
      },
      sendChatMessage: (memberId: string, message: string) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        setData((current) => {
          const member = current.teamMembers.find((item) => item.id === memberId);
          if (!member) return current;

          const userMessage = {
            id: createId('chat'),
            memberId,
            sender: 'user' as const,
            message: trimmed,
            createdAt: new Date().toISOString(),
          };
          const reply = {
            id: createId('chat-reply'),
            memberId,
            sender: 'member' as const,
            message: `${member.name.split(' ')[0]} received it. I will coordinate on the next action and keep the task owner updated.`,
            createdAt: new Date(Date.now() + 1000).toISOString(),
          };

          return {
            ...current,
            chats: [...current.chats, userMessage, reply],
            notifications: [
              createNotification('Team message sent', `Message thread with ${member.name} was updated.`, 'success'),
              ...current.notifications,
            ],
          };
        });
      },
      createAiConversation: () => {
        const conversationId = createId('ai-conversation');
        setData((current) => ({
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
        setData((current) => ({
          ...current,
          activeAiConversationId: conversationId,
        }));
      },
      addAiMessage: (message: Omit<AiMessage, 'id' | 'createdAt'>) => {
        setData((current) => {
          const activeConversation = current.aiConversations.find((conversation) => conversation.id === current.activeAiConversationId);
          const conversationId = activeConversation?.id ?? current.aiConversations[0]?.id ?? workspaceSeed.activeAiConversationId;
          const now = new Date().toISOString();
          const nextMessage = {
            ...message,
            id: createId('ai-message'),
            createdAt: now,
          };

          return {
            ...current,
            activeAiConversationId: conversationId,
            aiConversations: current.aiConversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                    ...conversation,
                    title:
                      conversation.title === 'New workspace chat' && message.role === 'user'
                        ? message.content.slice(0, 44)
                        : conversation.title,
                    updatedAt: now,
                    messages: [...conversation.messages, nextMessage],
                  }
                : conversation,
            ),
          };
        });
      },
      clearAiConversation: (conversationId: string) => {
        setData((current) => ({
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
        setData((current) => ({
          ...current,
          notifications: current.notifications.map((notification) =>
            notification.id === id ? {...notification, read: true} : notification,
          ),
        }));
      },
      markAllNotificationsRead: () => {
        setData((current) => ({
          ...current,
          notifications: current.notifications.map((notification) => ({...notification, read: true})),
        }));
      },
      clearReadNotifications: () => {
        setData((current) => ({
          ...current,
          notifications: current.notifications.filter((notification) => !notification.read),
        }));
      },
      updateSettings: (settings: Partial<WorkspaceSettings>) => {
        setData((current) => ({
          ...current,
          settings: {...current.settings, ...settings},
        }));
      },
    }),
    [],
  );

  const login = (nextUser: WorkspaceUser) => setUser(nextUser);
  const logout = () => setUser(null);
  const unreadCount = data.notifications.filter((notification) => !notification.read).length;

  return {data, actions, user, login, logout, unreadCount};
}
