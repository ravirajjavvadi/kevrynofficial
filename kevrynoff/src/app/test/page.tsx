"use client"

import React, { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  Shield, Timer, ArrowRight, ArrowLeft, 
  Terminal, CheckCircle, AlertTriangle, Activity,
  Lock, Copy, MousePointer2, ExternalLink
} from "lucide-react"
import { Question } from "@/data/question_pool"
import { generateTestSet } from "@/lib/test-engine"

function TestContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
   const [questions, setQuestions] = useState<Question[]>([])
   const [currentIndex, setCurrentIndex] = useState(0)
   const [answers, setAnswers] = useState<Record<string, number>>({})
   const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [isFinished, setIsFinished] = useState(false)
   const [strikes, setStrikes] = useState(0)
   const [testResult, setTestResult] = useState<any>(null)
   const [candidateName, setCandidateName] = useState('Unknown Candidate')
   const [candidateEmail, setCandidateEmail] = useState('')
   const [candidateRole, setCandidateRole] = useState('unspecified')

   // Initialize Identity & Test Context
   useEffect(() => {
     const name = searchParams.get('name')
     const email = searchParams.get('email')
     const role = searchParams.get('role')

     if (!name || !role) {
       console.warn("Incomplete candidate metadata. Redirecting to protocol gate.")
       return
     }

     setCandidateName(name)
     setCandidateEmail(email || '')
     setCandidateRole(role)

     // Determine internal domain from role
     let domain: any = "quantum-web"
     const currentRole = role || 'unspecified'
     if (currentRole.includes("app") || currentRole.includes("neural")) domain = "neural-native"
     if (currentRole.includes("backend") || currentRole.includes("sovereign")) domain = "sovereign-backend"
     if (currentRole.includes("ai") || currentRole.includes("ml")) domain = "ai-ml"

     const set = generateTestSet(domain)
     setQuestions(set)
   }, [searchParams])

  // Anti-Cheat Protocol
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    document.addEventListener("contextmenu", handleContextMenu)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setStrikes(prev => prev + 1)
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleSelect = (optionIndex: number) => {
    const q = questions[currentIndex]
    setAnswers({ ...answers, [q.id]: optionIndex })
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/evaluate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: candidateName,
          email: candidateEmail,
          role: candidateRole,
          answers,
          questions: questions.map(q => ({ id: q.id, question: q.question, domain: q.domain })),
          strikes
        })
      })
      
      const result = await response.json()
      
      // Use Intern ID from Server-Side Registration
      if (result.verdict === 'ADMITTED') {
        setTestResult({ ...result, internId: result.internId });
      } else {
        setTestResult(result);
      }
      
      setIsFinished(true)
    } catch (err) {
      console.error("Submission failed", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update final UI button (around line 145) 
  // I will do this in the next chunk or here if possible

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl bg-card border border-border p-12 rounded-[3rem] text-center space-y-8"
        >
          <div className="inline-flex p-6 rounded-full bg-brand/10 border border-brand/20 mb-4 shadow-[0_0_20px_var(--color-brand-glow)]">
            <CheckCircle className="w-12 h-12 text-brand" />
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">Assessment Terminated</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Neural Sync Sequence Complete</p>
          
          <div className="p-8 rounded-3xl bg-background/50 border border-border grid grid-cols-2 gap-4">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Final Accuracy</span>
              <p className="text-3xl font-black text-brand">{testResult?.score || 0}%</p>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Integrity Status</span>
              <p className={`text-3xl font-black ${strikes > 3 ? 'text-red-500' : 'text-green-500'}`}>{strikes > 3 ? 'COMPROMISED' : 'STABLE'}</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className={`p-6 rounded-3xl border-2 ${testResult?.verdict === 'ADMITTED' ? 'border-brand bg-brand/5' : 'border-red-500/20 bg-red-500/5'}`}>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Verdict: {testResult?.verdict}</h3>
                <p className="text-sm font-medium text-muted-foreground">{testResult?.summary}</p>
             </div>
             {testResult?.verdict === 'ADMITTED' && (
                <button 
                  onClick={() => router.push(`/offer?id=${testResult?.internId}`)}
                  className="w-full py-6 rounded-2xl bg-brand text-black font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_30px_var(--color-brand-glow)]"
                >
                  Download Offer Protocol
                </button>
             )}
          </div>
        </motion.div>
      </div>
    )
  }

  const currentQ = questions[currentIndex]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* HUD Header */}
      <div className="w-full h-24 border-b border-border bg-card/30 backdrop-blur-3xl px-8 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-6">
          <Terminal className="w-6 h-6 text-brand" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-brand tracking-[0.4em] uppercase">Arena Active</span>
            <span className="text-sm font-black uppercase tracking-tighter">{candidateRole.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/50 px-8 py-3 rounded-2xl border border-border">
          <Timer className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
          <span className={`text-xl font-mono font-black ${timeLeft < 300 ? 'text-red-500' : 'text-foreground'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {strikes > 0 && (
             <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-500">
               <AlertTriangle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Protocol Breach: {strikes}</span>
             </div>
          )}
          <div className="p-3 rounded-xl bg-muted/10 border border-border">
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Progress */}
        <div className="w-80 border-r border-border bg-card/10 p-6 hidden lg:flex flex-col gap-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Neural Synchronicity</span>
          <div className="grid grid-cols-4 gap-3">
             {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all
                    ${currentIndex === i ? 'border-brand bg-brand/10 text-brand shadow-[0_0_15px_var(--color-brand-glow)]' : answers[questions[i]?.id] !== undefined ? 'border-brand/40 bg-brand/5 text-brand/60' : 'border-border text-muted-foreground'}
                  `}
                >
                  {i + 1}
                </button>
             ))}
          </div>
          
          <div className="mt-auto space-y-4">
             <div className="p-6 rounded-3xl bg-background/50 border border-border space-y-3">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-40">System Log</span>
                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed uppercase">
                   Monitoring behavioral entropy...<br/>
                   Anti-cheat protocol version 2.4 active.
                </p>
             </div>
          </div>
        </div>

        {/* Center - Question Stage */}
        <main className="flex-1 overflow-y-auto p-12 flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-12 py-12">
            <AnimatePresence mode="wait">
              {currentQ && (
                <motion.div 
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <span className="px-4 py-1 rounded-full bg-brand/10 border border-brand/20 text-[10px] font-black text-brand uppercase tracking-widest">
                       Query {currentIndex + 1} / {questions.length} &bull; {currentQ.domain.replace('-', ' ')}
                    </span>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter leading-tight uppercase">
                      {currentQ.question}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {currentQ.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={`group p-8 rounded-[2rem] border-2 transition-all flex items-center gap-6 text-left
                          ${answers[currentQ.id] === i 
                            ? 'border-brand bg-brand/5 shadow-[0_0_30px_var(--color-brand-glow)]' 
                            : 'border-border hover:border-brand/30 hover:bg-white/5'}
                        `}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black
                          ${answers[currentQ.id] === i ? 'bg-brand border-brand text-black' : 'border-border text-muted-foreground'}
                        `}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-lg font-bold text-foreground transition-all group-hover:translate-x-2">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 border-t border-border flex items-center justify-between">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-foreground hover:bg-card'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous Query
              </button>
              
              {currentIndex === questions.length - 1 ? (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group flex items-center gap-4 px-12 py-5 bg-brand text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_0_40px_var(--color-brand-glow)] hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? "Syncing Answers..." : "Final Submission"} <CheckCircle className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="group flex items-center gap-4 px-12 py-5 bg-foreground text-background dark:bg-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Next Query <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Security Overlays */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-brand/5 z-0" />
      <div className="fixed inset-0 pointer-events-none neural-grid opacity-[0.02] z-0" />
    </div>
  )
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TestContent />
    </Suspense>
  )
}
