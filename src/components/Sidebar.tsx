import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Bell, 
  Settings, 
  Menu, 
  Terminal,
  Cpu,
  Layers,
  LineChart
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Workflows', icon: Kanban },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'team', label: 'Directory', icon: Users },
  ];

  const bottomItems = [
    { id: 'notifications', label: 'Updates', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-line flex flex-col bg-[#0f172a] h-full font-sans shadow-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center relative group overflow-hidden shadow-lg shadow-indigo-500/20">
          <Terminal className="w-6 h-6 text-white z-10" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-none">Sync Pro</h1>
          <p className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 mt-1">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-8 space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-4 mb-4">Main Menu</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-2.5 text-sm font-medium transition-all rounded-lg group relative",
              activeTab === item.id 
                ? "text-white bg-indigo-500/10 border-l-4 border-indigo-500" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-6 space-y-1 border-t border-slate-800">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-2.5 text-sm font-medium transition-all rounded-lg group",
              activeTab === item.id 
                ? "text-indigo-400 bg-indigo-500/10 border-l-4 border-indigo-500" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
            )}
          >
            <item.icon className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        
        <div className="mt-8 p-4 rounded-xl bg-slate-800/40 border border-white/5 mx-2">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Load</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-indigo-500" />
          </div>
          <div className="flex justify-between mt-2">
             <span className="text-[9px] uppercase text-slate-500 font-medium">Stable</span>
             <span className="text-[9px] uppercase text-indigo-400 font-bold">68%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
