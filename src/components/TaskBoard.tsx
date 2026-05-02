import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import {useWorkspace} from '../context/WorkspaceContext';

const statusConfig = {
  'todo': { label: 'Queue', color: 'bg-slate-50 border-slate-200' },
  'in-progress': { label: 'Active', color: 'bg-white border-indigo-200 shadow-sm' },
  'review': { label: 'Audit', color: 'bg-amber-50 border-amber-200 shadow-sm' },
  'done': { label: 'Finalized', color: 'bg-green-50 border-green-200' }
};

const priorityConfig = {
  'high': 'text-red-600',
  'medium': 'text-amber-600',
  'low': 'text-green-600'
};

export default function TaskBoard() {
  const {data} = useWorkspace();
  const {tasks, teamMembers} = data;
  const columns: (keyof typeof statusConfig)[] = ['todo', 'in-progress', 'review', 'done'];

  return (
    <div className="flex h-full flex-col space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Workflow Pipeline</h2>
          <p className="text-sm text-slate-500 mt-1">Status of active task deployments and audits.</p>
        </div>
        <div className="flex gap-2">
          <button className="h-11 w-full rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 sm:w-auto">
            Create Deployment
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4 lg:gap-6">
        {columns.map((status) => (
          <div key={status} className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", status === 'done' ? 'bg-green-500' : status === 'in-progress' ? 'bg-indigo-500' : 'bg-slate-300')} />
                {statusConfig[status].label}
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/50 p-3 min-h-[180px] 2xl:min-h-[500px]">
              {tasks.filter(t => t.status === status).map((task, i) => {
                const assignee = teamMembers.find(m => m.id === task.assigneeId);
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "cursor-pointer rounded-xl border p-4 bg-white hover:shadow-md hover:border-indigo-300 group transition-all duration-300",
                      statusConfig[status].color
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border", 
                        task.priority === 'high' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-500'
                      )}>
                        {task.priority} Prio
                      </span>
                      <div className="flex -space-x-1">
                        {assignee && (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600 shadow-sm overflow-hidden">
                            <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors leading-snug">{task.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>3</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.dueDate.split('-').slice(1).join('/')}</span>
                        </div>
                      </div>
                      <div className={cn("w-1.5 h-1.5 rounded-full", priorityConfig[task.priority].replace('text', 'bg'))} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
