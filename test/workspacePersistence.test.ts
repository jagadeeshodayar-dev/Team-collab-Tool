import assert from 'node:assert/strict';
import {sanitizeForFirestore, taskStatusFromProgress} from '../src/lib/workspacePersistence.ts';

const containsUndefined = (value: unknown): boolean => {
  if (value === undefined) return true;
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(containsUndefined);
  return Object.values(value as Record<string, unknown>).some(containsUndefined);
};

{
  const workspaceLike = {
    notifications: [
      {
        id: 'notification-1',
        title: 'Assigned',
        actionLabel: undefined,
        entityId: undefined,
      },
    ],
    nested: {
      preserved: 'yes',
      omitted: undefined,
    },
  };

  const sanitized = sanitizeForFirestore(workspaceLike);

  assert.equal(containsUndefined(sanitized), false);
  assert.equal('actionLabel' in sanitized.notifications[0], false);
  assert.equal(sanitized.nested.preserved, 'yes');
}

{
  assert.equal(taskStatusFromProgress(0), 'todo');
  assert.equal(taskStatusFromProgress(1), 'in-progress');
  assert.equal(taskStatusFromProgress(79), 'in-progress');
  assert.equal(taskStatusFromProgress(80), 'review');
  assert.equal(taskStatusFromProgress(100), 'done');
}

console.log('workspace persistence checks passed');
