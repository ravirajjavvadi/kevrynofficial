"use client"
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Brain, Code, Cpu } from 'lucide-react'
import Link from 'next/link'

const jobs = [
  { 
    id: "ai-engineer", 
    title: "AI Infrastructure Engineer", 
    type: "Full-Time", 
    location: "Remote / Bengaluru", 
    desc: "Build the core autonomous engine that powers KarsaTek OS IDE. Experience with LLMs, CUDA, and distributed systems required.",
    icon: Brain 
  },
  { 
    id: "frontend-architect", 
    title: "Beast UI/UX Architect", 
    type: "Full-Time", 
    location: "Remote", 
    desc: "Design the most premium, cinematic company ecosystems in the world. GSAP, Framer Motion, and GLSL expertise is a must.",
    icon: Code 
  },
  { 
    id: "backend-sovereign", 
    title: "Sovereign Backend Dev", 
    type: "Internship", 
    location: "Global", 
    desc: "Engineering high-frequency deployment protocols and secure cryptographic offer systems.",
    icon: Cpu 
  },
]

export default function Careers() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-6 max-w-7xl mx-auto selection:bg-brand selection:text-black">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand/30 bg-brand/10 mb-8 shadow-[0_0_15px_var(--color-brand-glow)]">
          <Sparkles className="w-4 h-4 text-brand" />
          <span className="text-[10px] font-black tracking-[0.3em] text-brand uppercase">Protocol Recruitment</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
          Join The <br className="hidden md:block" />
          <span className="text-brand glow-text">Revolution.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
          We are not hiring employees. We are recruiting architects of the next civilization.
          Real impact, zero bureaucracy, absolute speed.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex flex-col p-12 rounded-[3.5rem] border border-border bg-card hover:bg-background hover:border-brand/40 transition-all cursor-pointer overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 rounded-3xl bg-background border border-border shadow-inner">
                <job.icon className="w-10 h-10 text-brand" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 px-4 py-2 rounded-full">
                  <Clock className="w-3 h-3" /> {job.type}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/5 px-4 py-2 rounded-full">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
              </div>
            </div>

            <h3 className="text-3xl font-black text-foreground mb-4 group-hover:text-brand transition-colors">{job.title}</h3>
            <p className="text-muted-foreground text-lg mb-10 font-medium leading-relaxed">{job.desc}</p>
            
            <Link 
              href={`/apply?role=${job.id}`}
              className="mt-auto flex items-center justify-between w-full px-10 py-5 bg-background border border-border rounded-2xl text-foreground font-black text-xs uppercase tracking-widest group-hover:bg-brand group-hover:text-black group-hover:border-brand transition-all shadow-xl active:scale-95"
            >
              Initiate Application
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        ))}

        {/* Exclusive "Coming Soon" Node */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-12 rounded-[3.5rem] border-2 border-dashed border-border bg-card/20 backdrop-blur-xl text-center"
        >
          <div className="p-4 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-pulse">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-2">More Intelligence Nodes Coming</h3>
          <p className="text-sm text-muted-foreground font-medium">Internal recruitment protocols are currently scaling.</p>
        </motion.div>
      </div>

      {/* Philosophy Section */}
      <section className="mt-48 py-24 border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { tag: "01", title: "Merit Only", text: "We don't care about your degree. We care about your ability to build." },
            { tag: "02", title: "Extreme Ownership", text: "You own your protocol from concept to global deployment." },
            { tag: "03", title: "Infinite Growth", text: "Work with AI that learns from your code. Scale your capacity by 100x." },
          ].map((node, i) => (
            <div key={i} className="flex flex-col gap-4">
              <span className="text-4xl font-black text-brand/20">{node.tag}</span>
              <h4 className="text-xl font-black text-foreground uppercase tracking-widest">{node.title}</h4>
              <p className="text-muted-foreground font-medium">{node.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
