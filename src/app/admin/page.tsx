"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Target, Trophy, Clock, 
  Shield, Zap, TrendingUp,
  Activity, BarChart3, Globe
} from "lucide-react";
import Link from "next/link";

const QuickStat = ({ icon: Icon, label, value, color }: any) => (
  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
    <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</div>
      <div className="text-2xl font-black text-white tracking-tighter">{value}</div>
    </div>
  </div>
);

export default function AdminOverview() {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/interns");
        if (res.ok) {
          const data = await res.json();
          setStats({
            total: data.length,
            active: data.filter((i: any) => i.status !== 'completed').length,
            completed: data.filter((i: any) => i.status === 'completed').length
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Sovereign Admin Core v1.0</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Command<br /><span className="text-white/30">Station</span>
        </h1>
      </header>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStat icon={Users} label="Registered Nodes" value={stats.total} color="red-500" />
        <QuickStat icon={Activity} label="Active Syncs" value={stats.active} color="blue-400" />
        <QuickStat icon={Trophy} label="Certifications" value={stats.completed} color="emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Systems Status */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px]" />
          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Network Vitals</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Global Live</span>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {[
              { label: 'Cloud Database', value: 98, color: 'emerald-400' },
              { label: 'Authentication Buffer', value: 100, color: 'emerald-400' },
              { label: 'Task Distribution', value: 85, color: 'blue-400' },
            ].map((system) => (
              <div key={system.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{system.label}</span>
                  <span className={`text-[10px] font-black text-${system.color} uppercase tracking-widest`}>{system.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${system.value}%` }}
                    className={`h-full bg-${system.color} shadow-[0_0_10px_rgba(239,68,68,0.2)]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500/60">Quick Protocols</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/interns" className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-red-500/20 group transition-all">
              <BarChart3 className="w-6 h-6 text-white/40 group-hover:text-red-500 mb-4 transition-colors" />
              <div className="text-xs font-black text-white uppercase tracking-widest">Entry Registry</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-tighter mt-1">Manage Talent Nodes</div>
            </Link>
            <Link href="/admin/tasks" className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-red-500/20 group transition-all">
              <Globe className="w-6 h-6 text-white/40 group-hover:text-red-500 mb-4 transition-colors" />
              <div className="text-xs font-black text-white uppercase tracking-widest">Orchestrator</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-tighter mt-1">Deploy New Tasks</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
