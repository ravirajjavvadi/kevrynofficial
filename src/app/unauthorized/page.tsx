"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldX, ArrowLeft, Lock, Fingerprint, Zap } from "lucide-react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 neural-grid opacity-[0.03] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 blur-[150px] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full relative z-10 p-1 rounded-[2.5rem] bg-gradient-to-b from-red-500/20 via-white/5 to-transparent border border-white/5 shadow-[0_0_80px_rgba(239,68,68,0.1)]"
      >
        <div className="p-12 rounded-[2.4rem] bg-[#050505]/90 backdrop-blur-3xl text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative group">
              <ShieldX className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
              <div className="absolute -inset-2 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">
              <Fingerprint className="w-3 h-3" /> Access Protocol Denied
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Unauthorized Node</h1>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              Your identity is not currently recognized in the <strong>Sovereign Intern Registry</strong>. Access to this quadrant is restricted to selected candidates.
            </p>
          </div>

          <div className="pt-4 grid grid-cols-1 gap-4">
            <Link 
              href="/"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Return to Surface
            </Link>
            <button 
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all active:scale-95"
            >
              Sign Out & Recalibrate
            </button>
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Lock className="w-3 h-3" /> Encrypted
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Active Guard
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Info */}
      <div className="mt-12 text-center relative z-10">
        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">KarsaTek OS Sovereign AI Kernel v1.0</p>
      </div>
    </div>
  );
}
