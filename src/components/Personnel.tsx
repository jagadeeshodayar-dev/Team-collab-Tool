import React from 'react';
import { teamMembers } from '../mockData';
import { Mail, Shield, Zap, Globe, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Personnel() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Personnel Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Active team deployment and network status.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             {teamMembers.length} Active Nodes
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-container group hover:shadow-lg hover:border-indigo-100 relative overflow-hidden transition-all duration-300 bg-white"
          >
            <div className="relative z-10 flex items-start gap-5">
              <div className="relative">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm object-cover"
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

            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100">
                  <Mail className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100">
                  <Zap className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                Compliance Verified
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
