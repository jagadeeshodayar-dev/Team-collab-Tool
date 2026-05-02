import React from 'react';
import {BookOpen, Bot, Cpu, Kanban, LayoutDashboard, Settings, Terminal, Users} from 'lucide-react';
import {cn} from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  {id: 'dashboard', label: 'Overview', icon: LayoutDashboard},
  {id: 'tasks', label: 'Workflows', icon: Kanban},
  {id: 'team', label: 'Directory', icon: Users},
  {id: 'ai-history', label: 'AI History', icon: Bot},
  {id: 'guide', label: 'Guide', icon: BookOpen},
];

const bottomItems = [
  {id: 'settings', label: 'Settings', icon: Settings},
];

export default function Sidebar({activeTab, setActiveTab}: SidebarProps) {
  const items = [...navItems, ...bottomItems];

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-800 bg-slate-950 font-sans shadow-2xl lg:flex">
        <div className="flex items-center gap-3 p-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/25">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-white">Sync Pro</h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">Enterprise</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-8">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'group relative flex w-full items-center gap-4 rounded-xl border-l-4 px-4 py-3 text-sm font-medium transition',
                activeTab === item.id
                  ? 'border-indigo-500 bg-indigo-500/15 text-white'
                  : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className={cn('h-5 w-5', activeTab === item.id ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300')} />
              <span>{item.label}</span>
              {activeTab === item.id && <span className="absolute right-4 h-1.5 w-1.5 rounded-full bg-indigo-400" />}
            </button>
          ))}
        </nav>

        <div className="space-y-1 border-t border-slate-800 px-3 py-6">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'group flex w-full items-center gap-4 rounded-xl border-l-4 px-4 py-3 text-sm font-medium transition',
                activeTab === item.id
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                  : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className="h-5 w-5 text-slate-500 group-hover:text-slate-300" />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mx-2 mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Cpu className="h-3 w-3 text-indigo-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Load</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-indigo-500" />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[9px] font-medium uppercase text-slate-500">Stable</span>
              <span className="text-[9px] font-bold uppercase text-indigo-300">68%</span>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold transition',
                activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50',
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
