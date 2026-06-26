"use client";

import React from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Terminal, 
  CheckSquare, 
  Trophy, 
  MessageSquare, 
  User, 
  Settings,
  LogOut,
  Zap,
  Activity
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, href, active = false }: any) => (
  <Link 
    href={href}
    className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
      ${active 
        ? 'bg-brand/10 border border-brand/20 text-brand shadow-[0_0_20px_var(--color-brand-glow)]' 
        : 'text-white/40 hover:bg-white/5 hover:text-white'}
    `}
  >
    <div className={`p-2 rounded-xl border transition-all duration-300
      ${active ? 'border-brand/40 bg-brand/10' : 'border-transparent group-hover:border-white/20'}
    `}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-xs font-black uppercase tracking-widest hidden lg:block">{label}</span>
    {active && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)]" />
    )}
  </Link>
);

export default function WorkspaceSidebar() {
  const { signOut } = useClerk();

  return (
    <aside className="w-20 lg:w-72 h-screen border-r border-white/5 bg-[#020202] flex flex-col p-4 relative z-50 transition-all duration-500">
      {/* Platform Branding */}
      <div className="px-4 py-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_20px_var(--color-brand-glow)]">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-black text-brand tracking-[0.3em] uppercase leading-none">Sovereign</div>
            <div className="text-sm font-black text-white uppercase tracking-tighter">Intern OS</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Command Center" href="/workspace" active />
        <SidebarItem icon={Terminal} label="Active Tasks" href="/workspace/tasks" />
        <SidebarItem icon={Trophy} label="Achievements" href="/workspace/rewards" />
        <SidebarItem icon={Activity} label="Neural Pulse" href="/workspace/pulse" />
        <SidebarItem icon={MessageSquare} label="Briefings" href="/workspace/messages" />
      </nav>

      {/* Footer Profile/Settings */}
      <div className="mt-auto pt-8 border-t border-white/5 space-y-2">
        <SidebarItem icon={User} label="Identity Profile" href="/workspace/profile" />
        <SidebarItem icon={Settings} label="System Settings" href="/workspace/settings" />
        <button 
          onClick={() => signOut()}
          className="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-red-500/60 hover:bg-red-500/10 hover:text-red-500 mt-4 outline-none"
        >
           <div className="p-2 rounded-xl border border-transparent group-hover:border-red-500/20">
             <LogOut className="w-5 h-5" />
           </div>
           <span className="text-xs font-black uppercase tracking-widest hidden lg:block">Terminate Sync</span>
        </button>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none neural-grid opacity-[0.05] -z-10" />
    </aside>
  );
}
