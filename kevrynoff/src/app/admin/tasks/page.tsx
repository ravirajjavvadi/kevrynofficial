"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const MOCK_TASKS = [
  {
    id: "TSK-091",
    title: "Develop Sovereign Social Interface",
    assignedTo: "Alex Rivera",
    domain: "Quantum Web",
    priority: "HIGH",
    status: "IN_PROGRESS",
    deadline: "2026-05-21",
    submissions: 1
  },
  {
    id: "TSK-092",
    title: "Optimize Neural Grid Scaling",
    assignedTo: "All Interns (Neural)",
    domain: "Neural Native",
    priority: "MEDIUM",
    status: "PENDING",
    deadline: "2026-05-23",
    submissions: 0
  },
  {
    id: "TSK-093",
    title: "Implement Autonomous Code Auditor Logic",
    assignedTo: "Marcus Thorne",
    domain: "Sovereign Backend",
    priority: "URGENT",
    status: "UNDER_REVIEW",
    deadline: "2026-05-20",
    submissions: 3
  }
];

export default function AdminTasksPage() {
  const [isDeploying, setIsDeploying] = useState(false);

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-8">
        <div className="space-y-4">
          <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Workload Management</div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Task<br/><span className="text-red-500">Orchestrator</span></h1>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsDeploying(!isDeploying)}
             className="px-10 py-5 rounded-2xl bg-red-500 text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-all"
           >
             Deploy New Task <Plus className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* Task Deployment Console (Toggleable) */}
      <AnimatePresence>
        {isDeploying && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-red-500/20 mb-8 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
               <h3 className="text-xl font-black text-white uppercase tracking-tighter relative z-10">Initialize New Task Protocol</h3>
               
               <form className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Task Title</label>
                   <input type="text" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-red-500 outline-none transition-all" placeholder="e.g. Architect Core API" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Target Domain / Intern</label>
                   <select className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 outline-none transition-all appearance-none">
                     <option>Global (All Interns)</option>
                     <option>Domain: Quantum Web</option>
                     <option>Domain: Sovereign Backend</option>
                     <option>Target: Alex Rivera (INT-782)</option>
                   </select>
                 </div>
                 <div className="lg:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Task Description</label>
                   <textarea rows={3} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-red-500 outline-none transition-all resize-none" placeholder="Provide protocol specifications..." />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Deadline</label>
                   <input type="date" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-red-500 outline-none transition-all" />
                 </div>
                 <div className="flex items-end justify-end">
                   <button type="button" className="px-10 py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                     Execute Deployment
                   </button>
                 </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-all" />
            <input 
              type="text" 
              placeholder="Search Task Matrix..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase text-white outline-none focus:border-red-500/40 transition-all"
            />
          </div>
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <div className="rounded-[3rem] bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Task ID & Title</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned Target</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status / Priority</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progress</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {MOCK_TASKS.map((task) => (
                 <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                   <td className="px-8 py-6">
                      <div className="text-sm font-bold text-white mb-1 group-hover:text-red-500 transition-colors uppercase pr-4">{task.title}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{task.id} &bull; {task.domain}</div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="text-xs font-bold text-white">{task.assignedTo}</div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
                          ${task.priority === 'URGENT' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 
                            task.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-white/60'}
                        `}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          {task.status === 'UNDER_REVIEW' ? <AlertCircle className="w-3 h-3 text-yellow-500" /> : <Clock className="w-3 h-3" />}
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${task.submissions > 0 ? 'bg-red-500 w-full' : 'w-0'}`} />
                           </div>
                         </div>
                         <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                           {task.submissions} Submissions
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                         Review
                      </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
