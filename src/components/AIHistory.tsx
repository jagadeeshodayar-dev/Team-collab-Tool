import React from 'react';
import {Bot, Clock, MessageSquareText, Plus, User} from 'lucide-react';
import {useWorkspace} from '../context/WorkspaceContext';
import {cn} from '../lib/utils';

const formatTime = (date: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));

export default function AIHistory() {
  const {data, actions} = useWorkspace();
  const activeConversation = data.aiConversations.find((conversation) => conversation.id === data.activeAiConversationId);

  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[20em_minmax(0,1fr)] lg:p-8">
      <section className="min-w-0 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">AI Chat History</h2>
          <p className="mt-1 text-sm text-slate-500">Review previous Syncro AI planning, risk, and coordination conversations.</p>
        </div>

        <button
          onClick={() => actions.createAiConversation()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New AI Chat
        </button>

        <div className="space-y-3">
          {data.aiConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => actions.setActiveAiConversation(conversation.id)}
              className={cn(
                'w-full rounded-xl border bg-white p-4 text-left transition hover:border-indigo-200 hover:shadow-sm',
                conversation.id === data.activeAiConversationId && 'border-indigo-300 ring-2 ring-indigo-500/20',
              )}
            >
              <p className="line-clamp-1 text-sm font-bold text-slate-900">{conversation.title}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(conversation.updatedAt)}
              </p>
              <p className="mt-2 text-xs text-slate-500">{conversation.messages.length} messages</p>
            </button>
          ))}
        </div>
      </section>

      <section className="card-container min-w-0">
        {activeConversation ? (
          <div className="flex h-full min-h-[34em] flex-col">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Active conversation</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{activeConversation.title}</h3>
            </div>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              {activeConversation.messages.map((message) => (
                <div key={message.id} className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}>
                  <div
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-lg border shadow-sm',
                      message.role === 'user' ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-indigo-600',
                    )}
                  >
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn('max-w-[78%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm', message.role === 'user' ? 'rounded-tr-none bg-indigo-600 text-white' : 'rounded-tl-none border border-slate-100 bg-white text-slate-700')}>
                    {message.content}
                    <p className={cn('mt-2 text-[10px] font-bold uppercase', message.role === 'user' ? 'text-indigo-100' : 'text-slate-400')}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid min-h-[24em] place-items-center text-center">
            <div>
              <MessageSquareText className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-bold text-slate-900">No AI chats yet</p>
              <p className="mt-1 text-sm text-slate-500">Start a conversation from the assistant drawer.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
