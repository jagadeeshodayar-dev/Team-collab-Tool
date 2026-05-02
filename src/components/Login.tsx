import React, {useState} from 'react';
import {Activity, ArrowRight, LockKeyhole, Mail, UserRound} from 'lucide-react';
import {WorkspaceUser} from '../types';

interface LoginProps {
  onLogin: (user: WorkspaceUser) => void;
}

export default function Login({onLogin}: LoginProps) {
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@syncpro.team');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin({
      name: name.trim() || 'Team Member',
      email: email.trim() || 'member@syncpro.team',
      role: 'Product Lead',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">Sync Pro</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-indigo-300">Team Collaboration</p>
              </div>
            </div>
            <h1 className="text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl">
              Work clarity for fast-moving teams.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              Sign in to view tasks, people, updates, workspace settings, and the AI assistant from one clean dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
            <div className="mb-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500">Use your workspace details to continue.</p>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</span>
              <div className="relative mt-2">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </label>

            <label className="mt-4 block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </label>

            <button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              Enter workspace
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
