"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Trophy, Clock, Shield, Zap, 
  Cpu, DollarSign, Database, BrainCircuit,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const colorMap: Record<string, { bg: string, border: string, text: string }> = {
  "red-500": {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-500"
  },
  "blue-400": {
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    text: "text-blue-400"
  },
  "emerald-400": {
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    text: "text-emerald-400"
  }
};

const QuickStat = ({ icon: Icon, label, value, color }: any) => {
  const classes = colorMap[color] || { bg: "bg-white/10", border: "border-white/20", text: "text-white" };
  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
      <div className={`w-10 h-10 rounded-xl ${classes.bg} ${classes.border} flex items-center justify-center ${classes.text}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{label}</div>
        <div className="text-2xl font-black text-white tracking-tighter">{value}</div>
      </div>
    </div>
  );
};

export default function AdminOverview() {
  const [stats, setStats] = useState({ total: 0, interviewed: 0, admitted: 0 });
  const [cascadeTotals, setCascadeTotals] = useState({ totalSaved: 0, totalCalls: 0, totalCost: 0 });
  const [hindsightReviews, setHindsightReviews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [internsRes, logsRes, memoryRes] = await Promise.all([
          fetch("/api/admin/interns"),
          fetch("/api/admin/logs"),
          fetch("/api/admin/memory")
        ]);

        if (internsRes.ok) {
          const data = await internsRes.json();
          setStats({
            total: data.length,
            interviewed: data.filter((i: any) => i.status === 'INTERVIEWED').length,
            admitted: data.filter((i: any) => i.status === 'ADMITTED').length
          });
        }

        if (logsRes.ok) {
          const logData = await logsRes.json();
          setCascadeTotals(logData.totals || { totalSaved: 0, totalCalls: 0, totalCost: 0 });
        }

        if (memoryRes.ok) {
          setHindsightReviews(await memoryRes.json());
        }

      } catch (err) {
        console.error(err);
      }
    }
    fetchAllData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
          <Shield className="w-4 h-4 text-brand" />
          <span className="text-[10px] font-black text-brand uppercase tracking-widest">AI Hiring Command Center v2.0</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Command<br /><span className="text-white/30">Station</span>
        </h1>
      </header>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStat icon={Users} label="Talent Pool Nodes" value={stats.total} color="red-500" />
        <QuickStat icon={BrainCircuit} label="AI Interviews Completed" value={stats.interviewed} color="blue-400" />
        <QuickStat icon={Trophy} label="Approved Hires" value={stats.admitted} color="emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CascadeFlow Routing Analytics */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px]" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Model Routing Efficiency</h2>
              <span className="text-[9px] font-black text-brand uppercase tracking-widest border border-brand/20 px-2 py-0.5 rounded">Cascadeflow</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Total Saving</span>
                <p className="text-lg font-black text-emerald-400">${Number(cascadeTotals.totalSaved).toFixed(5)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Total Calls</span>
                <p className="text-lg font-black text-white">{cascadeTotals.totalCalls || 0}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Total Cost</span>
                <p className="text-lg font-black text-white/60">${Number(cascadeTotals.totalCost).toFixed(5)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold text-white/60 uppercase">
                  <span>Routing Optimization</span>
                  <span>{cascadeTotals.totalCalls ? "92%" : "0%"}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand w-[92%]" />
                </div>
              </div>
            </div>
          </div>

          <Link href="/admin/logs" className="block text-center py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
             Open Cost Audit Log Console
          </Link>
        </div>

        {/* Hindsight Organizational Memory */}
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px]" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Hindsight Learning Engine</h2>
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest border border-purple-500/20 px-2 py-0.5 rounded">Persistent Memory</span>
            </div>

            <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
              {hindsightReviews.length === 0 ? (
                <div className="text-center py-8 text-xs text-white/20 font-bold uppercase">No feedback loops recorded yet.</div>
              ) : (
                hindsightReviews.slice(0, 3).map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white uppercase">{r.name} ({r.role})</span>
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest">{r.stage} Review</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed font-semibold uppercase italic">"{r.feedback}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/admin/interns" className="block text-center py-4 bg-brand text-black hover:scale-[1.02] active:scale-95 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
             Evaluate Candidates in War Room
          </Link>
        </div>

      </div>
    </div>
  );
}
