"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, User, Mail, Fingerprint, FileText, 
  Settings, Zap, CheckCircle2, Circle, 
  Plus, Trash2, ExternalLink, ArrowLeft,
  Briefcase, Award, QrCode, Signature,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function InternDossierPage() {
  const { id } = useParams();
  const router = useRouter();
  const [intern, setIntern] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/admin/interns/${id}`);
        if (res.ok) {
          const data = await res.json();
          setIntern(data);
          setTasks(data.tasks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleUpdate = async (updatedData: any) => {
    try {
      const res = await fetch(`/api/admin/interns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        // Optimistic update already handled in state if needed, but here we just sync
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!newTask.title) return;
    const taskObj = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      assignedAt: new Date().toISOString()
    };
    const newTasks = [...tasks, taskObj];
    setTasks(newTasks);
    await handleUpdate({ tasks: newTasks });
    setNewTask({ title: "", description: "" });
    setIsAddingTask(false);
  };

  const startEdit = (task: any) => {
    setEditingTask(task.id);
    setEditData({ title: task.title, description: task.description });
  };

  const saveEdit = async () => {
    const newTasks = tasks.map(t => 
      t.id === editingTask ? { ...t, ...editData } : t
    );
    setTasks(newTasks);
    await handleUpdate({ tasks: newTasks });
    setEditingTask(null);
  };

  const removeTask = async (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    await handleUpdate({ tasks: newTasks });
  };

  const toggleTaskStatus = async (taskId: string) => {
    const newTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: t.status === "completed" ? "pending" : "completed" } 
        : t
    );
    setTasks(newTasks);
    await handleUpdate({ tasks: newTasks });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Zap className="w-8 h-8 text-red-500 animate-pulse" />
    </div>
  );

  if (!intern) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Shield className="w-12 h-12 text-white/20" />
      <h2 className="text-xl font-black text-white uppercase tracking-tighter">Node Not Found</h2>
      <Link href="/admin/interns" className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Return to Registry</Link>
    </div>
  );

  return (
    <div className="p-8 lg:p-12 space-y-12 pb-24 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav>
        <Link 
          href="/admin/interns" 
          className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Talent Registry
        </Link>
      </nav>

      {/* Profile Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center relative group">
            <User className="w-10 h-10 text-red-500" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-black border border-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{intern.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${intern.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                {intern.status || 'Active'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                <Mail className="w-3.5 h-3.5" /> {intern.email}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                <Fingerprint className="w-3.5 h-3.5" /> {intern.internId || intern._id.toUpperCase()}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                <Briefcase className="w-3.5 h-3.5" /> {intern.domain || 'Quantum Engineering'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href={`/admin/interns/${id}/certificate`}
            className="px-6 py-3 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform"
          >
            Award Excellence
          </Link>
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dossier Details */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Node Dossier</h3>
            
            <div className="space-y-6">
              {[
                { label: 'Evaluation Score', value: `${intern.score || intern.iqScore || 0}%`, color: 'text-red-500' },
                { label: 'Onboarding Date', value: intern.createdAt ? new Date(intern.createdAt).toLocaleDateString() : 'Baseline', color: 'text-white/60' },
                { label: 'Identity Status', value: 'Sovereign Verified', color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.label}</div>
                  <div className={`text-sm font-black uppercase tracking-tighter ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Identity Archives
              </h4>
              <div className="space-y-3">
                <a 
                  href={intern.resumeUrl} 
                  target="_blank"
                  className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Resume_Archive.pdf</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white" />
                </a>
                <Link 
                  href={`/offer?id=${intern.internId || intern._id}`} 
                  target="_blank"
                  className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Sovereign_Offer.pdf</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Task Orchestrator */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 lg:p-12 rounded-[3rem] bg-[#050505] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Task Orchestrator</h3>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  Assign and moderate execution protocols
                </div>
              </div>
              <button 
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              >
                <Plus className="w-3 h-3" /> Deploy Protocol
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <AnimatePresence>
                {isAddingTask && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-8 rounded-[2rem] bg-white/[0.02] border border-red-500/20 space-y-6"
                  >
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Task Protocol Title..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-red-500 transition-all"
                      />
                      <textarea 
                        placeholder="Detailed execution requirements..."
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-red-500 transition-all min-h-[120px] resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={addTask}
                        className="px-8 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all"
                      >
                        Deploy Task
                      </button>
                      <button 
                        onClick={() => setIsAddingTask(false)}
                        className="px-8 py-3 rounded-xl bg-white/5 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="py-32 text-center space-y-6 opacity-10">
                    <Zap className="w-16 h-16 mx-auto" />
                    <div className="text-xs font-black uppercase tracking-[0.3em]">No protocols deployed to this node</div>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <motion.div 
                      key={task.id} 
                      layout
                      className={`group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-6 relative
                        ${editingTask === task.id ? 'border-red-500/30 ring-1 ring-red-500/20' : ''}`}
                    >
                      <button 
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`mt-1 transition-all hover:scale-110 ${task.status === 'completed' ? 'text-emerald-400' : 'text-white/20 hover:text-red-500'}`}
                      >
                        {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex-1 space-y-4">
                        {editingTask === task.id ? (
                          <div className="space-y-4">
                            <input 
                              value={editData.title}
                              onChange={(e) => setEditData({...editData, title: e.target.value})}
                              className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-red-500"
                            />
                            <textarea 
                              value={editData.description}
                              onChange={(e) => setEditData({...editData, description: e.target.value})}
                              className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-red-500 resize-none"
                            />
                            <div className="flex gap-2">
                              <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-red-500 text-black text-[10px] font-black uppercase">Save Change</button>
                              <button onClick={() => setEditingTask(null)} className="px-4 py-2 rounded-lg bg-white/5 text-white/40 text-[10px] font-black uppercase">Discard</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <h4 className={`text-lg font-black uppercase tracking-tighter transition-all ${task.status === 'completed' ? 'text-white/40 line-through' : 'text-white'}`}>
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                 <button 
                                   onClick={() => startEdit(task)}
                                   className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white"
                                 >
                                   <Settings className="w-3.5 h-3.5" />
                                 </button>
                                 <button 
                                   onClick={() => removeTask(task.id)}
                                   className="p-2 rounded-lg bg-red-500/0 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-xs"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                            </div>
                            <p className="text-xs font-medium text-white/40 leading-relaxed max-w-xl">{task.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5 mt-4">
                              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Assigned: {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString() : 'Baseline'}
                              </div>
                              
                              {task.submission && (
                                <div className="flex items-center gap-4">
                                  <a 
                                    href={task.submission.github} 
                                    target="_blank" 
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500/20 transition-all"
                                  >
                                    <ExternalLink className="w-3 h-3" /> Repository
                                  </a>
                                  {task.submission.deploy && (
                                    <a 
                                      href={task.submission.deploy} 
                                      target="_blank" 
                                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500/20 transition-all"
                                    >
                                      <Zap className="w-3 h-3" /> Live Deploy
                                    </a>
                                  )}
                                  <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] flex flex-col">
                                    <span>Submitted</span>
                                    <span>{new Date(task.submission.timestamp).toLocaleString()}</span>
                                  </div>
                                  
                                  {task.status !== 'completed' && (
                                    <button 
                                      onClick={() => toggleTaskStatus(task.id)}
                                      className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                    >
                                      Approve Solution
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
