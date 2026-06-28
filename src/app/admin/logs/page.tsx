"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Terminal, Activity, 
  Cpu, DollarSign, Database, Loader2
} from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({ totalSaved: 0, totalCost: 0, totalCalls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/admin/logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
          setTotals(data.totals || { totalSaved: 0, totalCost: 0, totalCalls: 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
          <Shield className="w-4 h-4 text-brand" />
          <span className="text-[10px] font-black text-brand uppercase tracking-widest">CascadeFlow Routing Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Audit<br /><span className="text-white/30">Logs</span>
        </h1>
      </header>

      {/* Aggregate Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] group-hover:bg-emerald-500/10 transition-all" />
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Routed Savings</div>
            <div className="text-3xl font-black text-white tracking-tighter">${totals.totalSaved ? Number(totals.totalSaved).toFixed(5) : "0.00000"}</div>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[60px] group-hover:bg-brand/10 transition-all" />
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Decentralized AI Calls</div>
            <div className="text-3xl font-black text-white tracking-tighter">{totals.totalCalls || 0}</div>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] group-hover:bg-blue-500/10 transition-all" />
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Accumulated Routing Cost</div>
            <div className="text-3xl font-black text-white tracking-tighter">${totals.totalCost ? Number(totals.totalCost).toFixed(5) : "0.00000"}</div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Audit Transaction History</h3>
          <div className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 animate-pulse" /> Live Telemetry
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Timestamp</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Assigned Model</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Tokens</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Latency</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Cost Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Terminal className="w-12 h-12" />
                        <span className="text-xs font-black uppercase tracking-widest">No transactions registered</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log: any, i) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      key={log._id} 
                      className="group hover:bg-white/[0.01] transition-all"
                    >
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-white/60">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs text-white font-bold">
                          {log.model}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs text-white/60">Total: {log.totalTokens}</div>
                        <div className="text-[9px] text-white/40">Prompt: {log.promptTokens} | Compl: {log.completionTokens}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-semibold text-white/60">
                          {log.latencyMs} ms
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`text-xs font-black ${log.costSaved > 0 ? "text-emerald-400" : "text-white/20"}`}>
                          {log.costSaved > 0 ? `+$${Number(log.costSaved).toFixed(5)}` : "$0.00"}
                        </span>
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
