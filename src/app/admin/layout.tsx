import React from "react";
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebarItem = ({ icon: Icon, label, href }: any) => {
  const pathname = usePathname();
  const active = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
        ${active 
          ? 'bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
          : 'text-muted-foreground hover:bg-white/5 hover:text-white'}
      `}
    >
      <div className={`p-2 rounded-xl border transition-all duration-300
        ${active ? 'border-red-500/40 bg-red-500/10' : 'border-transparent group-hover:border-white/20'}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest hidden lg:block">{label}</span>
    </Link>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] bg-[#020202] flex overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-20 lg:w-72 h-screen border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-4">
        <div className="px-4 py-8 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <ShieldAlert className="w-6 h-6 text-black" />
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-black text-red-500 tracking-[0.3em] uppercase leading-none">Sovereign</div>
            <div className="text-sm font-black text-white uppercase tracking-tighter">Admin Core</div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <AdminSidebarItem icon={BarChart3} label="Command Station" href="/admin" />
          <AdminSidebarItem icon={Users} label="Intern Registry" href="/admin/interns" />
          <AdminSidebarItem icon={Layers} label="Task Orchestrator" href="/admin/tasks" />
          <AdminSidebarItem icon={Bell} label="Audit Logs" href="/admin/logs" />
          <AdminSidebarItem icon={Settings} label="Core Settings" href="/admin/settings" />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center lg:text-left">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Load</div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full w-[42%] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </div>
            <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Optimal</div>
          </div>
        </div>
      </aside>

      {/* Main Admin Stage */}
      <main className="flex-1 overflow-y-auto relative bg-[#020202]">
        <div className="absolute inset-0 pointer-events-none neural-grid opacity-[0.04] z-0" />
        <div className="relative z-10 p-8 lg:p-12 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
