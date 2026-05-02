import {useEffect, useMemo, useState} from 'react';
import {WorkspaceActions, WorkspaceData, WorkspaceSettings, WorkspaceUser} from '../types';
import {workspaceSeed} from '../data/workspaceSchema';

const WORKSPACE_STORAGE_KEY = 'sync-pro-workspace-v1';
const USER_STORAGE_KEY = 'sync-pro-user-v1';

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
