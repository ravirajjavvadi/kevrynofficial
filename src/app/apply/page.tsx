"use client"

import React, { useState, Suspense, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, ArrowLeft, CheckCircle, UploadCloud, 
  Terminal, User, Globe, Link as LinkIcon, Sparkles, Brain, 
  X, AlertCircle, FileText, Activity
} from "lucide-react"
import { useSearchParams } from "next/navigation"

interface AnalysisResult {
  mastery_index: number;
  verdict: "APPROVED" | "HOLD" | "DECLINED";
  extracted_skills: string[];
  experience_summary: string;
  match_reason: string;
  recommendation: string;
}

const SCAN_PHASES = [
  "Uplink Established — Buffering Intel...",
  "Extracting Neural Signatures...",
  "Computing Mastery Index...",
  "Syncing Recommendation Matrix..."
];

function ApplyForm() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'unspecified'
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    role: "unspecified"
  })

  // Phase 2 States
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanPhase, setScanPhase] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Protocol restriction: Only PDF assets allowed.")
      return
    }
    setFile(selectedFile)
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) validateAndSetFile(droppedFile)
  }

  const triggerAnalysis = async () => {
    if (!file) return;
    
    setIsAnalyzing(true)
    setError(null)
    setScanPhase(0)
    
    // Start Cinematic Timer
    const phaseInterval = setInterval(() => {
      setScanPhase(prev => (prev < 3 ? prev + 1 : prev))
    }, 2000)

    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("role", role)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: fd,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Neural Bridge Failure")
      }

      // Keep animation running for at least a few seconds for "beast" feel
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setAnalysisResult(data)
      setStep(4)
    } catch (err: any) {
      setError(err.message)
    } finally {
      clearInterval(phaseInterval)
      setIsAnalyzing(false)
    }
  }

  const nextStep = () => {
    if (step === 3) {
      triggerAnalysis()
    } else {
      setStep(s => Math.min(s + 1, 4))
    }
  }
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const variants = {
    initial: { opacity: 0, x: 20, filter: "blur(10px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -20, filter: "blur(10px)" }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-brand selection:text-black">
      {/* Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 neural-grid opacity-[0.02] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">
        
        {/* Protocol Header */}
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand/20 bg-brand/5 mb-6 shadow-[0_0_15px_var(--color-brand-glow)]"
          >
            <Brain className="w-4 h-4 text-brand" />
            <span className="text-[10px] font-black tracking-[0.4em] text-brand uppercase">Protocol: Recruitment v2.0</span>
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black text-foreground mb-4 tracking-tighter leading-none">
            Join The <span className="text-brand">Core.</span>
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">
             Sequence {step} of 4 &bull; Target Role: {role.replace('-', ' ').toUpperCase()}
          </p>
          
          <div className="mt-8 flex gap-3 justify-center">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-700 ease-out ${step >= i ? 'w-16 bg-brand shadow-[0_0_10px_var(--color-brand-glow)]' : 'w-4 bg-muted/20'}`} 
              />
            ))}
          </div>
        </div>

        {/* Neural Hub Container */}
        <div className="bg-card/40 backdrop-blur-3xl border border-border p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-brand/30">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Identification */}
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-10">
                <div className="flex items-center gap-4 border-b border-border pb-8">
                  <div className="p-4 rounded-3xl bg-brand/10 border border-brand/20">
                    <User className="w-8 h-8 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Identity</h2>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Personal Identification Nodes</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background/50 border-2 border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted/60 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all font-bold" placeholder="ARCHITECT NAME" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Direct Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background/50 border-2 border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted/60 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all font-bold" placeholder="protocol@kevryn.ai" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Connection Node (Phone)</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background/50 border-2 border-border rounded-2xl px-6 py-4 text-foreground placeholder-muted/60 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all font-bold" placeholder="+00 000 000 0000" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Neural Links */}
            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-10">
                <div className="flex items-center gap-4 border-b border-border pb-8">
                  <div className="p-4 rounded-3xl bg-accent/10 border border-accent/20">
                    <Globe className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Nexus Links</h2>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Professional Infrastructure Hubs</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">LinkedIn Authority</label>
                    <div className="relative">
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-background/50 border-2 border-border rounded-2xl pl-14 pr-6 py-4 text-foreground placeholder-muted/60 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-bold uppercase text-xs tracking-widest" placeholder="linkedin.com/..." />
                      <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">GitHub Neural Network</label>
                    <div className="relative">
                      <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full bg-background/50 border-2 border-border rounded-2xl pl-14 pr-6 py-4 text-foreground placeholder-muted/60 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-bold uppercase text-xs tracking-widest" placeholder="github.com/..." />
                      <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Intelligence Assets (Resume Upload) */}
            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-10">
                <div className="flex items-center gap-4 border-b border-border pb-8">
                  <div className="p-4 rounded-3xl bg-brand/10 border border-brand/20">
                    <Terminal className="w-8 h-8 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Neural Asset</h2>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Intelligence Resume Scan</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center p-16 text-center">
                    <div className="w-32 h-32 relative mb-12">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-b-2 border-brand rounded-full"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-4 bg-brand/10 rounded-full flex items-center justify-center border border-brand/20"
                      >
                        <Activity className="w-8 h-8 text-brand" />
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">AI Extraction Active</h3>
                      <p className="text-sm text-brand font-bold uppercase tracking-[0.3em] h-6">
                        {SCAN_PHASES[scanPhase]}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-4 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-inner relative overflow-hidden
                      ${isDragging ? 'border-brand bg-brand/10 scale-[1.02] shadow-[0_0_50px_var(--color-brand-glow)]' : file ? 'border-brand bg-brand/5' : 'border-border bg-background/20 hover:bg-brand/5 hover:border-brand'}
                    `}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".pdf"
                    />
                    
                    {file ? (
                      <>
                        <div className="p-8 bg-card rounded-[2rem] mb-8 shadow-[0_0_40px_var(--color-brand-glow)] border border-brand/40">
                          <FileText className="w-12 h-12 text-brand" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tighter">{file.name}</h3>
                        <p className="text-xs text-brand font-black tracking-widest uppercase">Asset Ready for Neural Ingestion</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="mt-6 p-2 rounded-full bg-muted/10 hover:bg-red-500/20 hover:text-red-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="p-8 bg-card rounded-[2rem] mb-8 group-hover:shadow-[0_0_40px_var(--color-brand-glow)] transition-all border border-border"
                        >
                          <UploadCloud className="w-12 h-12 text-brand" />
                        </motion.div>
                        <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tighter">Uplink Asset</h3>
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">Target: PDF &bull; Size: &lt; 5MB</p>
                      </>
                    )}
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest animate-shake">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Analysis Result */}
            {step === 4 && analysisResult && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center gap-10">
                <div className="w-full flex justify-between items-center border-b border-border pb-8">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-3xl border ${analysisResult.verdict === 'APPROVED' ? 'bg-green-500/10 border-green-500/20 text-green-500' : analysisResult.verdict === 'HOLD' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                      {analysisResult.verdict === 'APPROVED' ? <CheckCircle className="w-8 h-8" /> : analysisResult.verdict === 'HOLD' ? <Activity className="w-8 h-8" /> : <X className="w-8 h-8" />}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">Neural Report: <span className={analysisResult.verdict === 'APPROVED' ? 'text-green-500' : analysisResult.verdict === 'HOLD' ? 'text-yellow-500' : 'text-red-500'}>{analysisResult.verdict}</span></h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Classification Sequence Complete</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-brand tracking-tighter">{analysisResult.mastery_index}%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Mastery Index</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="p-8 rounded-[2.5rem] bg-background/40 border border-border space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand">Experience Synthesis</span>
                    <p className="text-sm text-foreground font-medium leading-relaxed">{analysisResult.experience_summary}</p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-background/40 border border-border space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Protocol Match Reason</span>
                    <p className="text-sm text-foreground font-medium leading-relaxed">{analysisResult.match_reason}</p>
                  </div>
                  <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-card/50 border border-border space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Neural Skill extraction</span>
                    <div className="flex flex-wrap gap-3">
                      {analysisResult.extracted_skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 rounded-xl bg-brand/10 border border-brand/20 text-[10px] font-bold uppercase tracking-widest text-brand cursor-default hover:bg-brand hover:text-black transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {analysisResult.verdict === 'APPROVED' ? (
                  <div className="w-full space-y-8">
                    <div className="text-center space-y-2">
                       <h3 className="text-2xl font-black uppercase tracking-tighter">Choose Your Specialization</h3>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select one path to ignite the assessment sequence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { id: 'quantum-web', name: 'Quantum Web Dev', icon: Globe, color: 'text-brand' },
                         { id: 'neural-native', name: 'Neural App Dev', icon: Activity, color: 'text-accent' },
                         { id: 'sovereign-backend', name: 'Sovereign Backend', icon: Terminal, color: 'text-white' },
                         { id: 'ai-ml', name: 'AI Engineering', icon: Brain, color: 'text-purple-400' }
                       ].map((path) => (
                         <button
                           key={path.id}
                           onClick={() => setFormData({ ...formData, role: path.id })}
                           className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-4 group
                             ${formData.role === path.id 
                               ? 'border-brand bg-brand/5 shadow-[0_0_20px_var(--color-brand-glow)]' 
                               : 'border-border bg-background/40 hover:border-brand/30'}
                           `}
                         >
                           <div className={`p-3 rounded-2xl bg-card border border-border group-hover:scale-110 transition-transform ${formData.role === path.id ? 'border-brand/40' : ''}`}>
                             <path.icon className={`w-5 h-5 ${path.color}`} />
                           </div>
                           <span className="font-black uppercase tracking-widest text-[10px]">{path.name}</span>
                         </button>
                       ))}
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!formData.role || formData.role === 'unspecified'}
                      onClick={() => {
                        const params = new URLSearchParams({
                          role: formData.role,
                          name: formData.name,
                          email: formData.email
                        })
                        window.location.href = `/test?${params.toString()}`
                      }}
                      className={`w-full p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer border-none transition-all
                        ${formData.role && formData.role !== 'unspecified' 
                          ? 'bg-brand text-black shadow-[0_0_40px_var(--color-brand-glow)]' 
                          : 'bg-muted/20 text-muted-foreground opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sequence 3: Assessment</span>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Initiate Test Protocol</h3>
                      </div>
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="w-full p-8 rounded-[2.5rem] bg-muted/10 border border-border flex items-center justify-between opacity-60">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Recommendation</span>
                      <h3 className="text-xl font-black uppercase tracking-tighter">{analysisResult.recommendation}</h3>
                    </div>
                    <AlertCircle className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Protocol Controls */}
          {step < 4 && !isAnalyzing && (
            <div className="mt-16 pt-10 border-t border-border flex items-center justify-between">
              <button 
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-foreground hover:bg-card border border-border'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Sequence Back
              </button>
              
              <button 
                onClick={nextStep}
                disabled={step === 3 && !file}
                className={`group flex items-center gap-4 px-12 py-5 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl active:scale-95
                  ${step === 3 && !file ? 'bg-muted/20 text-muted-foreground grayscale cursor-not-allowed' : 'bg-foreground text-background dark:bg-brand dark:text-black hover:scale-105'}
                `}
              >
                {step === 3 ? "Initiate Neural Scan" : "Next Sequence"} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Apply() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ApplyForm />
    </Suspense>
  )
}
