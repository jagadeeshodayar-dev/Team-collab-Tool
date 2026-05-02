import { Task, TeamMember, Notification, ProjectAnalytics } from './types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Product Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'online',
    email: 'sarah@syncro.com'
  },
  {
    id: '2',
    name: 'Marcus Bell',
    role: 'Senior Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    status: 'busy',
    email: 'marcus@syncro.com'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    status: 'offline',
    email: 'elena@syncro.com'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'DevOps Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'online',
    email: 'james@syncro.com'
  }
];

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Migrate to React 19',
    description: 'Update all dependencies and test concurrent features.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '2',
    dueDate: '2026-05-10',
    createdAt: '2026-05-01'
  },
  {
    id: 't2',
    title: 'New Onboarding Flow',
    description: 'Design and implement the new user welcome sequence.',
    status: 'todo',
    priority: 'medium',
    assigneeId: '3',
    dueDate: '2026-05-15',
    createdAt: '2026-05-01'
  },
  {
    id: 't3',
    title: 'Database Optimization',
    description: 'Refactor slow queries in the reporting service.',
    status: 'review',
    priority: 'high',
    assigneeId: '4',
    dueDate: '2026-05-08',
    createdAt: '2026-05-02'
  },
  {
    id: 't4',
    title: 'User Feedback Analysis',
    description: 'Go through the Q1 feedback logs and categorize requests.',
    status: 'done',
    priority: 'low',
    assigneeId: '1',
    dueDate: '2026-04-30',
    createdAt: '2026-04-20'
  }
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'info',
    message: 'Marcus Bell mentioned you in a comment on "Migrate to React 19"',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'n2',
    type: 'success',
    message: '"Database Optimization" has been moved to Review',
    timestamp: '4 hours ago',
    read: false
  },
  {
    id: 'n3',
    type: 'warning',
    message: 'Upcoming deadline: "Migrate to React 19" is due in 3 days',
    timestamp: '6 hours ago',
    read: true
  }
];

export const projectAnalytics: ProjectAnalytics[] = [
  { date: 'Mon', completed: 5, active: 12, new: 3 },
  { date: 'Tue', completed: 8, active: 10, new: 5 },
  { date: 'Wed', completed: 4, active: 14, new: 8 },
  { date: 'Thu', completed: 10, active: 12, new: 2 },
  { date: 'Fri', completed: 12, active: 8, new: 4 },
  { date: 'Sat', completed: 3, active: 9, new: 1 },
  { date: 'Sun', completed: 2, active: 10, new: 2 }
];
