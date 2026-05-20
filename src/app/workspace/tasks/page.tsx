"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Terminal, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import TaskSubmitModal from "@/components/workspace/TaskSubmitModal";

const MOCK_TASKS = [
  {
    id: "TASK-001",
    title: "Develop Sovereign Social Interface for Complex Designers",
    description: "Construct a high-fidelity dashboard component that handles real-time designer metrics with glassmorphism aesthetics.",
    deadline: "2026-05-21T18:00:00Z",
    priority: "HIGH",
    status: "IN_PROGRESS",
    domain: "Quantum Web"
  },
  {
    id: "TASK-002",
    title: "Optimize Neural Grid for Infinite Scaling",
    description: "Refactor the current CSS grid to handle dynamic expansion without layout wobble on mobile viewports.",
    deadline: "2026-05-23T12:00:00Z",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    domain: "Neural Native"
  },
  {
    id: "TASK-003",
    title: "Implement Autonomous Code Auditor Logic",
    description: "Build the server-side validator that audits GitHub repositories for sovereign best practices.",
    deadline: "2026-05-20T10:00:00Z",
    priority: "URGENT",
    status: "UNDER_REVIEW",
    domain: "Sovereign Backend"
  }
];

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openSubmit = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

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
        {MOCK_TASKS.map((task, idx) => (
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
                    ${task.priority === 'URGENT' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                      task.priority === 'HIGH' ? 'bg-brand text-black shadow-[0_0_15px_var(--color-brand-glow)]' : 
                      'bg-white/10 text-white'}
                  `}>
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{task.domain}</span>
                </div>
                
                <h2 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase group-hover:text-brand transition-all">
                   {task.title}
                </h2>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                   {task.description}
                </p>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-white/40">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <Terminal className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status: {task.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col items-center gap-4">
                 <button 
                   onClick={() => openSubmit(task)}
                   className="flex-1 lg:w-full px-10 py-5 rounded-2xl bg-brand text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_var(--color-brand-glow)]"
                 >
                   Submit Solution
                 </button>
                 <button className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                   <MoreVertical className="w-5 h-5" />
                 </button>
              </div>
            </div>

            {/* Visual Decoration */}
            <div className={`absolute -right-20 -bottom-20 w-80 h-80 blur-[120px] transition-all opacity-20
              ${task.priority === 'URGENT' ? 'bg-red-500' : task.priority === 'HIGH' ? 'bg-brand' : 'bg-white'}
            `} />
          </motion.div>
        ))}
      </div>

      {/* Empty State / Load More */}
      <div className="flex justify-center pt-8">
        <button className="flex items-center gap-3 px-12 py-6 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] hover:bg-white/5 transition-all">
          Sync Historical Queue <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <TaskSubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />
    </div>
  );
}
