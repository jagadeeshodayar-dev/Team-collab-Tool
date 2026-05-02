import React from 'react';
import { Mail, Shield, Zap, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import {useWorkspace} from '../context/WorkspaceContext';

export default function Personnel() {
  const {data} = useWorkspace();
  const {teamMembers} = data;
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Personnel Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Active team deployment and network status.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             {teamMembers.length} Active Nodes
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3 lg:gap-6">
        {teamMembers.map((member, i) => (
          <div
            key={member.id}
            className="card-container group hover:shadow-lg hover:border-indigo-100 relative overflow-hidden transition-all duration-300 bg-white"
          >
            <div className="relative z-10 flex items-start gap-4 sm:gap-5">
              <div className="relative">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm object-cover sm:h-20 sm:w-20"
                />
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white",
                  member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 mt-0.5">{member.role}</p>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 flex gap-6">
                   <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-tight">Node ID</span>
                      <span className="text-xs font-medium text-slate-600 font-mono">#{member.id}0{i}B</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-tight">Status</span>
                      <span className={cn("text-xs font-bold uppercase tracking-wider", 
                        member.status === 'online' ? 'text-green-600' : member.status === 'busy' ? 'text-amber-600' : 'text-slate-400'
                      )}>{member.status}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100">
                  <Mail className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100">
                  <Zap className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                Compliance Verified
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
