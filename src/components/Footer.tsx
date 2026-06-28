"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hexagon, MessageSquare, GitBranch, Link2, Mail, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background pt-32 pb-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Identity */}
          <div className="md:col-span-5 flex flex-col items-start gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-brand/10 border border-brand/20 group-hover:border-brand transition-all">
                <Hexagon className="w-10 h-10 text-brand glow-text" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-foreground">KarsaTek OS</span>
                <span className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase -mt-1 ml-0.5">NEXT GEN AI IDE</span>
              </div>
            </Link>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm">
              We are architecting the future of software development through autonomous AI production. Code librement, déploie sans crainte.
            </p>
            <div className="flex items-center gap-4">
              {[MessageSquare, GitBranch, Link2, Mail].map((Icon, i) => (
                <button key={i} className="p-3 rounded-2xl bg-card border border-border text-muted-foreground hover:text-brand hover:border-brand/40 transition-all hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Ecosystem</span>
              <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <Link href="/features" className="hover:text-brand transition-colors">AI IDE</Link>
                <Link href="/features" className="hover:text-brand transition-colors">Neural ATS</Link>
                <Link href="/features" className="hover:text-brand transition-colors">Cloud Nexus</Link>
                <Link href="/features" className="hover:text-brand transition-colors">Quantum Auth</Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Company</span>
              <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <Link href="/careers" className="hover:text-brand transition-colors">Intelligence</Link>
                <Link href="/terms" className="hover:text-brand transition-colors">Protocols</Link>
                <Link href="/privacy" className="hover:text-brand transition-colors">Sovereignty</Link>
                <Link href="/contact" className="hover:text-brand transition-colors">Contact Hub</Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Status</span>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Core Online</span>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border mt-2">
                  <span className="text-[10px] font-bold text-muted uppercase block mb-1">Global Latency</span>
                  <span className="text-xl font-black text-foreground tracking-tighter">0.04ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Multi-Node Active System</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            &copy; {new Date().getFullYear()} KarsaTek OS Official Ecosystem. Powered by K-Intelligence.
          </p>
        </div>
      </div>
    </footer>
  )
}
