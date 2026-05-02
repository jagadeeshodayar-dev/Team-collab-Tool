import React, {useMemo, useState} from 'react';
import {CheckCircle2, Clock, MessageSquare, Plus, UserRound} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {cn} from '../lib/utils';
import {Task} from '../types';

const statusConfig = {
  todo: {label: 'Queue', color: 'bg-slate-50 border-slate-200', dot: 'bg-slate-300'},
  'in-progress': {label: 'Active', color: 'bg-white border-indigo-200 shadow-sm', dot: 'bg-indigo-500'},
  review: {label: 'Audit', color: 'bg-amber-50 border-amber-200 shadow-sm', dot: 'bg-amber-500'},
  done: {label: 'Finalized', color: 'bg-green-50 border-green-200', dot: 'bg-green-500'},
} satisfies Record<Task['status'], {label: string; color: string; dot: string}>;

const columns: Task['status'][] = ['todo', 'in-progress', 'review', 'done'];

const priorityClass = {
  high: 'bg-red-50 border-red-100 text-red-600',
  medium: 'bg-amber-50 border-amber-100 text-amber-600',
  low: 'bg-green-50 border-green-100 text-green-600',
};

export default function TaskBoard() {
  const {data, actions} = useWorkspace();
  const {tasks, teamMembers} = data;
  const defaultAssignee = teamMembers[0]?.id ?? '';
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? '');
  const [comment, setComment] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assigneeId: defaultAssignee,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0], [selectedTaskId, tasks]);
  const assignee = selectedTask ? teamMembers.find((member) => member.id === selectedTask.assigneeId) : null;

  const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTask.title.trim()) return;

    const taskId = actions.createTask({
      title: newTask.title.trim(),
      description: newTask.description.trim() || 'No description added yet.',
      status: 'todo',
      priority: newTask.priority,
      assigneeId: newTask.assigneeId || defaultAssignee,
      dueDate: newTask.dueDate,
      progress: 0,
    });
    setSelectedTaskId(taskId);
    setNewTask((current) => ({...current, title: '', description: ''}));
  };

  const handleAddComment = () => {
    if (!selectedTask || !comment.trim()) return;
    actions.addTaskComment(selectedTask.id, comment);
    setComment('');
  };

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_24em] lg:p-8">
      <section className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Workflow Pipeline</h2>
            <p className="mt-1 text-sm text-slate-500">Assign owners, track progress, and coordinate work in one place.</p>
          </div>
        </div>

        <form onSubmit={handleCreateTask} className="card-container grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <input
            value={newTask.title}
            onChange={(event) => setNewTask((current) => ({...current, title: event.target.value}))}
            placeholder="Task title"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
          <input
            value={newTask.description}
            onChange={(event) => setNewTask((current) => ({...current, description: event.target.value}))}
            placeholder="Short description"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            Create Task
          </button>
          <select
            value={newTask.assigneeId}
            onChange={(event) => setNewTask((current) => ({...current, assigneeId: event.target.value}))}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            value={newTask.priority}
            onChange={(event) => setNewTask((current) => ({...current, priority: event.target.value as Task['priority']}))}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(event) => setNewTask((current) => ({...current, dueDate: event.target.value}))}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </form>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {columns.map((status) => (
            <div key={status} className="flex min-w-0 flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <span className={cn('h-2 w-2 rounded-full', statusConfig[status].dot)} />
                  {statusConfig[status].label}
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                  {tasks.filter((task) => task.status === status).length}
                </span>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/60 p-3 min-h-[12em]">
                {tasks.filter((task) => task.status === status).map((task) => {
                  const owner = teamMembers.find((member) => member.id === task.assigneeId);
                  const isSelected = selectedTask?.id === task.id;

                  return (
                    <button
                      type="button"
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className={cn(
                        'w-full rounded-xl border bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-md',
                        statusConfig[status].color,
                        isSelected && 'ring-2 ring-indigo-500/30',
                      )}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span className={cn('rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider', priorityClass[task.priority])}>
                          {task.priority} prio
                        </span>
                        {owner && <img src={owner.avatar} alt={owner.name} className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 shadow-sm" />}
                      </div>
                      <h4 className="text-sm font-bold leading-snug text-slate-900">{task.title}</h4>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{task.description}</p>
                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                          <span>{task.progress}% complete</span>
                          <span>{owner?.name.split(' ')[0] ?? 'Unassigned'}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-500" style={{width: `${task.progress}%`}} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {task.comments.length}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {task.dueDate.split('-').slice(1).join('/')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 space-y-4">
        {selectedTask && (
          <div className="card-container sticky top-20 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected task</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedTask.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{selectedTask.description}</p>
            </div>

            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <UserRound className="h-3.5 w-3.5" />
                Owner
              </span>
              <select
                value={selectedTask.assigneeId}
                onChange={(event) => actions.updateTaskAssignee(selectedTask.id, event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
              <select
                value={selectedTask.status}
                onChange={(event) => actions.updateTaskStatus(selectedTask.id, event.target.value as Task['status'])}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                {columns.map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                Progress
                <span>{selectedTask.progress}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={selectedTask.progress}
                onChange={(event) => actions.updateTaskProgress(selectedTask.id, Number(event.target.value))}
                className="mt-3 w-full accent-indigo-600"
              />
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Comments</p>
                <span className="text-xs font-bold text-slate-400">{selectedTask.comments.length}</span>
              </div>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {selectedTask.comments.length === 0 ? (
                  <p className="text-xs text-slate-500">No comments yet.</p>
                ) : (
                  selectedTask.comments.map((item) => (
                    <p key={item.id} className="rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-sm">
                      {item.message}
                    </p>
                  ))
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Add update..."
                  className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button onClick={handleAddComment} className="rounded-xl bg-slate-900 px-3 text-xs font-bold text-white">
                  Add
                </button>
              </div>
            </div>

            {assignee && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <img src={assignee.avatar} alt={assignee.name} className="h-10 w-10 rounded-full bg-slate-100" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{assignee.name}</p>
                  <p className="truncate text-xs text-slate-500">{assignee.role}</p>
                </div>
                <CheckCircle2 className="ml-auto h-4.5 w-4.5 text-green-500" />
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
