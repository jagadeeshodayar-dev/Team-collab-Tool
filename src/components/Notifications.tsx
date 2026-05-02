import React from 'react';
import {CheckCircle2, Clock, Info, AlertTriangle, XCircle} from 'lucide-react';
import {cn} from '../lib/utils';
import {useWorkspace} from '../context/WorkspaceContext';
import {Notification} from '../types';

const iconMap = {
  info: <Info className="h-4 w-4 text-indigo-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  error: <XCircle className="h-4 w-4 text-red-500" />,
};

const bgMap = {
  info: 'bg-indigo-50/50 border-indigo-100',
  success: 'bg-green-50/50 border-green-100',
  warning: 'bg-amber-50/50 border-amber-100',
  error: 'bg-red-50/50 border-red-100',
};

const formatNotificationTime = (notification: Notification) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(notification.createdAt));

export default function Notifications() {
  const {data, actions} = useWorkspace();
  const unreadCount = data.notifications.filter((notification) => !notification.read).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Notifications</h2>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount ? `${unreadCount} item${unreadCount === 1 ? '' : 's'} need attention.` : 'Everything is caught up.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            onClick={actions.markAllNotificationsRead}
            className="h-10 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={unreadCount === 0}
          >
            Mark all read
          </button>
          <button
            onClick={actions.clearReadNotifications}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Clear read
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {data.notifications.length === 0 ? (
          <div className="card-container text-center">
            <p className="font-bold text-slate-800">No notifications</p>
            <p className="mt-1 text-sm text-slate-500">New task updates, mentions, and review requests will appear here.</p>
          </div>
        ) : (
          data.notifications.map((notification, i) => (
            <button
              type="button"
              key={notification.id}
              onClick={() => actions.markNotificationRead(notification.id)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition hover:bg-white hover:shadow-md sm:p-5',
                bgMap[notification.type],
                !notification.read && 'border-l-4 border-l-indigo-500',
              )}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="mt-1 rounded-lg border border-slate-100 bg-white p-2 shadow-sm">{iconMap[notification.type]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className={cn('text-sm font-bold', notification.read ? 'text-slate-700' : 'text-slate-950')}>{notification.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{notification.message}</p>
                    </div>
                    {!notification.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200" />}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatNotificationTime(notification)}
                    </span>
                    {notification.actionLabel && <span className="text-indigo-600">{notification.actionLabel}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
