import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Users, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { projectAnalytics, tasks, teamMembers } from '../mockData';
import { motion } from 'motion/react';

const stats = [
  { label: 'Total Tasks', value: tasks.length.toString(), change: '+12%', trend: 'up', icon: CheckCircle2, color: 'text-brand-primary' },
  { label: 'Active Members', value: teamMembers.filter(m => m.status !== 'offline').length.toString(), change: '+2', trend: 'up', icon: Users, color: 'text-brand-secondary' },
  { label: 'Productivity', value: '88%', change: '-3%', trend: 'down', icon: TrendingUp, color: 'text-orange-400' },
  { label: 'Critical Ops', value: '2', change: '0', trend: 'stable', icon: AlertCircle, color: 'text-red-400' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Operational Intelligence</h2>
        <p className="text-sm text-slate-500">Real-time throughput and team bandwidth metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-container group hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-2 rounded-lg bg-slate-50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn("flex items-center text-xs font-bold px-2 py-1 rounded-full", 
                stat.trend === 'up' ? 'bg-green-50 text-green-600' : stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400')}>
                {stat.change}
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 ml-1" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 ml-1" />}
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tighter text-slate-900">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Chart */}
        <div className="lg:col-span-2 card-container h-[420px] bg-white">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                Workflow Throughput
              </h3>
              <p className="text-xs text-slate-400 mt-1">Velocity across all active projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Target</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <AreaChart data={projectAnalytics}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
              />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
              />
              <Area 
                type="monotone" 
                dataKey="active" 
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorActive)" 
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="#cbd5e1" 
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution */}
        <div className="card-container h-[420px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2">
            <div className="w-1 h-4 bg-slate-300 rounded-full" />
            Allocation Audit
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={[
                { name: 'Queue', value: tasks.filter(t => t.status === 'todo').length },
                { name: 'Active', value: tasks.filter(t => t.status === 'in-progress').length },
                { name: 'Audit', value: tasks.filter(t => t.status === 'review').length },
                { name: 'Done', value: tasks.filter(t => t.status === 'done').length },
              ]}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} dy={5} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                  {[0, 1, 2, 3].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#6366f1' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health Index</span>
            <span className="text-xs font-bold text-indigo-600">Optimal (94%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
