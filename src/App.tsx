import React, {useState} from 'react';
import {Activity, Bell, ChevronRight, Download, LogOut, Search, X} from 'lucide-react';
import {AnimatePresence, motion} from 'motion/react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Personnel from './components/Personnel';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import SyncroAI from './components/SyncroAI';
import TaskBoard from './components/TaskBoard';
import {useWorkspace} from './context/WorkspaceContext';
import {cn} from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const {data, user, login, logout, unreadCount} = useWorkspace();

  if (!user) {
    return <Login onLogin={login} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'analytics':
        return <Dashboard />;
      case 'tasks':
        return <TaskBoard />;
      case 'team':
        return <Personnel />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'team-sync-export.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans lg:flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="min-w-0 flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="min-w-0 flex items-center gap-3 sm:gap-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 lg:hidden">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="truncate text-base font-bold sm:text-xl">{data.settings.organizationName}</h1>
                  <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase text-indigo-600 sm:inline-flex">
                    Workflow Active
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 sm:hidden">{data.settings.workspaceName}</p>
              </div>
            </div>

            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <label className="relative w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </label>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <button
                onClick={() => setActiveTab('notifications')}
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600"
                aria-label="Open notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-tight">{user.name}</p>
                  <p className="text-[11px] font-medium text-slate-500">{user.role}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-600 shadow-inner">
                  {initials}
                </div>
                <button
                  onClick={logout}
                  className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:text-red-600 sm:grid"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth pb-24 lg:pb-0">
          {activeTab === 'dashboard' && (
            <section className="border-b border-slate-200 bg-white">
              <div className="mx-auto max-w-[1680px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:py-12">
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="max-w-5xl">
                  <div className="mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500">Live Status Report</span>
                  </div>
                  <h2 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-slate-950 sm:text-7xl lg:text-8xl">
                    Performance
                    <span className="block text-slate-400">& Systems</span>
                  </h2>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                    >
                      Analysis Dashboard
                    </button>
                    <button
                      onClick={exportData}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          <div className="mx-auto max-w-[1680px] px-0">{renderContent()}</div>
        </div>

        <footer className="hidden h-10 items-center justify-between border-t border-slate-200 bg-white px-8 text-[10px] font-medium uppercase text-slate-400 lg:flex">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" /> All Systems Nominal
            </span>
            <span>Refresh Rate: 12ms</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Cloud Engine v4.0</span>
            <span>2026 Enterprise Solutions</span>
          </div>
        </footer>

        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={cn(
            'fixed bottom-24 right-4 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl shadow-indigo-300 transition duration-300 sm:bottom-8 sm:right-8',
            isAiOpen ? 'rotate-90 bg-slate-900' : 'bg-indigo-600 hover:bg-indigo-700',
          )}
          aria-label={isAiOpen ? 'Close Syncro AI' : 'Open Syncro AI'}
        >
          {isAiOpen ? <ChevronRight className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
        </button>

        <AnimatePresence>
          {isAiOpen && (
            <>
              <motion.div
                initial={{x: '100%'}}
                animate={{x: 0}}
                exit={{x: '100%'}}
                transition={{type: 'spring', damping: 25, stiffness: 200}}
                className="fixed inset-y-0 right-0 z-[60] w-full border-l border-slate-200 bg-white shadow-2xl sm:w-[420px]"
              >
                <div className="flex h-full flex-col">
                  <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 sm:px-6">
                    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
                      <Activity className="h-4 w-4" />
                      Cortex Sub-Routine
                    </h2>
                    <button onClick={() => setIsAiOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <SyncroAI />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={() => setIsAiOpen(false)}
                className="fixed inset-0 z-[55] bg-slate-950/40 backdrop-blur-sm"
              />
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
