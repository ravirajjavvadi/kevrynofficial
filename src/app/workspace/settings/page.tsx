"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings, Monitor, Bell, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Interface Configuration",
      items: [
        { label: "Theme Sovereignty", val: "Forced Dark", icon: Palette },
        { label: "Terminal Font", val: "Fira Code Retina", icon: Monitor },
      ]
    },
    {
      title: "System Alerts",
      items: [
        { label: "Admin Directives", val: "Priority Only", icon: Bell },
        { label: "Audit Results", val: "Instant Push", icon: Globe },
      ]
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
          <Settings className="w-4 h-4 text-white/60" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Global Configuration</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
        >
          System <span className="text-white/40">Settings</span>
        </motion.h1>
      </header>

      <div className="space-y-12">
        {settingsSections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="space-y-6"
          >
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-black/40 border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors border border-white/5">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider">{item.label}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-brand uppercase tracking-widest">{item.val}</span>
                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
