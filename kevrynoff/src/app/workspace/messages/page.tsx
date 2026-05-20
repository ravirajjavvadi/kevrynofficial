"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle, Info, ShieldCheck } from "lucide-react";

export default function BriefingsPage() {
  const briefings = [
    {
      id: 1,
      type: "critical",
      title: "Mandatory Security Patch Protocol",
      date: "May 20, 2026 - 0900 Hours",
      content: "All Intern Architects must update their local `.env` keys. A secondary failover network has been established for Prisma caching. Failure to comply will result in system lockout.",
      icon: AlertTriangle,
      color: "red-500"
    },
    {
      id: 2,
      type: "update",
      title: "Neural Engine V5 Deployment",
      date: "May 19, 2026 - 1430 Hours",
      content: "The Groq AI interface has been successfully locked as the primary intelligence provider. Submissions will now be audited in under 400ms.",
      icon: Info,
      color: "blue-500"
    },
    {
      id: 3,
      type: "clearance",
      title: "Access Level Upgraded",
      date: "May 18, 2026 - 1100 Hours",
      content: "Your clearance has been elevated to Level 3 following the successful deployment of the authentication UI. You may now access the Sovereign Databanks.",
      icon: ShieldCheck,
      color: "brand"
    }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-12">
      <header className="space-y-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit"
        >
          <MessageSquare className="w-4 h-4 text-white/60" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Admin Communications</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
        >
          System <span className="text-white/40">Briefings</span>
        </motion.h1>
      </header>

      <div className="space-y-6">
        {briefings.map((brief, i) => (
          <motion.div
            key={brief.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-8 rounded-[2rem] bg-black/40 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${brief.color} opacity-50`} />
            
            <div className="flex gap-6">
              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-${brief.color}/10 border border-${brief.color}/20 text-${brief.color}`}>
                <brief.icon className="w-5 h-5" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{brief.date}</div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">{brief.title}</h3>
                </div>
                <p className="text-sm font-medium text-white/60 leading-relaxed max-w-2xl">
                  {brief.content}
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline">Acknowledge Directive</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
