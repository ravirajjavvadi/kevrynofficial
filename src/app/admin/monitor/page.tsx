"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Terminal, 
  ShieldAlert, 
  Activity,
  ChevronRight,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock
} from "lucide-react";

const AdminStatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-all">
    <div className="relative z-10 space-y-4">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-500`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
        <div className="flex items-end gap-3">
          <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
          <div className="mb-1 text-[10px] font-bold text-green-500 flex items-center gap-1">
             <ArrowUpRight className="w-3 h-3" /> {trend}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MOCK_INTERNS = [
  { id: "INT-782", name: "Alex Rivera", role: "Quantum Web", score: 88, status: "WORKING", lastTask: "Sovereign Social UI" },
  { id: "INT-901", name: "Sarah Chen", role: "AI Native", score: 94, status: "IDLE", lastTask: "Model Fine-tuning" },
  { id: "INT-442", name: "Marcus Thorne", role: "Sovereign Backend", score: 72, status: "STUCK", lastTask: "Audit Logic" },
];

export default function AdminMonitor() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Admin Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-8">
        <div className="space-y-4">
          <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Sovereign Control</div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Global<br/><span className="text-red-500">Pulse</span></h1>
        </div>

        <div className="flex items-center gap-4">
           <button className="px-10 py-5 rounded-2xl bg-red-500 text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-all">
             Initialize Task <Plus className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard icon={Users} label="Active Interns" value="42" trend="+12%" color="red" />
        <AdminStatCard icon={Terminal} label="Active Tasks" value="156" trend="+8%" color="blue" />
        <AdminStatCard icon={ShieldAlert} label="Security Alerts" value="0" trend="0%" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Live Activity Matrix */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Neural Activity Matrix</h3>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Real-time Sync Active</span>
              </div>
           </div>

           <div className="rounded-[3rem] bg-white/[0.02] border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Intern Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Domain</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mastery</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {MOCK_INTERNS.map((intern) => (
                     <tr key={intern.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-black text-xs">
                                {intern.name.charAt(0)}
                             </div>
                             <div>
                                <div className="text-sm font-bold text-white">{intern.name}</div>
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{intern.id}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-8 text-[10px] font-black text-white uppercase tracking-widest">{intern.role}</td>
                       <td className="px-8 py-8">
                          <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
                            ${intern.status === 'WORKING' ? 'bg-blue-500/20 text-blue-400' : 
                              intern.status === 'STUCK' ? 'bg-red-500/20 text-red-400' :
                              'bg-green-500/20 text-green-400'}
                          `}>
                            {intern.status}
                          </span>
                       </td>
                       <td className="px-8 py-8">
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${intern.score}%` }} />
                             </div>
                             <span className="text-xs font-black text-white">{intern.score}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-8 text-right">
                          <button className="p-3 rounded-xl hover:bg-white/5 transition-all">
                             <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </button>
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Audit Stream */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Audit Logic Stream</h3>
           <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                       <span>Submission Audit</span>
                       <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> 4m ago</span>
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">Intern Alex Rivera submitted 'Sovereign Social UI' for review.</div>
                  </div>
                </div>
              ))}
           </div>
           <button className="w-full py-4 rounded-[1.5rem] border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-muted-foreground">View Full Audit History</button>
        </div>
      </div>
    </div>
  );
}
