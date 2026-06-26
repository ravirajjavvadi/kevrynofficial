"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Shield, Key, Fingerprint, Hexagon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-12">
      <header className="space-y-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit"
        >
          <Fingerprint className="w-4 h-4 text-brand" />
          <span className="text-[10px] font-black text-brand uppercase tracking-widest">Biometric Sync Verified</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
        >
          Identity <span className="text-white/40">Profile</span>
        </motion.h1>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-10 rounded-[3rem] bg-black/40 border border-white/5 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center md:items-start"
      >
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 overflow-hidden">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white/40" />
            )}
          </div>
          <div className="absolute -inset-4 bg-brand/20 blur-3xl -z-10 rounded-full" />
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{user?.fullName || "Sovereign Intern"}</h2>
            <div className="text-sm font-medium text-white/40">{user?.primaryEmailAddress?.emailAddress || "ident@kevryn.com"}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Clearance Level</div>
              <div className="text-lg font-black text-brand flex items-center gap-2 justify-center md:justify-start">
                <Shield className="w-4 h-4" /> Level 3
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Node Access</div>
              <div className="text-lg font-black text-white flex items-center gap-2 justify-center md:justify-start">
                <Hexagon className="w-4 h-4" /> Global
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 px-4">Access Protocols</h3>
        <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl text-white/60">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase">Cryptographic Keys</div>
              <div className="text-xs font-medium text-white/40">Manage your SSH and API access tokens.</div>
            </div>
          </div>
          <button className="px-6 py-2 rounded-xl bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10">Configure</button>
        </div>
      </motion.div>
    </div>
  );
}
