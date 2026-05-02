import React from 'react';
import { notifications } from '../mockData';
import { Bell, Info, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const iconMap = {
  'info': <Info className="w-4 h-4 text-indigo-500" />,
  'success': <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'warning': <AlertTriangle className="w-4 h-4 text-amber-500" />,
  'error': <XCircle className="w-4 h-4 text-red-500" />
};

const bgMap = {
  'info': 'bg-indigo-50/50 border-indigo-100',
  'success': 'bg-green-50/50 border-green-100',
  'warning': 'bg-amber-50/50 border-amber-100',
  'error': 'bg-red-50/50 border-red-100'
};

export default function Notifications() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Broadcasts</h2>
          <p className="text-sm text-slate-500 mt-1">Global event feed and security status log.</p>
        </div>
        <button className="text-xs font-bold text-indigo-600 hover:underline px-3 py-1 bg-indigo-50 rounded-full">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "p-5 border rounded-xl flex items-start gap-4 transition-all hover:bg-white hover:shadow-md group",
              bgMap[n.type],
              !n.read && 'border-l-4 border-l-indigo-500'
            )}
          >
            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-slate-100">{iconMap[n.type]}</div>
            <div className="flex-1">
              <p className={cn("text-sm leading-relaxed", !n.read ? "text-slate-900 font-bold" : "text-slate-600 font-medium")}>
                {n.message}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>{n.timestamp}</span>
              </div>
            </div>
            {!n.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-2 shadow-lg shadow-indigo-200" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Decorative Brand Element */}
      <div className="mt-12 opacity-40 group">
        <div className="brand-line mb-1.5 h-0.5 rounded-full" />
        <div className="brand-line w-1/3 h-0.5 bg-slate-200 group-hover:w-full transition-all duration-1000 rounded-full" />
      </div>
    </div>
  );
}
