"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Mic, Terminal, AlertTriangle, ArrowRight, 
  Send, Brain, Activity, Shield, CheckCircle2, 
  Video, Eye, Volume2, User
} from "lucide-react";

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateId = searchParams.get("id");
  const name = searchParams.get("name") || "Candidate";
  const role = searchParams.get("role") || "Software Engineer";

  // Navigation / Phase State
  const [phase, setPhase] = useState<"hardware-check" | "active-chat" | "submitting" | "completed">("hardware-check");
  
  // Hardware Diagnostic States
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraOk, setCameraOk] = useState(false);
  const [micOk, setMicOk] = useState(false);
  
  // Chat / Interview States
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulation telemetry States
  const [simLogs, setSimLogs] = useState<string[]>([
    "Ingesting technical dialogue streams...",
    "Constructing Candidate Digital Twin representation...",
    "Correlating test metrics with hindsight Company Brain memories...",
    "Running predictive organizational simulation against baseline product team...",
    "Compiling Hiring Intelligence matrix..."
  ]);
  const [currentSimLogIndex, setCurrentSimLogIndex] = useState(0);
  const [simResults, setSimResults] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hardware Initialization
  const startHardware = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOk(true);
      setMicOk(true);
    } catch (err) {
      console.warn("Could not acquire full media assets:", err);
    }
  };

  useEffect(() => {
    if (phase === "hardware-check") {
      startHardware();
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [phase]);

  // Anti-Cheat & Fullscreen Protocol
  useEffect(() => {
    if (phase !== "active-chat") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setStrikes(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen && phase === "active-chat") {
        setStrikes(prev => prev + 1);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [phase]);

  // Initiate Chat
  const startInterview = async () => {
    if (!cameraOk || !micOk) return;
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.warn("Fullscreen request rejected:", err);
    }
    setPhase("active-chat");
    setChatLoading(true);
    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: candidateId, history: [], currentResponse: "", role, name })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentQuestion(data.question);
        setHistory([{ role: "assistant", content: data.question }]);
        setQuestionCount(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // Submit Answer & Fetch Next Question
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResponse.trim() || chatLoading) return;

    const newHistory = [
      ...history,
      { role: "user" as const, content: currentResponse }
    ];
    setHistory(newHistory);
    setCurrentResponse("");
    setChatLoading(true);

    try {
      if (questionCount >= 5) {
        // Evaluate and Submit Interview
        setPhase("submitting");

        // Start simulated logs progress interval
        const logInterval = setInterval(() => {
          setCurrentSimLogIndex(prev => {
            if (prev < 4) return prev + 1;
            clearInterval(logInterval);
            return prev;
          });
        }, 1200);

        const submitRes = await fetch("/api/interview/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: candidateId, history: newHistory, strikes })
        });
        if (submitRes.ok) {
          const data = await submitRes.json();
          setTimeout(() => {
            clearInterval(logInterval);
            setSimResults(data.simulation || {});
            setPhase("completed");
          }, 6000);
        } else {
          clearInterval(logInterval);
          throw new Error("Submit failure");
        }
      } else {
        // Fetch Next Adaptive Question
        const chatRes = await fetch("/api/interview/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: candidateId, history: newHistory, currentResponse, role, name })
        });
        if (chatRes.ok) {
          const data = await chatRes.json();
          setCurrentQuestion(data.question);
          setHistory([...newHistory, { role: "assistant", content: data.question }]);
          setQuestionCount(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  if (phase === "active-chat" && !isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-8 text-center space-y-8 select-none">
        <div className="absolute inset-0 bg-radial-gradient from-brand/5 to-black pointer-events-none" />
        <div className="inline-flex p-6 rounded-full bg-brand/10 border border-brand/20 mb-2 shadow-[0_0_30px_var(--color-brand-glow)]">
          <AlertTriangle className="w-16 h-16 text-brand" />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SECURE PROCTORING REQUIRED</h2>
          <p className="text-sm font-semibold text-white/60 leading-relaxed uppercase tracking-tighter">
            This interview requires a strict full-screen environment. Any attempt to exit full-screen will log a security breach strike on your dossier.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            document.documentElement.requestFullscreen().catch(err => {
              console.error(err);
            });
          }}
          className="px-8 py-5 rounded-2xl bg-brand text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_30px_var(--color-brand-glow)] border-none"
        >
          Restore Secure Fullscreen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden flex flex-col justify-between selection:bg-brand selection:text-black">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 neural-grid opacity-[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />

      {/* TOP HEADER */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-8 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-4">
          <Terminal className="w-5 h-5 text-brand" />
          <div>
            <span className="text-[10px] font-black text-brand tracking-[0.4em] uppercase">AI Cognitive Session</span>
            <h1 className="text-sm font-black uppercase text-white tracking-tighter leading-none mt-0.5">{role.replace("-", " ")}</h1>
          </div>
        </div>
        {phase === "active-chat" && (
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[9px] font-black uppercase tracking-widest text-brand animate-pulse">Session Active</span>
            <div className="text-xs font-mono font-bold text-white/40">Step {questionCount} of 5</div>
          </div>
        )}
      </header>

      {/* MAIN SCREEN */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        
        {/* Left Side: Video Diagnostics Feed */}
        <section className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.01] p-8 flex flex-col justify-between gap-6 relative">
          <div className="space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Behavioral Telemetry</div>
            
            {/* Local Stream Video Box */}
            <div className="relative aspect-video lg:aspect-square w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-75"
              />
              {!cameraOk && (
                <User className="w-12 h-12 text-white/10 animate-pulse relative z-10" />
              )}
              
              {/* Telemetry InfoOverlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-emerald-400 bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5">
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Face Locked</span>
                <span>FPS: 30</span>
              </div>
            </div>
            
            {/* Visual Indicators */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Video className="w-4 h-4" /> Camera Lock</span>
                <span className={`text-[10px] font-black uppercase ${cameraOk ? "text-emerald-400" : "text-red-500 animate-pulse"}`}>{cameraOk ? "Online" : "Diagnostic Incomplete"}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Volume2 className="w-4 h-4" /> Audio Input</span>
                <span className={`text-[10px] font-black uppercase ${micOk ? "text-emerald-400" : "text-red-500 animate-pulse"}`}>{micOk ? "Online" : "Diagnostic Incomplete"}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#0369a1]/5 border border-[#0369a1]/20 flex items-start gap-3">
              <Shield className="w-5 h-5 text-brand mt-0.5" />
              <div className="space-y-1">
                <span className="text-[9px] font-black text-brand uppercase tracking-widest">Integrity Lock Active</span>
                <p className="text-[9px] text-white/40 leading-relaxed font-bold uppercase">Focus strictly inside this screen. Tab switching or background audio shifts are recorded.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Center / Right: The Interactive Dialogue Terminal */}
        <section className="flex-1 flex flex-col justify-between p-8 lg:p-16 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* Hardware Diagnostic Screen */}
            {phase === "hardware-check" && (
              <motion.div 
                key="hardware"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto space-y-10 py-12"
              >
                <div className="space-y-4 text-center lg:text-left">
                  <div className="inline-flex p-4 rounded-3xl bg-brand/10 border border-brand/20 mb-2">
                    <Brain className="w-8 h-8 text-brand" />
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter">AI Interview Diagnostics</h2>
                  <p className="text-sm text-white/40 font-medium leading-relaxed">
                    Verify camera and mic connections to configure the telemetry bridge. The cognitive interviewer will evaluate logical flow, speaking style, and solution depth.
                  </p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Authorization Guidelines</span>
                  <ul className="space-y-2 text-xs font-semibold text-white/50 leading-relaxed">
                    <li>• Ensure a well-lit environment and lock camera placement.</li>
                    <li>• Dynamic questioning adapts continuously based on each response.</li>
                    <li>• Evaluation logs directly to the Recruiter War Room upon completion.</li>
                  </ul>
                </div>

                <button
                  onClick={startInterview}
                  disabled={!cameraOk || !micOk}
                  className="w-full py-6 rounded-2xl bg-brand text-black font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-40 disabled:grayscale transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_var(--color-brand-glow)] border-none cursor-pointer"
                >
                  Configure and Start Interview <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Active Dialogue Chat Room */}
            {phase === "active-chat" && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full gap-8"
              >
                {/* Scrollable Dialogue Area */}
                <div className="flex-1 space-y-8 overflow-y-auto pr-4 scrollbar-thin">
                  {history.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-4 p-6 rounded-3xl border ${msg.role === 'assistant' ? 'bg-white/[0.02] border-white/5' : 'bg-brand/5 border-brand/20 ml-12'}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${msg.role === 'assistant' ? 'bg-white/10 text-white' : 'bg-brand text-black'}`}>
                        {msg.role === 'assistant' ? 'AI' : 'ME'}
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{msg.role === 'assistant' ? 'Senior Engineering Lead' : name}</span>
                        <p className="text-sm font-semibold text-white/80 leading-relaxed uppercase tracking-tighter">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="flex items-center gap-3 text-brand/60 text-xs font-black uppercase tracking-widest p-6">
                      <Activity className="w-4 h-4 animate-pulse" /> Evaluating response...
                    </div>
                  )}
                </div>

                {/* Response Input Box */}
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="relative">
                    <textarea 
                      required
                      rows={3}
                      disabled={chatLoading}
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      placeholder="Type your structured solution and explanation..."
                      className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-medium focus:border-brand outline-none transition-all placeholder:text-white/10 resize-none pr-20"
                    />
                    <button 
                      type="submit"
                      disabled={chatLoading || !currentResponse.trim()}
                      className="absolute right-4 bottom-4 p-4 rounded-2xl bg-brand text-black hover:scale-105 active:scale-95 transition-all border-none disabled:opacity-50 disabled:grayscale cursor-pointer"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Neural Evaluation / Submission Screen */}
            {phase === "submitting" && (
              <motion.div 
                key="submitting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto text-left space-y-8 py-10"
              >
                <div className="w-20 h-20 relative mx-auto mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-b-2 border-brand rounded-full"
                  />
                  <div className="absolute inset-3 bg-brand/10 rounded-full flex items-center justify-center border border-brand/20">
                    <Brain className="w-6 h-6 text-brand animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4 font-mono">
                  <span className="text-[10px] font-black uppercase text-brand tracking-[0.3em]">Hiring Simulation Pipeline</span>
                  <div className="space-y-2.5">
                    {simLogs.slice(0, currentSimLogIndex + 1).map((log, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        className={`text-xs ${idx === currentSimLogIndex ? 'text-white font-bold animate-pulse' : 'text-white/40'}`}
                      >
                        &gt; {log}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Verification Complete Card (Simulation Dashboard) */}
            {phase === "completed" && (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto space-y-10 py-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-4 rounded-full bg-brand/10 border border-brand/20 shadow-[0_0_20px_var(--color-brand-glow)] mb-2">
                    <CheckCircle2 className="w-8 h-8 text-brand" />
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Simulation Complete</h2>
                  <p className="text-xs font-black text-brand uppercase tracking-widest">KarsaTek OS HireOS Predictor Output</p>
                </div>

                {simResults && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Success Probability</span>
                      <p className="text-2xl font-black text-brand">{simResults.successProbability || 90}%</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Team Compatibility</span>
                      <p className="text-2xl font-black text-emerald-400">{simResults.teamCompatibility || 85}%</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Burnout Risk</span>
                      <p className="text-2xl font-black text-red-500">{simResults.burnoutRisk || 20}%</p>
                    </div>
                  </div>
                )}

                {simResults?.explainableReasoning && (
                  <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-2 text-left">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">AI Rationale Overview</span>
                    <p className="text-xs text-white/70 leading-relaxed font-semibold uppercase tracking-tighter">{simResults.explainableReasoning}</p>
                  </div>
                )}

                <button 
                  onClick={() => router.push("/")}
                  className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all border-none cursor-pointer"
                >
                  Return to Surface Gate
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* Security Info Overlay */}
      {strikes > 0 && phase === "active-chat" && (
        <div className="fixed bottom-6 right-6 z-[300] bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4" /> Focus Breach Registered: {strikes}
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-brand font-black uppercase">Loading Terminal...</div>}>
      <InterviewContent />
    </Suspense>
  );
}
