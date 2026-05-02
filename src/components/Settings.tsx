import React from 'react';
import {Bell, Building2, Clock3, LayoutGrid, RotateCcw, ShieldCheck, UserRoundCheck} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';

const settingRows = [
  {
    key: 'notificationsEnabled',
    icon: Bell,
    title: 'Workspace notifications',
    description: 'Show task mentions, review requests, and deadline alerts.',
  },
  {
    key: 'dailyDigest',
    icon: Clock3,
    title: 'Daily digest',
    description: 'Bundle low-priority updates into a daily summary.',
  },
  {
    key: 'autoAssignCriticalTasks',
    icon: UserRoundCheck,
    title: 'Auto-assign critical tasks',
    description: 'Route urgent work to available project owners.',
  },
  {
    key: 'compactMode',
    icon: LayoutGrid,
    title: 'Compact layout',
    description: 'Reduce spacing for dense operational reviews.',
  },
] as const;

export default function Settings() {
  const {data, actions} = useWorkspace();
  const {settings} = data;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage the workspace details people see every day.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-container space-y-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Workspace profile</h3>
              <p className="text-sm text-slate-500">Clear names help teammates know where they are working.</p>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Organization name</span>
            <input
              value={settings.organizationName}
              onChange={(event) => actions.updateSettings({organizationName: event.target.value})}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Workspace name</span>
            <input
              value={settings.workspaceName}
              onChange={(event) => actions.updateSettings({workspaceName: event.target.value})}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Timezone</span>
            <select
              value={settings.timezone}
              onChange={(event) => actions.updateSettings({timezone: event.target.value})}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="Asia/Calcutta">Asia/Calcutta</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </label>
        </div>

        <div className="card-container space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Preferences</h3>
              <p className="text-sm text-slate-500">These settings save automatically on this device.</p>
            </div>
          </div>

          {settingRows.map((row) => {
            const Icon = row.icon;
            const enabled = Boolean(settings[row.key]);
            return (
              <button
                key={row.key}
                type="button"
                onClick={() => actions.updateSettings({[row.key]: !enabled})}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-slate-50"
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4.5 w-4.5 text-slate-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{row.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{row.description}</p>
                  </div>
                </div>
                <span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <span className={`h-5 w-5 rounded-full bg-white shadow transition ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={actions.resetWorkspace}
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 p-4 text-left transition hover:border-red-200 hover:bg-red-100"
          >
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-4.5 w-4.5 text-red-500" />
              <div>
                <p className="text-sm font-bold text-red-700">Reset demo workspace</p>
                <p className="mt-1 text-xs leading-relaxed text-red-600">Restore the seeded tasks, people, chats, notifications, and AI history.</p>
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
