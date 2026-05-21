"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Target, Trophy, Clock, Search, 
  Shield, Zap, TrendingUp, Loader2,
  ChevronRight, Filter
} from "lucide-react";
import Link from "next/link";

const StatWidget = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 blur-[60px] group-hover:bg-${color}/10 transition-all`} />
    <div className="relative z-10 space-y-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</div>
        <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
        <TrendingUp className="w-3 h-3" /> {trend}
      </div>
    </div>
  </div>
);

export default function InternRegistryPage() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterns() {
      try {
        const res = await fetch("/api/admin/interns");
        if (res.ok) {
          const data = await res.json();
          setInterns(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInterns();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Administrative Supremacy Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            Intern<br /><span className="text-white/30">Registry</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Search Nodes..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-red-500/40 transition-all w-64"
            />
          </div>
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget icon={Users} label="Total Nodes" value={interns.length} trend="+12.5%" color="red-500" />
        <StatWidget icon={Target} label="Test Accuracy" value="94.2%" trend="+2.1%" color="blue-400" />
        <StatWidget icon={Trophy} label="Elite Onboarded" value="12" trend="+8.4%" color="purple-400" />
        <StatWidget icon={Clock} label="Avg Sync Time" value="4.2m" trend="-1.2s" color="emerald-400" />
      </div>

      {/* Registry Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Active Talent Pool</h3>
          <div className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3" /> Live Synchronization
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Candidate</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Registered ID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Domain</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                    </tr>
                  ))
                ) : interns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Users className="w-12 h-12" />
                        <span className="text-xs font-black uppercase tracking-widest">No candidates identified in registry</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  interns.map((intern: any, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      key={intern._id || intern.id} 
                      className="group hover:bg-white/[0.01] transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-xs">
                            {intern.name?.[0] || "U"}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{intern.name}</div>
                            <div className="text-[10px] font-medium text-white/40">{intern.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs text-white/60">
                          {intern.internId || intern._id?.substring(0, 8).toUpperCase() || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                          {intern.domain || "General"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${intern.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'}`}>
                           {intern.status || 'Active'}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/admin/interns/${intern._id}`}
                          className="inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 group-hover:text-white group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
