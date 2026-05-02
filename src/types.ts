export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  email: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
  entityType?: 'task' | 'member' | 'system';
  entityId?: string;
}

export interface ProjectAnalytics {
  date: string;
  completed: number;
  active: number;
  new: number;
}

export interface WorkspaceSettings {
  organizationName: string;
  workspaceName: string;
  notificationsEnabled: boolean;
  dailyDigest: boolean;
  autoAssignCriticalTasks: boolean;
  compactMode: boolean;
  timezone: string;
}

export interface WorkspaceUser {
  name: string;
  email: string;
  role: string;
}

export interface WorkspaceData {
  tasks: Task[];
  teamMembers: TeamMember[];
  notifications: Notification[];
  projectAnalytics: ProjectAnalytics[];
  settings: WorkspaceSettings;
}

export interface WorkspaceActions {
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearReadNotifications: () => void;
  updateSettings: (settings: Partial<WorkspaceSettings>) => void;
}

export interface WorkspaceViewProps {
  data: WorkspaceData;
  actions: WorkspaceActions;
}
