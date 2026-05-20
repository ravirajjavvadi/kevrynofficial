"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hexagon, Zap, Shield, Globe, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] border-b border-border bg-background/40 backdrop-blur-2xl transition-all duration-500 overflow-hidden">
      {/* Animated Scan Line */}
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent"
      />

      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group relative">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="p-1.5 rounded-xl bg-brand/10 border border-brand/20 group-hover:bg-brand/20 group-hover:border-brand/40 transition-all"
          >
            <Hexagon className="w-9 h-9 text-brand glow-text" />
          </motion.div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-brand transition-colors">
              KEVRYN
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase -mt-1 ml-0.5">
              Revolution AI
            </span>
          </div>
        </Link>

        {/* Neural Hub Navigation */}
        <div className="hidden lg:flex items-center bg-card/40 border border-border px-8 py-3 rounded-full gap-10 shadow-2xl backdrop-blur-3xl">
          {[
            { name: "Ecosystem", href: "/features", icon: Globe },
            { name: "Intelligence", href: "/careers", icon: Zap },
            { name: "Sovereignty", href: "/verify", icon: Shield },
          ].map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
            >
              <item.icon className="w-3.5 h-3.5 group-hover:text-brand transition-colors" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-5 mr-5">
            <Link href="/sign-in" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Access
            </Link>
          </div>
          
          <ThemeToggle />
          
          <Link href="/apply" className="relative group px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-95 shadow-2xl">
            <div className="absolute inset-0 bg-brand translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <div className="absolute inset-0 border border-brand animate-pulse rounded-xl" />
            <span className="relative z-10 text-brand group-hover:text-black transition-colors duration-500">
              Protocol Apply
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
