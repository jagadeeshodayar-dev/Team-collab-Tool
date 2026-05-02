import type {Task} from '../types';

export const sanitizeForFirestore = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const taskStatusFromProgress = (progress: number): Task['status'] => {
  if (progress >= 100) return 'done';
  if (progress >= 80) return 'review';
  if (progress > 0) return 'in-progress';
  return 'todo';
};
