"use client";

import React, { useEffect, useState, use } from "react";
import { 
  Shield, Zap, Users, User, Trophy, Clock, Search, 
  ChevronRight, Filter, FileText, Mail, Fingerprint, 
  Briefcase, Award, ArrowLeft, Trash2, Plus, 
  CheckCircle2, Circle, Settings, ExternalLink, 
  AlertCircle, Play, Sparkles, MessageSquare, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function HiringWarRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Core candidate states
  const [intern, setIntern] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Task Orchestrator states (for Admitted interns)
  const [tasks, setTasks] = useState<any[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  // Simulation Form states
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simStatus, setSimStatus] = useState("Initializing neural mapping...");
  const [simResults, setSimResults] = useState<any>(null);
  const [simForm, setSimForm] = useState({
    teamStack: "Next.js, Tailwind CSS, Groq SDK, MongoDB",
    managerProfile: "Autonomous, high-velocity, detail-oriented architecture",
    projectScope: "Ingesting telemetry flows and scaling LLM context bridges",
    culture: "Extreme ownership, high speed, radical transparency",
    jobDescription: "AI Systems Architect with solid React and server design experience"
  });

  // Hindsight Feedback Loop states
  const [feedbackLoopStage, setFeedbackLoopStage] = useState("Day 30");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [memorySaved, setMemorySaved] = useState(false);

  // Collapsible transcript state
  const [showTranscript, setShowTranscript] = useState(false);

  // Left side tabs & visual graph interactive nodes
  const [leftTab, setLeftTab] = useState<"twin" | "graph">("twin");
  const [activeTwinNode, setActiveTwinNode] = useState<"identity" | "resume" | "assessment" | "interview" | "telemetry">("identity");


  const fetchCandidate = async () => {
    try {
      const res = await fetch(`/api/admin/interns/${id}`);
      if (res.ok) {
        const data = await res.json();
        setIntern(data);
        setTasks(data.tasks || []);
        if (data.simulationData) {
          setSimResults(data.simulationData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const handleUpdate = async (updatedData: any) => {
    try {
      const res = await fetch(`/api/admin/interns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Recruiters Action: Approve & Provision Clerk Auth
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/interns/${id}/approve`, {
        method: "POST"
      });
      if (res.ok) {
        fetchCandidate(); // Refresh details to show ADMITTED state
      } else {
        const errData = await res.json();
        alert(`Approval failed: ${errData.message || errData.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Recruiters Action: Reject
  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this candidate?")) return;
    setActionLoading(true);
    try {
      const success = await handleUpdate({ status: "REJECTED" });
      if (success) {
        fetchCandidate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger AI Hiring Simulation
  const runSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationLoading(true);
    
    const steps = [
      "Correlating Digital Twin node mappings...",
      "Analyzing dialogue transcripts against baseline manager style...",
      "Benchmarking skills against hindsight memories...",
      "Compiling final decision indicators..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setSimStatus(steps[i]);
        await new Promise(r => setTimeout(r, 800));
      }

      const res = await fetch("/api/admin/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...simForm })
      });
      if (res.ok) {
        const simData = await res.json();
        setSimResults(simData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulationLoading(false);
    }
  };

  // Submit Performance Review (Feedback Loop)
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSending(true);
    try {
      const res = await fetch("/api/admin/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: id,
          name: intern.name,
          role: intern.role,
          stage: feedbackLoopStage,
          score: feedbackScore,
          feedback: feedbackText
        })
      });
      if (res.ok) {
        setMemorySaved(true);
        setFeedbackText("");
        setTimeout(() => setMemorySaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFeedbackSending(false);
    }
  };

  // Task Orchestrator functions
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
      <Zap className="w-8 h-8 text-brand animate-pulse" />
    </div>
  );

  if (!intern) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Shield className="w-12 h-12 text-white/20" />
      <h2 className="text-xl font-black text-white uppercase tracking-tighter">Node Not Found</h2>
      <Link href="/admin/interns" className="text-xs font-black text-brand uppercase tracking-widest hover:underline">Return to Registry</Link>
    </div>
  );

  const evaluation = intern.interviewEvaluation || {};
  const intelligence = intern.candidateIntelligence || {};

  return (
    <div className="p-8 lg:p-12 space-y-12 pb-24 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav>
        <Link 
          href="/admin/interns" 
          className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Hiring War Room
        </Link>
      </nav>

      {/* Profile Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-brand/10 border border-brand/20 flex items-center justify-center relative">
            <User className="w-8 h-8 text-brand" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-black border border-white/10 flex items-center justify-center">
              <Zap className="w-3 h-3 text-emerald-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{intern.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border 
                ${intern.status === 'ADMITTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                  intern.status === 'REJECTED' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                  'bg-brand/10 border-brand/20 text-brand'}`}
              >
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
                <Briefcase className="w-3.5 h-3.5" /> {intern.role || 'Software Engineer'}
              </div>
            </div>
          </div>
        </div>

        {/* Recruiter Decisions Action Center */}
        <div className="flex items-center gap-3">
          {(intern.status === "TEST_COMPLETED" || intern.status === "INTERVIEWED") && (
            <>
              <button 
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-6 py-3 rounded-2xl bg-brand text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer border-none"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Approve & Onboard"}
              </button>
              <button 
                onClick={handleReject}
                disabled={actionLoading}
                className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all cursor-pointer"
              >
                Reject Candidate
              </button>
            </>
          )}

          {intern.status === "ADMITTED" && (
            <Link 
              href={`/offer?id=${intern.internId || intern._id}`}
              target="_blank"
              className="px-6 py-3 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              <Award className="w-3.5 h-3.5" /> View Offer Letter
            </Link>
          )}
        </div>
      </header>

      {/* CORE WAR ROOM INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Digital Twin & Knowledge Graph */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 blur-[50px] pointer-events-none" />
            
            {/* Tab Selectors */}
            <div className="flex gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/5 relative z-10">
              <button 
                onClick={() => setLeftTab("twin")}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer
                  ${leftTab === "twin" ? "bg-white text-black font-black" : "text-white/40 hover:text-white"}`}
              >
                🧬 Digital Twin
              </button>
              <button 
                onClick={() => setLeftTab("graph")}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer
                  ${leftTab === "graph" ? "bg-white text-black font-black" : "text-white/40 hover:text-white"}`}
              >
                🕸️ Knowledge Graph
              </button>
            </div>

            {leftTab === "twin" ? (
              <div className="space-y-6 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Candidate Digital Twin Network</div>
                
                {/* SVG Interactive Twin Network Graph */}
                <div className="relative aspect-square w-full rounded-3xl bg-black border border-white/5 flex items-center justify-center overflow-hidden p-4">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Glowing Link Paths */}
                    <line x1="100" y1="100" x2="40" y2="50" stroke={activeTwinNode === 'resume' ? '#00d2ff' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" strokeDasharray={activeTwinNode === 'resume' ? '0' : '3, 3'} />
                    <line x1="100" y1="100" x2="160" y2="50" stroke={activeTwinNode === 'assessment' ? '#00d2ff' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
                    <line x1="100" y1="100" x2="40" y2="150" stroke={activeTwinNode === 'interview' ? '#00d2ff' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
                    <line x1="100" y1="100" x2="160" y2="150" stroke={activeTwinNode === 'telemetry' ? '#00d2ff' : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" strokeDasharray={activeTwinNode === 'telemetry' ? '0' : '2, 2'} />
                    
                    {/* Center Node: Candidate Profile Identity */}
                    <circle cx="100" cy="100" r="16" fill="black" stroke={activeTwinNode === 'identity' ? '#00d2ff' : 'rgba(255,255,255,0.2)'} strokeWidth="2" className="cursor-pointer" onClick={() => setActiveTwinNode("identity")} />
                    <text x="100" y="103" textAnchor="middle" fill={activeTwinNode === 'identity' ? '#00d2ff' : 'white'} fontSize="8" fontWeight="bold" className="cursor-pointer pointer-events-none">ID</text>

                    {/* Node 1: Resume */}
                    <circle cx="40" cy="50" r="12" fill="#18181b" stroke={activeTwinNode === 'resume' ? '#00d2ff' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveTwinNode("resume")} />
                    <text x="40" y="53" textAnchor="middle" fill={activeTwinNode === 'resume' ? '#00d2ff' : 'white'} fontSize="7" fontWeight="bold" className="cursor-pointer pointer-events-none">RES</text>

                    {/* Node 2: Assessment */}
                    <circle cx="160" cy="50" r="12" fill="#18181b" stroke={activeTwinNode === 'assessment' ? '#00d2ff' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveTwinNode("assessment")} />
                    <text x="160" y="53" textAnchor="middle" fill={activeTwinNode === 'assessment' ? '#00d2ff' : 'white'} fontSize="7" fontWeight="bold" className="cursor-pointer pointer-events-none">ASM</text>

                    {/* Node 3: AI Interview */}
                    <circle cx="40" cy="150" r="12" fill="#18181b" stroke={activeTwinNode === 'interview' ? '#00d2ff' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveTwinNode("interview")} />
                    <text x="40" y="153" textAnchor="middle" fill={activeTwinNode === 'interview' ? '#00d2ff' : 'white'} fontSize="7" fontWeight="bold" className="cursor-pointer pointer-events-none">INT</text>

                    {/* Node 4: Telemetry */}
                    <circle cx="160" cy="150" r="12" fill="#18181b" stroke={activeTwinNode === 'telemetry' ? '#00d2ff' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveTwinNode("telemetry")} />
                    <text x="160" y="153" textAnchor="middle" fill={activeTwinNode === 'telemetry' ? '#00d2ff' : 'white'} fontSize="7" fontWeight="bold" className="cursor-pointer pointer-events-none">TEL</text>
                  </svg>
                </div>

                {/* Twin Interactive Node details card */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                  {activeTwinNode === 'identity' && (
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest">🧬 Identity Node Data</span>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Clearance Level</div>
                        <div className="text-xs text-white font-bold uppercase">Clearance 3 (Sovereign Intern)</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Onboarding Window</div>
                        <div className="text-xs text-white font-bold uppercase">{intern.joinedAt ? new Date(intern.joinedAt).toLocaleDateString() : "Baseline"}</div>
                      </div>
                    </div>
                  )}
                  {activeTwinNode === 'resume' && (
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest">📄 Parsed Resume Metadata</span>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Identified Stack</div>
                        <div className="text-xs text-white font-bold uppercase">{intern.domain || "Quantum Engineering"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Archive Attachment</div>
                        <a href={intern.resumeUrl} target="_blank" className="text-xs text-brand font-bold uppercase hover:underline flex items-center gap-1 mt-1">
                          Open Resume_Archive.pdf <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  {activeTwinNode === 'assessment' && (
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest">📝 Qualifier Assessment</span>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Test Score</div>
                        <div className="text-xs text-white font-bold uppercase">{intern.score}% Accuracy</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Integrity Status</div>
                        <div className="text-xs text-emerald-400 font-bold uppercase">Passed Integrity Checks ({intern.testResult?.strikes || 0} breaches)</div>
                      </div>
                    </div>
                  )}
                  {activeTwinNode === 'interview' && (
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest">🎙️ Speech Interview Telemetry</span>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">AI recommendation</div>
                        <div className="text-xs text-white font-bold uppercase">{evaluation.hiringRecommendation || "Awaiting submission"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">hiring confidence</div>
                        <div className="text-xs text-brand font-bold uppercase">{evaluation.hiringConfidence || 0}%</div>
                      </div>
                    </div>
                  )}
                  {activeTwinNode === 'telemetry' && (
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-brand uppercase tracking-widest">📹 Anti-Cheat Telemetry</span>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Webcam Lock state</div>
                        <div className="text-xs text-emerald-400 font-bold uppercase">Stable (Face Locked)</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-white/40 uppercase">Interference Breaches</div>
                        <div className="text-xs text-white font-bold uppercase">{intern.interviewStrikes || 0} Tab Focus Switches</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative z-10 animate-fadeIn">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Company Knowledge Graph</div>
                
                {/* SVG Interactive Company Knowledge Graph */}
                <div className="relative aspect-square w-full rounded-3xl bg-black border border-white/5 flex items-center justify-center overflow-hidden p-4">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Link lines */}
                    <line x1="100" y1="100" x2="40" y2="60" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1.5" />
                    <line x1="100" y1="100" x2="160" y2="60" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1.5" />
                    <line x1="100" y1="100" x2="100" y2="160" stroke="rgba(147, 51, 234, 0.4)" strokeWidth="1.5" />
                    
                    {/* Candidate Node */}
                    <circle cx="100" cy="100" r="14" fill="#18181b" stroke="#00d2ff" strokeWidth="2" />
                    <text x="100" y="103" textAnchor="middle" fill="#00d2ff" fontSize="7" fontWeight="bold">Candidate</text>

                    {/* Team Node */}
                    <circle cx="40" cy="60" r="12" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="40" y="63" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Product Team</text>

                    {/* Manager Node */}
                    <circle cx="160" cy="60" r="12" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="160" y="63" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Manager</text>

                    {/* Target Project Node */}
                    <circle cx="100" cy="160" r="12" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="100" y="163" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Project</text>
                  </svg>
                </div>

                {/* Graph relationship description */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Contextual Connections</span>
                  <div className="space-y-2.5 text-[11px] font-semibold text-white/60 leading-relaxed uppercase tracking-tighter">
                    <div>• 85% Stack Match with Product Engineering Team.</div>
                    <div>• Aligns with reporting manager's Detail-Oriented Architecture requirements.</div>
                    <div>• Ideal fit for active project scope (Ingesting telemetry flows).</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (2/3 Grid): Hiring Sim and Performance Analytics */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Decision Simulation Console */}
          <div className="p-8 lg:p-12 rounded-[3rem] bg-[#050505] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand" /> Predictive Simulation Engine
                </h3>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  Simulate project delivery, burnout threshold, and team cohesion
                </div>
              </div>
              
              {simResults && (
                <div className="text-right">
                  <span className="text-[9px] font-black text-brand uppercase tracking-widest">AI Confidence</span>
                  <div className="text-2xl font-black text-white">{simResults.confidenceScore || 90}%</div>
                </div>
              )}
            </div>

            {/* Run Simulation Form or Display Results */}
            <div className="space-y-8 relative z-10">
              {simulationLoading ? (
                <div className="py-16 text-center space-y-6 max-w-md mx-auto">
                  <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.2, ease: "easeInOut" }}
                      className="h-full bg-brand shadow-[0_0_10px_var(--color-brand-glow)]"
                    />
                  </div>
                  <p className="text-xs text-brand font-black uppercase tracking-[0.2em] animate-pulse">{simStatus}</p>
                </div>
              ) : simResults ? (
                <div className="space-y-8 animate-fadeIn">
                  {/* Results Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Team Compatibility", val: `${simResults.teamCompatibility}%`, color: "text-brand" },
                      { label: "Success Probability", val: `${simResults.successProbability}%`, color: "text-emerald-400" },
                      { label: "Attrition Risk", val: `${simResults.attritionRisk}%`, color: "text-red-500" },
                      { label: "Learning Curve", val: `${simResults.learningCurveWeeks} Weeks`, color: "text-blue-400" }
                    ].map(res => (
                      <div key={res.label} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block">{res.label}</span>
                        <span className={`text-xl font-black ${res.color}`}>{res.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Explainable Rationale */}
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 text-left">
                    <span className="text-[9px] font-black text-brand uppercase tracking-widest">Explainable Prediction Reasoning</span>
                    <p className="text-xs font-semibold text-white/80 leading-relaxed uppercase tracking-tighter">
                      {simResults.explainableReasoning}
                    </p>
                  </div>

                  {/* Explainable Decision Center: Hindsight Calibration */}
                  {evaluation.historicalComparison && (
                    <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 text-left">
                      <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Hindsight Benchmark Calibration</span>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[10px] text-white/40 uppercase">Similar Historical Hire</div>
                          <div className="text-xs text-white font-bold uppercase">{evaluation.historicalComparison.similarEmployeeName}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-black text-purple-400 uppercase">Hindsight calibrator</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed font-semibold uppercase tracking-tighter mt-2">
                        {evaluation.historicalComparison.comparisonRationale}
                      </p>
                    </div>
                  )}

                  {/* Explainable Decision Center: Transcript evidence */}
                  {evaluation.scores && (
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Cognitive Scoring Evidence (AI Debate Mode)</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: "Depth of Reasoning", scoreObj: evaluation.scores.reasoningDepth },
                          { label: "Architectural Thinking", scoreObj: evaluation.scores.architecturalThinking },
                          { label: "Trade-off Analysis", scoreObj: evaluation.scores.tradeoffAnalysis },
                          { label: "Decision Adaptability", scoreObj: evaluation.scores.adaptability }
                        ].map(item => item.scoreObj && (
                          <div key={item.label} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 text-left">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/60">
                              <span>{item.label}</span>
                              <span className="text-brand">{item.scoreObj.score}%</span>
                            </div>
                            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-tighter">Evidence: {item.scoreObj.evidence}</p>
                            {item.scoreObj.reference && (
                              <p className="text-[9px] text-brand/60 font-mono italic">Ref: "{item.scoreObj.reference}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-left">
                    <button 
                      onClick={() => setSimResults(null)}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:text-white"
                    >
                      Recalibrate Profile Simulation
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={runSimulation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Team Tech Stack</label>
                    <input 
                      type="text"
                      value={simForm.teamStack}
                      onChange={(e) => setSimForm({...simForm, teamStack: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Reporting Manager Profile</label>
                    <input 
                      type="text"
                      value={simForm.managerProfile}
                      onChange={(e) => setSimForm({...simForm, managerProfile: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-brand"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Project Scope & Culture</label>
                    <textarea 
                      rows={2}
                      value={simForm.projectScope}
                      onChange={(e) => setSimForm({...simForm, projectScope: e.target.value})}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-brand resize-none"
                    />
                  </div>
                  <div className="md:col-span-2 text-right">
                    <button 
                      type="submit"
                      className="px-8 py-4 rounded-xl bg-brand text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all border-none cursor-pointer"
                    >
                      Run AI Alignment Simulation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* AI INTERVIEW DETAILS */}
          {intern.interviewTranscript && (
            <div className="p-8 lg:p-12 rounded-[3rem] bg-[#050505] border border-white/5 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand" /> Cognitive Interview Evaluation
                  </h3>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Multidimensional scores from autonomous speech dialogue
                  </div>
                </div>
                <button 
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white transition-all cursor-pointer"
                >
                  {showTranscript ? "Collapse Dialogue" : "Open Transcript"}
                </button>
              </div>

              {/* Collapsible Transcript List */}
              <AnimatePresence>
                {showTranscript && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin border-t border-white/5 pt-4"
                  >
                    {intern.interviewTranscript.map((msg: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                        <span className="text-[8px] font-black uppercase text-brand tracking-widest">{msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}</span>
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-tighter">{msg.content}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Behavior Metrics */}
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Stress Handling</span>
                  <p className="text-[10px] font-semibold text-white uppercase leading-relaxed">{evaluation.behavioralAnalysis?.stressHandling || "Stable"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Response Hesitation</span>
                  <p className="text-[10px] font-semibold text-white uppercase leading-relaxed">{evaluation.behavioralAnalysis?.responseHesitation || "Optimal"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Speaking Consistency</span>
                  <p className="text-[10px] font-semibold text-white uppercase leading-relaxed">{evaluation.behavioralAnalysis?.speakingConsistency || "Fluent"}</p>
                </div>
              </div>
            </div>
          )}

          {/* TASK ORCHESTRATOR (Visible only for Admitted/Hired Candidates) */}
          {intern.status === "ADMITTED" && (
            <div className="p-8 lg:p-12 rounded-[3rem] bg-[#050505] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Onboarding Task Orchestrator</h3>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    Assign and moderate execution protocols
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer border-none"
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
                    <div className="py-24 text-center space-y-4 opacity-20">
                      <Shield className="w-12 h-12 mx-auto animate-pulse" />
                      <div className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting onboarding protocol deployment</div>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-start gap-4"
                      >
                        <button 
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-1 ${task.status === 'completed' ? 'text-emerald-400' : 'text-white/20 hover:text-brand'}`}
                        >
                          {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div className="flex-1 space-y-2">
                          <h4 className={`text-base font-black uppercase tracking-tighter ${task.status === 'completed' ? 'text-white/30 line-through' : 'text-white'}`}>{task.title}</h4>
                          <p className="text-xs text-white/50">{task.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PERSISTENT FEEDBACK LOOP INPUT (Visible only for Admitted/Hired Candidates) */}
          {intern.status === "ADMITTED" && (
            <div className="p-8 lg:p-12 rounded-[3rem] bg-[#050505] border border-white/5 space-y-8 shadow-2xl">
              <div className="space-y-1 border-b border-white/5 pb-4">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Onboarding Hindsight Feedback</h3>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Record performance data to feed back into future AI recommendations</div>
              </div>

              <form onSubmit={submitReview} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Review Cycle Stage</label>
                    <select 
                      value={feedbackLoopStage}
                      onChange={(e) => setFeedbackLoopStage(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-brand"
                    >
                      <option value="Day 30">Day 30 Review</option>
                      <option value="Day 90">Day 90 Review</option>
                      <option value="Day 180">Day 180 Review</option>
                      <option value="Annual">Annual Review</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Performance Rating (1-10)</label>
                    <input 
                      type="number"
                      min={1}
                      max={10}
                      value={feedbackScore}
                      onChange={(e) => setFeedbackScore(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Qualitative Performance Feedback</label>
                  <textarea 
                    rows={2}
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Describe cognitive adaptiveness, speed of learning, exit triggers..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-semibold text-white outline-none focus:border-brand resize-none"
                  />
                </div>

                {memorySaved && (
                  <div className="p-4 rounded-xl bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest">
                     Hindsight loop synchronized to persistent Company Memory registry.
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={feedbackSending}
                  className="px-6 py-3 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all border-none cursor-pointer"
                >
                  {feedbackSending ? "Caching Loop..." : "Register Hindsight Memory"}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
