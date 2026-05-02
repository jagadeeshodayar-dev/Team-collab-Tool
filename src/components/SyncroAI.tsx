import React, {useEffect, useMemo, useRef, useState} from 'react';
import {GoogleGenAI} from '@google/genai';
import {History, Plus, Send, Sparkles, Bot, User, Loader2, Trash2} from 'lucide-react';
import { cn } from '../lib/utils';
import {useWorkspace} from '../context/WorkspaceContext';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

interface SyncroAIProps {
  onOpenHistory?: () => void;
}

export default function SyncroAI({onOpenHistory}: SyncroAIProps) {
  const {data, actions} = useWorkspace();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeConversation = data.aiConversations.find((conversation) => conversation.id === data.activeAiConversationId) ?? data.aiConversations[0];
  const messages = activeConversation?.messages ?? [];
  const workspaceContext = useMemo(() => {
    const taskSummary = data.tasks.map((task) => `${task.title}: ${task.status}, ${task.progress}% complete, ${task.priority} priority, due ${task.dueDate}`).join('\n');
    const teamSummary = data.teamMembers.map((member) => `${member.name}: ${member.role}, ${member.status}`).join('\n');
    const unreadCount = data.notifications.filter((notification) => !notification.read).length;

    return [
      `Workspace: ${data.settings.organizationName} / ${data.settings.workspaceName}`,
      `Timezone: ${data.settings.timezone}`,
      `Unread notifications: ${unreadCount}`,
      `Open chat messages: ${data.chats.length}`,
      'Tasks:',
      taskSummary,
      'Team:',
      teamSummary,
    ].join('\n');
  }, [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    actions.addAiMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      if (!ai || !apiKey) {
        throw new Error('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to the environment before deploying.');
      }

      const contents = [...messages, userMessage].map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{text: m.content}],
      }));

      let responseText = '';
      let lastError: unknown = null;

      for (const model of GEMINI_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: [
                'You are Syncro AI, a concise team collaboration assistant.',
                'Use the workspace context to answer about priorities, owners, deadlines, risks, and next actions.',
                'Write in clear, practical language. If data is missing, say what is missing and suggest the next step.',
                workspaceContext,
              ].join('\n\n'),
            },
          });
          responseText = response.text?.trim() || '';
          if (responseText) break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!responseText) {
        throw lastError ?? new Error('Gemini returned an empty response.');
      }

      actions.addAiMessage({role: 'assistant', content: responseText});
    } catch (error) {
      console.error("Gemini Error:", error);
      const reason = error instanceof Error ? error.message : 'Unknown Gemini connection error.';
      actions.addAiMessage({role: 'assistant', content: `I could not reach Gemini yet. ${reason}`});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <div className="p-4 border-b border-line flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Neural Assistant</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activeConversation?.title ?? 'Active Intelligence'}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => actions.createAiConversation()} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600" aria-label="New AI chat">
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={onOpenHistory} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600" aria-label="Open AI chat history">
            <History className="h-4 w-4" />
          </button>
          {activeConversation && (
            <button onClick={() => actions.clearAiConversation(activeConversation.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600" aria-label="Clear current AI chat">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-white"
      >
        {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3 max-w-[90%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border",
                m.role === 'user' ? "bg-indigo-600 border-indigo-500" : "bg-white border-slate-200"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                m.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
              )}>
                {m.content}
              </div>
            </div>
          ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
            </div>
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl rounded-tl-none border border-slate-100 italic text-xs">
              Analyzing workflow patterns...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-line">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search knowledge base..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-6 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
