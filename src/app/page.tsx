"use client"
import { motion, Variants } from "framer-motion"
import { 
  ArrowRight, Brain, Briefcase, ChevronRight, Code, Shield, Sparkles, 
  Terminal, Cpu, Zap, Database, Globe, Command
} from "lucide-react"
import Link from "next/link"
import React from "react"

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
}

const FloatingIcon = ({ icon: Icon, delay, x, y, size = 48, color = "text-brand" }: { icon: any, delay: number, x: string, y: string, size?: number, color?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4], 
      scale: 1,
      y: ["-10px", "10px", "-10px"],
      x: ["-5px", "5px", "-5px"]
    }}
    transition={{ 
      delay, 
      duration: 5 + Math.random() * 2, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{ left: x, top: y }}
    className={`absolute z-0 p-3 rounded-2xl bg-card border border-border/50 backdrop-blur-xl pointer-events-none shadow-2xl ${color}`}
  >
    <Icon style={{ width: size, height: size }} />
  </motion.div>
)

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen selection:bg-brand selection:text-black overflow-hidden bg-background">
      
      {/* Cinematic Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-12">
        {/* Background Visuals */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Floating Code Stack - Inspired by provided image */}
        <FloatingIcon icon={Terminal} delay={0.2} x="15%" y="20%" size={40} color="text-yellow-400" />
        <FloatingIcon icon={Code} delay={0.5} x="80%" y="25%" size={36} color="text-brand" />
        <FloatingIcon icon={Cpu} delay={0.8} x="10%" y="70%" size={44} color="text-accent" />
        <FloatingIcon icon={Database} delay={1.1} x="85%" y="65%" size={32} color="text-green-400" />
        <FloatingIcon icon={Globe} delay={1.4} x="20%" y="85%" size={38} color="text-blue-400" />
        <FloatingIcon icon={Command} delay={0.1} x="75%" y="80%" size={42} color="text-purple-400" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="flex flex-col items-center"
          >
            {/* High-Tech Badge */}
            <motion.div 
              variants={FADE_UP_ANIMATION_VARIANTS} 
              className="group flex items-center gap-3 px-6 py-2 rounded-full border border-brand/30 bg-brand/5 backdrop-blur-xl mb-10 cursor-pointer hover:border-brand/60 transition-all shadow-[0_0_20px_var(--color-brand-glow)]"
            >
              <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
              <span className="text-[10px] font-black tracking-[0.4em] text-brand uppercase">The Next Gen AI IDE</span>
              <ChevronRight className="w-3 h-3 text-brand group-hover:translate-x-1 transition-transform" />
            </motion.div>
            
            {/* Sovereign Hero Text */}
            <motion.h1 
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-12"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/20">
                Code. Deploy.<br />
              </span>
              <span className="text-brand glow-text drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
                Revolutionize.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-14 leading-relaxed font-medium tracking-tight"
            >
              KevRyn is an autonomous AI production ecosystem. We are eliminating the barrier between ideation and deployment. Build the future, scale the impossible.
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href="/apply"
                className="group relative px-10 py-5 bg-brand text-black font-black text-sm uppercase tracking-widest rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_50px_var(--color-brand-glow)] active:scale-95"
              >
                <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center gap-3">
                  Initiate Protocol <Zap className="w-4 h-4 fill-current transition-transform group-hover:scale-125" />
                </span>
              </Link>
              <Link 
                href="/features"
                className="px-10 py-5 rounded-2xl border border-border bg-card/40 backdrop-blur-xl text-foreground font-bold text-sm uppercase tracking-widest hover:bg-card/60 transition-all border-b-4 active:translate-y-1 active:border-b-0"
              >
                Access Ecosystem
              </Link>
            </motion.div>

            {/* Live Metrics Simulation */}
            <motion.div 
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-border/50 pt-16 w-full max-w-5xl"
            >
              {[
                { label: "Deployment Velocity", value: "0.4s" },
                { label: "AI Neural Capacity", value: "Infinite" },
                { label: "Active Nodes", value: "842,912" },
                { label: "Uptime Protocol", value: "99.99%" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground mb-1 tabular-nums">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Futuristic Feature Matrix */}
      <section className="w-full py-32 relative z-10 border-t border-border bg-background transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                Not Just a Website.<br />
                <span className="text-brand">An Active Company Brain.</span>
              </h2>
              <p className="text-muted text-xl font-medium">
                Our infrastructure automates complexity, allowing you to focus on absolute innovation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Neural ATS", desc: "AI-driven talent extraction with 99% accuracy in skill identification.", icon: Brain, color: "text-brand" },
              { title: "Sovereign Proxy", desc: "Enterprise-grade security built directly into the core AI kernel.", icon: Shield, color: "text-accent" },
              { title: "Cloud Nexus", desc: "No installation required. Run any language, any stack, instantly.", icon: Globe, color: "text-blue-400" },
              { title: "Quantum Evaluator", desc: "Automated test evaluation with advanced anti-cheat heuristics.", icon: Cpu, color: "text-red-400" },
              { title: "Protocol Offers", desc: "Instant cryptographic offer generation with QR verification.", icon: Sparkles, color: "text-yellow-400" },
              { title: "Command Hub", desc: "Full control over applicants and company workflows in one portal.", icon: Command, color: "text-green-400" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[3rem] border border-border bg-card hover:bg-background hover:border-brand/40 transition-all cursor-pointer relative overflow-hidden shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <feature.icon className={`w-12 h-12 ${feature.color} mb-8`} />
                <h3 className="text-2xl font-black text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proactive CTA Section */}
      <section className="w-full py-48 relative overflow-hidden">
        <div className="absolute inset-0 beast-gradient opacity-[0.03] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-foreground mb-12 leading-[0.9]"
          >
            Join the Revolution.<br />
            <span className="text-brand">Shape Civilization.</span>
          </motion.h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link 
              href="/apply"
              className="px-14 py-6 bg-foreground text-background font-black text-sm uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              Apply Program
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  )
}
