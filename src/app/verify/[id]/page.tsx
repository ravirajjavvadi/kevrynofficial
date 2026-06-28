"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { 
  CheckCircle, Shield, Calendar, Award, 
  Terminal, Share2, Download, AlertTriangle 
} from "lucide-react"
import { getInternData, InternData } from "@/lib/registry"

export default function VerificationPage() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<InternData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function verifyIntern() {
      try {
        const res = await fetch(`/api/intern/${id}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          // Legacy Fallback
          const localResult = getInternData(id);
          setData(localResult);
        }
      } catch (err) {
        console.error("Verification error:", err);
        const localResult = getInternData(id);
        setData(localResult);
      } finally {
        setIsLoading(false);
      }
    }
    
    verifyIntern();
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full"
        />
        <p className="text-[10px] font-black text-brand uppercase tracking-[0.5em] animate-pulse">Running Neural Verification Protocol...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[3rem] space-y-6 max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Registry Conflict</h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
            The provided ID [ {id} ] does not exist in the KarsaTek OS Sovereign Registry.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl"
          >
            Return to Core
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground selection:bg-brand selection:text-black relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Cinematic Background */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10 space-y-12"
      >
        {/* Verification Badge */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-brand/10 border border-brand/30 shadow-[0_0_30px_var(--color-brand-glow)]"
          >
            <CheckCircle className="w-5 h-5 text-brand" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Credential Authenticated</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Sovereign <span className="text-brand">Intern.</span>
          </h1>
        </div>

        {/* Credential Card */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-12 md:p-16 space-y-8 md:space-y-12 shadow-2xl relative overflow-hidden group hover:border-brand/30 transition-all duration-700">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 md:pb-12">
              <div className="space-y-1 md:space-y-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Appointed Architect</span>
                 <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase whitespace-nowrap">{data.name}</h2>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">ID Sequence</span>
                 <p className="text-sm sm:text-lg font-mono font-bold text-brand uppercase tracking-widest break-all">{data.id}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-3 text-brand">
                    <Award className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Assigned Role</span>
                 </div>
                 <p className="text-xl font-black uppercase tracking-tighter">{data.role}</p>
              </div>
              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-3 text-accent">
                    <Terminal className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">KarsaTek OS AI Score</span>
                 </div>
                 <p className="text-4xl font-black tracking-tighter text-accent">{data.score}%</p>
              </div>
           </div>

           <div className="flex items-center justify-between pt-12 border-t border-white/5">
              <div className="flex items-center gap-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                    <span className="text-sm font-bold text-green-500 uppercase tracking-widest">Verified</span>
                 </div>
                 <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cohort</span>
                    <span className="text-sm font-bold text-foreground uppercase tracking-widest">{new Date(data.issueDate).getFullYear()} Beta</span>
                 </div>
              </div>
              <Shield className="w-12 h-12 text-brand/20" />
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-8">
           <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-3">
              <Download className="w-4 h-4" /> Export Credential
           </button>
           <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Share2 className="w-4 h-4" /> Signal Authenticity
           </button>
        </div>

        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.5em] opacity-40">
           Protected by KarsaTek OS Sovereign Encryption &bull; 2026
        </p>
      </motion.div>
    </div>
  )
}
