"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  GitBranch, 
  Globe, 
  Send, 
  ShieldCheck, 
  AlertCircle,
  Loader2
} from "lucide-react";

export default function TaskSubmitModal({ isOpen, onClose, task }: any) {
  const [repoUrl, setRepoUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/workspace/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          githubUrl: repoUrl,
          deployUrl: deployUrl
        })
      });

      if (!res.ok) throw new Error("Submission Failed");
      
      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        // Reload to show updated status in UI
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-brand uppercase tracking-widest">Protocol Submission</div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Submit Solution</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Task Context */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Target Task</div>
              <div className="text-sm font-bold text-white uppercase">{task?.title || "Initialize Architecture Protocol"}</div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <GitBranch className="w-3 h-3" /> GitHub Repository URL
                  </label>
                  <input 
                    type="url" 
                    required
                    placeholder="https://github.com/your-username/repo-name"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all placeholder:text-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Deployment URL (Optional)
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://your-project.vercel.app"
                    value={deployUrl}
                    onChange={(e) => setDeployUrl(e.target.value)}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-brand/10 border border-brand/20 flex items-center gap-4 text-brand"
                >
                  <ShieldCheck className="w-6 h-6" />
                  <div className="text-sm font-bold uppercase tracking-widest">Sovereign Audit Passed. Solution Cached.</div>
                </motion.div>
              )}

              {status === "error" && (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500">
                  <AlertCircle className="w-6 h-6" />
                  <div className="text-sm font-bold uppercase tracking-widest">Protocol Sync Failed. Retry Connection.</div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting || status === "success"}
                className="w-full py-6 rounded-2xl bg-brand text-black font-black uppercase tracking-[0.2em] shadow-[0_0_30px_var(--color-brand-glow)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>Initializing Audit <Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Execute Submission <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Background Glow */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand/10 blur-[120px] pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
