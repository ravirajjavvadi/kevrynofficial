"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Calendar, 
  Trophy, 
  ExternalLink, 
  Globe,
  Clock,
  ChevronRight,
  FileText,
  Shield,
  Loader2,
  Fingerprint
} from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { getInternDataByEmail } from "@/lib/registry";

const colorMap: Record<string, { bg: string, bgHover: string, border: string, text: string }> = {
  "brand": {
    bg: "bg-brand/10",
    bgHover: "group-hover:bg-brand/20",
    border: "border-brand/20",
    text: "text-brand"
  },
  "blue-400": {
    bg: "bg-blue-400/10",
    bgHover: "group-hover:bg-blue-400/20",
    border: "border-blue-400/20",
    text: "text-blue-400"
  },
  "purple-400": {
    bg: "bg-purple-400/10",
    bgHover: "group-hover:bg-purple-400/20",
    border: "border-purple-400/20",
    text: "text-purple-400"
  },
  "emerald-400": {
    bg: "bg-emerald-400/10",
    bgHover: "group-hover:bg-emerald-400/20",
    border: "border-emerald-400/20",
    text: "text-emerald-400"
  }
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => {
  const classes = colorMap[color] || { bg: "bg-white/10", bgHover: "group-hover:bg-white/20", border: "border-white/20", text: "text-white" };
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${classes.bg} blur-[80px] ${classes.bgHover} transition-all`} />
      <div className="relative z-10 flex flex-col gap-6">
        <div className={`w-12 h-12 rounded-2xl ${classes.bg} ${classes.border} flex items-center justify-center ${classes.text}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
          <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
        </div>
      </div>
    </motion.div>
  );
};

interface InternData {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number;
  domain: string;
  tasks?: any[];
}

export default function CommandCenter() {
  const { user } = useUser();
  const [intern, setIntern] = useState<InternData | null>(null);
  const [fetchStatus, setFetchStatus] = useState<"loading" | "found" | "not_found">("loading");

  useEffect(() => {
    async function fetchInternData() {
      if (!user) return;
      
      const email = user.emailAddresses[0]?.emailAddress;
      
      try {
        const res = await fetch("/api/intern/me");
        if (res.ok) {
          const data = await res.json();
          setIntern(data);
          setFetchStatus("found");
          return;
        }

        if (email) {
          const legacyData = getInternDataByEmail(email);
          if (legacyData) {
            setIntern(legacyData as any);
            setFetchStatus("found");
            return;
          }
        }

        setFetchStatus("not_found");
      } catch (err) {
        if (email) {
          const legacyData = getInternDataByEmail(email);
          if (legacyData) {
            setIntern(legacyData as any);
            setFetchStatus("found");
            return;
          }
        }
        setFetchStatus("not_found");
      }
    }

    if (user) {
      fetchInternData();
    } else {
      setFetchStatus("loading");
    }
  }, [user]);

  const activeTask = intern?.tasks?.find(t => t.status === 'pending') || null;
  const completedCount = intern?.tasks?.filter(t => t.status === 'completed').length || 0;

  return (
    <div className="p-6 md:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">

      {/* === SOVEREIGN IDENTITY CARD === */}
      {fetchStatus === "loading" && (
        <div className="p-6 rounded-[2rem] bg-brand/5 border border-brand/20 flex items-center gap-4">
          <Loader2 className="w-5 h-5 text-brand animate-spin" />
          <span className="text-[10px] font-black text-brand uppercase tracking-widest">Synchronizing Registry...</span>
        </div>
      )}

      {fetchStatus === "found" && intern && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-br from-brand/10 via-white/[0.02] to-transparent border border-brand/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Sovereign Identity</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">{intern.name}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[10px] font-black uppercase tracking-widest text-brand">{intern.domain || 'Engineer'}</span>
                <span className="text-[10px] font-mono text-white/30 tracking-widest break-all">ID: {String(intern.id).substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href={`/offer?id=${intern.id}`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap"
              >
                <FileText className="w-4 h-4" /> Entry Offer
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-4">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-widest">Sovereign Neural Link Active</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
          >
            Command<br /><span className="text-brand">Center</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 font-medium max-w-md"
          >
            Sovereign node verified. Administrative tasks are now synchronized with your local terminal.
          </motion.p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Test Merit</div>
              <div className="text-xl font-black text-white">{intern?.score || 0}%</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Target} label="Tasks Mastered" value={String(completedCount)} color="brand" />
        <StatCard icon={Calendar} label="Code Quality" value="98.4%" color="blue-400" />
        <StatCard icon={Trophy} label="Global Rank" value="Elite Tier" color="purple-400" />
        <StatCard icon={Clock} label="Active Sync" value="Week 1" color="emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Active Task Highlight */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Assigned Operational Protocol</h3>
            <Link href="/workspace/tasks" className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline">Full Terminal</Link>
          </div>
          
          {activeTask ? (
            <div className="p-8 md:p-10 rounded-[3rem] bg-gradient-to-br from-brand/20 via-brand/5 to-transparent border border-brand/20 relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <span className="px-4 py-1 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-widest">Priority Priority</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight uppercase">{activeTask.title}</h2>
                  <p className="text-muted-foreground font-medium max-w-xl">
                    {activeTask.description || "Refer to the task terminal for full execution details."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/workspace/tasks" className="px-8 py-4 rounded-xl bg-brand text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all">
                    Execute Protocol <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand/10 blur-[100px]" />
            </div>
          ) : (
            <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center space-y-4 flex flex-col items-center">
              <Zap className="w-12 h-12 text-white/10" />
              <div className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Queue Empty. Awaiting Administrative Relay.</div>
            </div>
          )}
        </div>

        {/* System Briefings */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Identity Dossier</h3>
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center bg-black">
                <Fingerprint className="w-6 h-6 text-brand" />
              </div>
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sovereign IQ</div>
                <div className="text-xl font-black text-white">{intern?.score || 0}/100</div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Node Status</div>
                <div className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> Verified Intern
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Assignment Domain</div>
                <div className="text-[10px] font-bold text-white uppercase tracking-widest">{intern?.domain || 'General Engineering'}</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Trophy className="w-5 h-5 text-emerald-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Internship Completion Certificate</span>
             </div>
             <Shield className="w-4 h-4 text-emerald-500/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
