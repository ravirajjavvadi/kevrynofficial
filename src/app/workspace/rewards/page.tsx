"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Shield, Zap, Target, Award, Crown } from "lucide-react";

const badges = [
  {
    id: 1,
    title: "First Deployment",
    description: "Successfully merged your first code protocol to production.",
    icon: Zap,
    unlocked: true,
    date: "May 18, 2026",
    color: "brand"
  },
  {
    id: 2,
    title: "Flawless Execution",
    description: "Completed 5 consecutive tasks with 100% Code Quality score.",
    icon: Target,
    unlocked: true,
    date: "May 20, 2026",
    color: "blue-500"
  },
  {
    id: 3,
    title: "Sovereign Architect",
    description: "Deploy a complex full-stack architecture independently.",
    icon: Crown,
    unlocked: false,
    color: "purple-500"
  },
  {
    id: 4,
    title: "Zero Defect",
    description: "Passed AI Code Audit with zero linting or security errors.",
    icon: Shield,
    unlocked: true,
    date: "May 19, 2026",
    color: "emerald-500"
  },
  {
    id: 5,
    title: "Top 1% Engineer",
    description: "Reach the Elite Tier on the Global Command Leaderboard.",
    icon: Trophy,
    unlocked: false,
    color: "orange-500"
  },
  {
    id: 6,
    title: "Peer Mentor",
    description: "Review and assist in 10 intern PRs successfully.",
    icon: Award,
    unlocked: false,
    color: "pink-500"
  }
];

export default function AchievementsPage() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit"
        >
          <Star className="w-4 h-4 text-brand fill-brand" />
          <span className="text-[10px] font-black text-brand uppercase tracking-widest">Mastery Engine Online</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
        >
          Neural <span className="text-white/40">Achievements</span>
        </motion.h1>
      </header>

      {/* Progress Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-10 rounded-[3rem] bg-gradient-to-br from-brand/20 via-brand/5 to-transparent border border-brand/20 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Current Tier</div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Elite Engineer</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">4,250 <span className="text-white/40 text-sm">XP</span></div>
            </div>
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
               <span>Progress to Sovereign Rank</span>
               <span>85%</span>
             </div>
             <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/10">
               <div className="h-full bg-brand w-[85%] rounded-full shadow-[0_0_10px_var(--color-brand)]" />
             </div>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group
              ${badge.unlocked 
                ? 'bg-white/5 border-white/10 hover:border-white/20' 
                : 'bg-black/40 border-white/5 opacity-50 grayscale'}
            `}
          >
            {badge.unlocked && (
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${badge.color}/10 blur-[50px] group-hover:bg-${badge.color}/20 transition-all`} />
            )}
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
                ${badge.unlocked ? `bg-${badge.color}/10 border border-${badge.color}/20 text-${badge.color}` : 'bg-white/5 border border-white/10 text-white/40'}
              `}>
                {React.createElement(badge.icon, { className: "w-8 h-8" })}
              </div>
              
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">{badge.title}</h3>
                <p className="text-xs font-medium text-white/60 mb-4">{badge.description}</p>
                {badge.unlocked ? (
                   <span className={`px-4 py-1 rounded-full bg-${badge.color}/10 text-${badge.color} text-[10px] font-black uppercase tracking-widest border border-${badge.color}/20`}>
                     Unlocked: {badge.date}
                   </span>
                ) : (
                   <span className="px-4 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 w-fit mx-auto">
                     <Shield className="w-3 h-3" /> Locked
                   </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
