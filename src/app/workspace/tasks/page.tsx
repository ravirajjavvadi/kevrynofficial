"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Terminal, 
  Clock, 
  ChevronRight,
  Zap
} from "lucide-react";
import TaskSubmitModal from "@/components/workspace/TaskSubmitModal";

export default function TasksPage() {
  const [intern, setIntern] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/api/intern/me");
        if (res.ok) {
          const data = await res.json();
          setIntern(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const openSubmit = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const tasks = intern?.tasks || [];

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-8 border-b border-white/5">
        <div className="space-y-4">
          <div className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Operational Queue</div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Task<br/><span className="text-brand">Terminal</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand transition-all" />
            <input 
              type="text" 
              placeholder="Filter Active Tasks..."
              className="pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase text-white outline-none focus:border-brand/40 transition-all"
            />
          </div>
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </header>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 animate-pulse h-64" />
          ))
        ) : tasks.length === 0 ? (
          <div className="py-32 text-center space-y-6">
            <Terminal className="w-16 h-16 text-white/5 mx-auto" />
            <h2 className="text-xl font-black text-white/20 uppercase tracking-tighter">Queue Empty. Awaiting Administrative Deployment.</h2>
          </div>
        ) : (
          tasks.map((task: any, idx: number) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${task.priority === 'URGENT' || task.priority === 'HIGH' ? 'bg-brand text-black shadow-[0_0_15px_var(--color-brand-glow)]' : 
                        'bg-white/10 text-white'}
                    `}>
                      {task.priority || 'Operational'}
                    </span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{task.domain || 'Core Logic'}</span>
                  </div>
                  
                  <h2 className={`text-3xl font-black tracking-tighter leading-tight uppercase transition-all ${task.status === 'completed' ? 'text-white/40 line-through' : 'text-white group-hover:text-brand'}`}>
                     {task.title}
                  </h2>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                     {task.description}
                  </p>
  
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-2 text-white/40">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assigned: {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                      <Terminal className="w-4 h-4" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                        Status: {task.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
  
                <div className="flex lg:flex-col items-center gap-4">
                   <button 
                     onClick={() => openSubmit(task)}
                     disabled={task.status === 'completed'}
                     className={`flex-1 lg:w-full px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                       ${task.status === 'completed' 
                         ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 cursor-not-allowed' 
                         : 'bg-brand text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_var(--color-brand-glow)]'}
                     `}
                   >
                     {task.status === 'completed' ? 'Protocol Executed' : 'Submit Solution'}
                   </button>
                </div>
              </div>
  
              {/* Visual Decoration */}
              <div className={`absolute -right-20 -bottom-20 w-80 h-80 blur-[120px] transition-all opacity-20 bg-brand`} />
            </motion.div>
          ))
        )}
      </div>

      <TaskSubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />
    </div>
  );
}
