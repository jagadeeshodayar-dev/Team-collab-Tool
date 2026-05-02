import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import Personnel from './components/Personnel';
import Notifications from './components/Notifications';
import SyncroAI from './components/SyncroAI';
import { Search, Globe, ChevronRight, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAiOpen, setIsAiOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <TaskBoard />;
      case 'team': return <Personnel />;
      case 'notifications': return <Notifications />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-18 border-b border-slate-200 flex items-center justify-between px-8 bg-white z-40 sticky top-0 shrink-0 shadow-sm">
          <div className="flex items-center gap-6 flex-1">
             <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-800">Team Sync Pro</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Workflow Active</span>
             </div>
             <div className="w-px h-6 bg-slate-200" />
             <div className="relative w-full max-w-sm group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search resources..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800">Alex Rivera</p>
                  <p className="text-[11px] text-slate-500 font-medium">Product Lead</p>
               </div>
               <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center font-bold text-slate-600 shadow-inner">
                  AR
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {/* Welcome/Hero Section (Conditional for Dashboard) */}
          {activeTab === 'dashboard' && (
            <div className="relative pt-10 pb-4 px-8 overflow-hidden bg-white border-b border-slate-200 shadow-sm">
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="relative z-10"
               >
                 <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-indigo-500">Live Status Report</span>
                 </div>
                 <h1 className="display-title mb-6">
                    Performance<br /><span className="text-slate-400">& Systems</span>
                 </h1>
                 <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                       Analysis Dashboard
                    </button>
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all">
                       Export Data
                    </button>
                 </div>
               </motion.div>
            </div>
          )}

          <div className="p-4">
            {renderContent()}
          </div>
        </div>

        {/* Footer Area with System Status */}
        <footer className="h-10 border-t border-slate-200 flex items-center justify-between px-8 bg-white text-[10px] font-medium text-slate-400 uppercase shrink-0">
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> All Systems Nominal</span>
              <span className="hidden sm:inline">Refresh Rate: 12ms</span>
           </div>
           <div className="flex items-center gap-6">
              <span>Cloud Engine v4.0</span>
              <span className="hidden sm:inline">© 2026 Enterprise Solutions</span>
           </div>
        </footer>

        {/* AI FAB */}
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={cn(
            "fixed bottom-20 right-8 w-14 h-14 rounded-full flex items-center justify-center z-50 transition-all duration-500 shadow-xl shadow-indigo-200 overflow-hidden group",
            isAiOpen ? "bg-slate-800 rotate-90" : "bg-indigo-600"
          )}
        >
          {isAiOpen ? (
            <ChevronRight className="w-6 h-6 text-white" />
          ) : (
            <Activity className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* AI Sidebar Overlay */}
        <AnimatePresence>
          {isAiOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-[60] bg-bg-deep shadow-[-20px_0_40px_rgba(0,0,0,0.5)] border-l border-line"
            >
              <div className="flex flex-col h-full bg-surface">
                 <div className="h-20 border-b border-line flex items-center justify-between px-6 shrink-0">
                    <h2 className="font-bold uppercase italic tracking-widest text-brand-primary flex items-center gap-2">
                       <Activity className="w-4 h-4" />
                       Cortex Sub-Routine
                    </h2>
                    <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                       <ChevronRight className="w-5 h-5 text-white/40" />
                    </button>
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <SyncroAI />
                 </div>
              </div>
            </motion.div>
          )}
          {isAiOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] cursor-pointer"
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
