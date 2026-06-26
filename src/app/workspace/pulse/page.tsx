"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, GitMerge, Cpu, Network } from "lucide-react";

export default function NeuralPulsePage() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Telemetry Active</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
        >
          Neural <span className="text-white/40">Pulse</span>
        </motion.h1>
      </header>

      {/* Main Graph Placeholder */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-10 rounded-[3rem] bg-black/40 border border-white/5 relative overflow-hidden"
      >
         <div className="flex items-center justify-between mb-8">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Productivity Heatmap</h2>
           <div className="flex gap-2">
             <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">24H</span>
             <span className="px-3 py-1 rounded-full bg-brand/10 text-[10px] font-black uppercase tracking-widest text-brand border border-brand/20">7D</span>
             <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">30D</span>
           </div>
         </div>
         
         {/* Fake Graph */}
         <div className="h-64 w-full flex items-end justify-between gap-2 opacity-50 relative z-10">
           {[...Array(24)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${Math.max(20, Math.random() * 100)}%` }}
               transition={{ delay: 0.5 + (i * 0.05), type: "spring" }}
               className={`w-full rounded-t-sm ${i > 18 ? 'bg-brand shadow-[0_0_10px_var(--color-brand)]' : 'bg-white/10'}`}
             />
           ))}
         </div>
         
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: GitMerge, label: "Code Commits", value: "142", trend: "+12%" },
          { icon: Cpu, label: "AI Audits Passed", value: "98.5%", trend: "Stable" },
          { icon: Network, label: "Network Sync", value: "Optimal", trend: "0ms" }
        ].map((metric, i) => (
           <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col justify-between"
           >
             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60 mb-6">
               <metric.icon className="w-5 h-5" />
             </div>
             <div>
               <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{metric.label}</div>
               <div className="flex items-end justify-between">
                 <div className="text-3xl font-black text-white tracking-tighter">{metric.value}</div>
                 <div className="text-xs font-bold text-brand uppercase">{metric.trend}</div>
               </div>
             </div>
           </motion.div>
        ))}
      </div>
    </div>
  );
}
