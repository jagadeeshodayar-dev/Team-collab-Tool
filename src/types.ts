export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  progress: number;
  comments: TaskComment[];
}

export interface TaskComment {
  id: string;
  authorId: string;
  message: string;
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
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ChatMessage {
  id: string;
  memberId: string;
  sender: 'user' | 'member';
  message: string;
  createdAt: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiMessage[];
}

export interface WorkspaceData {
  tasks: Task[];
  teamMembers: TeamMember[];
  notifications: Notification[];
  chats: ChatMessage[];
  aiConversations: AiConversation[];
  activeAiConversationId: string;
  projectAnalytics: ProjectAnalytics[];
  settings: WorkspaceSettings;
}

export interface WorkspaceActions {
  createTask: (input: Omit<Task, 'id' | 'createdAt' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskAssignee: (taskId: string, assigneeId: string) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  addTaskComment: (taskId: string, message: string) => void;
  sendChatMessage: (memberId: string, message: string) => void;
  createAiConversation: () => string;
  setActiveAiConversation: (conversationId: string) => void;
  addAiMessage: (message: Omit<AiMessage, 'id' | 'createdAt'>) => void;
  clearAiConversation: (conversationId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearReadNotifications: () => void;
  updateSettings: (settings: Partial<WorkspaceSettings>) => void;
}

export interface WorkspaceViewProps {
  data: WorkspaceData;
  actions: WorkspaceActions;
}
