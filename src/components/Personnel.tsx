import React, {useMemo, useState} from 'react';
import {Mail, MessageCircle, Send, Shield, Zap} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {cn} from '../lib/utils';

export default function Personnel() {
  const {data, actions} = useWorkspace();
  const {teamMembers, tasks, chats} = data;
  const [activeMemberId, setActiveMemberId] = useState(teamMembers[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const activeMember = teamMembers.find((member) => member.id === activeMemberId) ?? teamMembers[0];
  const activeChats = useMemo(() => chats.filter((chat) => chat.memberId === activeMember?.id), [activeMember?.id, chats]);

  const sendMessage = () => {
    if (!activeMember || !message.trim()) return;
    actions.sendChatMessage(activeMember.id, message);
    setMessage('');
  };

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_24em] lg:p-8">
      <section className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">People & Coordination</h2>
            <p className="mt-1 text-sm text-slate-500">Assign work, check load, and message teammates from one directory.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {teamMembers.length} team members
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3 lg:gap-6">
          {teamMembers.map((member, index) => {
            const memberTasks = tasks.filter((task) => task.assigneeId === member.id);
            const activeTasks = memberTasks.filter((task) => task.status !== 'done');
            const isActive = activeMember?.id === member.id;

            return (
              <button
                type="button"
                key={member.id}
                onClick={() => setActiveMemberId(member.id)}
                className={cn(
                  'card-container group relative overflow-hidden bg-white text-left transition hover:border-indigo-200 hover:shadow-lg',
                  isActive && 'border-indigo-300 ring-2 ring-indigo-500/20',
                )}
              >
                <div className="relative z-10 flex items-start gap-4 sm:gap-5">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="h-16 w-16 rounded-2xl border border-slate-100 bg-slate-50 object-cover shadow-sm sm:h-20 sm:w-20" />
                    <span
                      className={cn(
                        'absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white',
                        member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300',
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-bold text-slate-900 transition group-hover:text-indigo-600">{member.name}</h3>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-500">{member.role}</p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400">Assigned</span>
                        <p className="text-sm font-bold text-slate-900">{memberTasks.length}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400">Active</span>
                        <p className="text-sm font-bold text-slate-900">{activeTasks.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-wider',
                        member.status === 'online' ? 'text-green-600' : member.status === 'busy' ? 'text-amber-600' : 'text-slate-400',
                      )}
                    >
                      {member.status}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">#{member.id.slice(-5)}0{index}B</span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-lg border border-transparent bg-slate-50 text-slate-400 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <span className="grid h-9 w-9 place-items-center rounded-lg border border-transparent bg-slate-50 text-slate-400 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <Zap className="h-4.5 w-4.5" />
                      </span>
                    </div>
                    <span className="flex items-center justify-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                      <Shield className="h-3.5 w-3.5 text-indigo-500" />
                      Verified
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0">
        {activeMember && (
          <div className="card-container sticky top-20 flex max-h-[calc(100vh-7em)] flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <img src={activeMember.avatar} alt={activeMember.name} className="h-11 w-11 rounded-full bg-slate-100" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{activeMember.name}</p>
                <p className="truncate text-xs text-slate-500">{activeMember.role}</p>
              </div>
              <MessageCircle className="ml-auto h-5 w-5 text-indigo-500" />
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
              {activeChats.length === 0 ? (
                <p className="p-3 text-center text-xs text-slate-500">No messages yet. Start the coordination thread.</p>
              ) : (
                activeChats.map((chat) => (
                  <div key={chat.id} className={cn('flex', chat.sender === 'user' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[86%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm',
                        chat.sender === 'user' ? 'rounded-br-none bg-indigo-600 text-white' : 'rounded-bl-none border border-slate-100 bg-white text-slate-700',
                      )}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                placeholder={`Message ${activeMember.name.split(' ')[0]}...`}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button onClick={sendMessage} className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
