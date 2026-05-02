import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {TrendingUp, Users, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight} from 'lucide-react';
import {projectAnalytics, tasks, teamMembers} from '../mockData';
import {motion} from 'motion/react';
import {cn} from '../lib/utils';

const stats = [
  {label: 'Total Tasks', value: tasks.length.toString(), change: '+12%', trend: 'up', icon: CheckCircle2, color: 'text-brand-primary'},
  {label: 'Active Members', value: teamMembers.filter((m) => m.status !== 'offline').length.toString(), change: '+2', trend: 'up', icon: Users, color: 'text-brand-secondary'},
  {label: 'Productivity', value: '88%', change: '-3%', trend: 'down', icon: TrendingUp, color: 'text-orange-400'},
  {label: 'Critical Ops', value: '2', change: '0', trend: 'stable', icon: AlertCircle, color: 'text-red-400'},
];

const taskDistribution = [
  {name: 'Queue', value: tasks.filter((t) => t.status === 'todo').length},
  {name: 'Active', value: tasks.filter((t) => t.status === 'in-progress').length},
  {name: 'Audit', value: tasks.filter((t) => t.status === 'review').length},
  {name: 'Done', value: tasks.filter((t) => t.status === 'done').length},
];

export default function Dashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">Operational Intelligence</h2>
        <p className="text-sm text-slate-500">Real-time throughput and team bandwidth metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: i * 0.1}}
            className="card-container group hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className={cn('p-2 rounded-lg bg-slate-50 shrink-0', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div
                className={cn(
                  'flex items-center text-xs font-bold px-2 py-1 rounded-full shrink-0',
                  stat.trend === 'up'
                    ? 'bg-green-50 text-green-600'
                    : stat.trend === 'down'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-slate-50 text-slate-400',
                )}
              >
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
        <section className="xl:col-span-2 card-container bg-white min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                Workflow Throughput
              </h3>
              <p className="text-xs text-slate-400 mt-1">Velocity across all active projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Completed</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] sm:h-[360px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={projectAnalytics} margin={{top: 8, right: 8, left: -20, bottom: 8}}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 500}} />
                <Tooltip contentStyle={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px'}} />
                <Area key="active-area" type="monotone" dataKey="active" name="Active" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
                <Area key="completed-area" type="monotone" dataKey="completed" name="Completed" stroke="#cbd5e1" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-container flex flex-col bg-white min-w-0">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-300 rounded-full" />
            Allocation Audit
          </h3>

          <div className="h-[260px] sm:h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={taskDistribution} margin={{top: 8, right: 8, left: -20, bottom: 8}}>
                <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} axisLine={false} tickLine={false} dy={5} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px'}} />
                <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]} barSize={32}>
                  {taskDistribution.map((item, index) => (
                    <Cell key={`task-distribution-${item.name}`} fill={index === 1 ? '#6366f1' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center gap-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health Index</span>
            <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">Optimal (94%)</span>
          </div>
        </section>
      </div>
    </div>
  );
}
