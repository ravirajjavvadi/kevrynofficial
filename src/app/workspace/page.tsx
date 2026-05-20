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
  Loader2
} from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { getInternDataByEmail } from "@/lib/registry";

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 blur-[80px] group-hover:bg-${color}/20 transition-all`} />
    <div className="relative z-10 flex flex-col gap-6">
      <div className={`w-12 h-12 rounded-2xl bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
        <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
      </div>
    </div>
  </motion.div>
);

interface InternData {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number;
  domain: string;
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
        // 1. Try Cloud Native MongoDB
        const res = await fetch("/api/intern/me");
        if (res.ok) {
          const data = await res.json();
          setIntern(data);
          setFetchStatus("found");
          return;
        }

        // 2. Fallback to Local Legacy Registry if Cloud fetch fails
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
        // 3. Last resort fallback on network failure
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
                <span className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[10px] font-black uppercase tracking-widest text-brand">{intern.role}</span>
                <span className="text-[10px] font-mono text-white/30 tracking-widest break-all">{String(intern.id)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href={`/offer?id=${intern.id}`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap"
              >
                <FileText className="w-4 h-4" /> View Offer Letter
              </Link>
              <Link
                href={`/verify/${intern.id}`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all whitespace-nowrap"
              >
                <Shield className="w-4 h-4" /> Verify Credential
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
            <span className="text-[10px] font-black text-brand uppercase tracking-widest">Protocol Version 5.0 Active</span>
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
            Welcome back, Sovereign Engineer. Your neural sync is optimized for the current dev cycle.
          </motion.p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Multiplier</div>
              <div className="text-xl font-black text-white">x1.25 XP</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Target} label="Tasks Mastered" value="8" color="brand" />
        <StatCard icon={Calendar} label="Code Quality" value="98.4%" color="blue-400" />
        <StatCard icon={Trophy} label="Global Rank" value="Elite Tier" color="purple-400" />
        <StatCard icon={Clock} label="Active Sprint" value="Week 4" color="emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Active Task Highlight */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Priority Alpha Task</h3>
            <Link href="/workspace/tasks" className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline">View All Tasks</Link>
          </div>
          <div className="p-8 md:p-10 rounded-[3rem] bg-gradient-to-br from-brand/20 via-brand/5 to-transparent border border-brand/20 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <span className="px-4 py-1 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-widest">Due in 4h</span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight uppercase">Build Sovereign Code Parser Module for AI ATS</h2>
                <p className="text-muted-foreground font-medium max-w-xl">
                  Construct a robust Next.js server-side parsing engine that validates GitHub repository structures and extracts core logic metrics before routing them to the Groq AI evaluator.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/workspace/tasks" className="px-8 py-4 rounded-xl bg-brand text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all">
                  Submit Protocols <ChevronRight className="w-4 h-4" />
                </Link>
                <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all">
                  Briefing Docs <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand/10 blur-[100px]" />
          </div>
        </div>

        {/* System Briefings */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">System Briefings</h3>
          <div className="space-y-4">
            {[
              { date: "May 20, 2026", text: "Infrastructure Update: Native MongoDB Atlas Live. Prisma removed for zero build errors.", hover: "brand" },
              { date: "May 18, 2026", text: "Security Advisory: Ensure all API Keys are strictly routed through `.env.local` to prevent leaks.", hover: "orange-500" },
              { date: "May 15, 2026", text: "Protocol Launch: KevRyn Sovereign Intern OS is now live with full QR credential verification.", hover: "blue-500" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-${item.hover}/10 group-hover:text-${item.hover} transition-all flex-shrink-0`}>
                    <Globe className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.date}</div>
                    <div className="text-sm font-bold text-white leading-tight">{item.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/workspace/tasks" className="w-full py-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-center block text-white">
            Load Historical Intel
          </Link>
        </div>
      </div>
    </div>
  );
}
