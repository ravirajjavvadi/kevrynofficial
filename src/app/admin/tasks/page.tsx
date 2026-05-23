"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock,
  AlertCircle,
  Zap,
  User,
  Terminal,
  Loader2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Circle
} from "lucide-react";

export default function AdminTasksPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  // New Task Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetId: "", // Intern ID or Email
    priority: "MEDIUM",
    domain: "Core Logic"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, internsRes] = await Promise.all([
        fetch("/api/admin/tasks"),
        fetch("/api/admin/interns")
      ]);
      
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (internsRes.ok) setInterns(await internsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetId) return;

    setDeploying(true);
    try {
      const targetIntern = interns.find(i => i.internId === formData.targetId || i.email === formData.targetId || i._id === formData.targetId);
      if (!targetIntern) throw new Error("Target Node Not Found");

      const newTask = {
        id: Math.random().toString(36).substring(2, 9),
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        domain: formData.domain,
        status: "pending",
        assignedAt: new Date().toISOString()
      };

      const currentTasks = targetIntern.tasks || [];
      const updatedTasks = [...currentTasks, newTask];

      const res = await fetch(`/api/admin/interns/${formData.targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });

      if (res.ok) {
        setIsDeploying(false);
        setFormData({ title: "", description: "", targetId: "", priority: "MEDIUM", domain: "Core Logic" });
        fetchData(); // Refresh matrix
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-8">
        <div className="space-y-4">
          <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Workload Management</div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Task<br/><span className="text-red-500">Orchestrator</span></h1>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsDeploying(!isDeploying)}
             className="px-10 py-5 rounded-2xl bg-red-500 text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-all"
           >
             {isDeploying ? "Collapse Console" : "Deploy New Task"} <Plus className={`w-4 h-4 transition-transform ${isDeploying ? 'rotate-45' : ''}`} />
           </button>
        </div>
      </header>

      {/* Task Deployment Console */}
      <AnimatePresence>
        {isDeploying && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 lg:p-12 rounded-[3rem] bg-white/[0.02] border border-red-500/20 mb-8 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter relative z-10">Initialize New Task Protocol</h3>
               
               <form onSubmit={handleDeploy} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Task Title</label>
                   <input 
                     type="text" 
                     required
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                     className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-red-500 outline-none transition-all placeholder:text-white/10 font-medium" 
                     placeholder="e.g. Architect Core API" 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Target Intern Node</label>
                   <select 
                     required
                     value={formData.targetId}
                     onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                     className="w-full p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 outline-none transition-all appearance-none font-medium"
                   >
                     <option value="">Select Candidate Node...</option>
                     {interns.map((intern) => (
                       <option key={intern._id} value={intern.internId || intern.email}>
                         {intern.name} ({intern.internId || intern.email.split('@')[0]})
                       </option>
                     ))}
                   </select>
                 </div>
                 <div className="lg:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Protocol Specifications</label>
                   <textarea 
                     rows={3} 
                     required
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-red-500 outline-none transition-all resize-none font-medium" 
                     placeholder="Define execution steps and requirements..." 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Priority Class</label>
                   <div className="flex gap-4">
                     {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                       <button
                         key={p}
                         type="button"
                         onClick={() => setFormData({...formData, priority: p})}
                         className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                           ${formData.priority === p ? 'bg-red-500 border-red-500 text-black' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}
                         `}
                       >
                         {p}
                       </button>
                     ))}
                   </div>
                 </div>
                 <div className="flex items-end justify-end">
                   <button 
                     type="submit" 
                     disabled={deploying}
                     className="w-full lg:w-auto px-12 py-5 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 transition-all shadow-2xl flex items-center justify-center gap-3"
                   >
                     {deploying ? <><Loader2 className="w-4 h-4 animate-spin" /> Deploying</> : "Execute Deployment"}
                   </button>
                 </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-all" />
            <input 
              type="text" 
              placeholder="Search Task Matrix..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase text-white outline-none focus:border-red-500/40 transition-all"
            />
          </div>
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
            <Filter className="w-5 h-5 text-white/40 group-hover:text-white" />
          </button>
        </div>

        <div className="rounded-[3rem] bg-white/[0.02] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protocol ID & Title</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned Target</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status / Priority</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submission Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {loading ? (
                 Array(3).fill(0).map((_, i) => (
                   <tr key={i} className="animate-pulse">
                     <td colSpan={5} className="px-8 py-12"><div className="h-4 bg-white/5 rounded w-1/3" /></td>
                   </tr>
                 ))
               ) : tasks.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-8 py-32 text-center text-white/20 uppercase font-black tracking-widest text-xs">
                     Task Archive Empty. Deploy initial protocols to populate the matrix.
                   </td>
                 </tr>
               ) : (
                 tasks.map((task) => (
                   <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                     <td className="px-8 py-8">
                        <div className="text-sm font-bold text-white mb-2 group-hover:text-red-500 transition-colors uppercase pr-4">{task.title}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ID: {task.id.toUpperCase()}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{task.domain}</span>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-red-500/20 transition-all">
                            <User className="w-4 h-4 text-white/40 group-hover:text-red-500" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white uppercase">{task.assignedTo}</div>
                            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">{task.internId}</div>
                          </div>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        <div className="flex flex-col gap-3">
                          <span className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest
                            ${task.priority === 'URGENT' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                              task.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' : 
                              'bg-white/10 text-white/60 border border-white/5'}
                          `}>
                            {task.priority}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2
                            ${task.status === 'completed' ? 'text-emerald-400' : 'text-muted-foreground'}
                          `}>
                            {task.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                     </td>
                     <td className="px-8 py-8">
                        {task.submission ? (
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                              <Zap className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Protocol Submitted</div>
                              <div className="flex gap-2">
                                <a href={task.submission.github} target="_blank" className="text-[8px] font-black text-white/40 uppercase hover:text-white flex items-center gap-1">
                                  <ExternalLink className="w-2 w-2" /> Repo
                                </a>
                                {task.submission.deploy && (
                                  <a href={task.submission.deploy} target="_blank" className="text-[8px] font-black text-white/40 uppercase hover:text-white flex items-center gap-1">
                                    <ExternalLink className="w-2 w-2" /> Live
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 opacity-20">
                            <Terminal className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Solution</span>
                          </div>
                        )}
                     </td>
                     <td className="px-8 py-8 text-right">
                        <Link 
                          href={`/admin/interns/${task.internId || task.email}`}
                          className="px-6 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                           Manage
                        </Link>
                     </td>
                   </tr>
                 ))
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
