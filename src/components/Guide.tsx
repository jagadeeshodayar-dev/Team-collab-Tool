import React from 'react';
import {Bell, Bot, CheckCircle2, MessageCircle, Search, Settings, UserRoundCheck} from 'lucide-react';

const guideItems = [
  {
    icon: CheckCircle2,
    title: 'Run the workflow',
    description: 'Open Workflows, create a task, assign an owner, then move progress from Queue to Active, Audit, and Finalized.',
  },
  {
    icon: UserRoundCheck,
    title: 'Coordinate owners',
    description: 'Use Directory to review each teammate load and open the right conversation before reassigning critical work.',
  },
  {
    icon: MessageCircle,
    title: 'Chat with members',
    description: 'Select a teammate and send a message. The thread is stored locally and a notification is created.',
  },
  {
    icon: Bell,
    title: 'Track notifications',
    description: 'Use the header bell as the single notification entry point. Mark updates read or clear completed items.',
  },
  {
    icon: Bot,
    title: 'Use Syncro AI',
    description: 'Ask the assistant about risks, owners, deadlines, progress, and next actions. AI history is saved.',
  },
  {
    icon: Settings,
    title: 'Configure workspace',
    description: 'Use Settings to update workspace names, timezone, notification preferences, and compact layout options.',
  },
];

export default function Guide() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Working guide</p>
          <h2 className="mt-2 text-2xl font-black tracking-normal text-slate-950 sm:text-4xl">How to use Sync Pro</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Sync Pro is designed around one operating loop: plan work, assign owners, coordinate with people, read updates, and ask AI for next-step guidance.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guideItems.map((item) => (
          <article key={item.title} className="card-container">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="card-container">
        <div className="flex items-start gap-3">
          <Search className="mt-1 h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="font-bold text-slate-900">Global search</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Search from the header for tasks, people, notifications, and AI chat history. Selecting a result opens the matching workspace area.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
