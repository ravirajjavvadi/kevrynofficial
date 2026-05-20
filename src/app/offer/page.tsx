"use client"

import React, { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { 
  Shield, Globe, Mail, FileText, 
  Award, Target, Users, BookOpen,
  ArrowDown, CheckCircle, Download, 
  ExternalLink, Fingerprint, Zap
} from "lucide-react"
import { getInternData, InternData } from "@/lib/registry"

function OfferContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [data, setData] = useState<InternData | null>(null)
  const [host, setHost] = useState("")

  useEffect(() => {
    async function fetchIntern() {
      if (!id) return;
      try {
        const res = await fetch(`/api/intern/${id}`);
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          // Fallback to local storage for legacy tests
          const localResult = getInternData(id);
          setData(localResult);
        }
      } catch (err) {
        console.error("Fetch failure:", err);
        const localResult = getInternData(id);
        setData(localResult);
      }
    }
    
    fetchIntern();
    setHost(window.location.origin)
  }, [id])

  if (!data) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
       <p className="text-brand font-black uppercase tracking-[0.5em]">Protocol Syncing...</p>
    </div>
  )

  const qrUrl = `${host}/verify/${data.id}`
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}&color=0369a1&bgcolor=ffffff`

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground selection:bg-brand selection:text-black font-sans pb-12 print-container">
      {/* Cinematic Background */}
      <div className="fixed inset-0 neural-grid opacity-[0.03] pointer-events-none no-print" />
      <div className="fixed top-0 inset-x-0 h-64 bg-brand/10 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none no-print" />

      {/* TOP SECTION: Identity */}
      <header className="relative z-10 max-w-5xl mx-auto px-8 pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-12 print:pt-0 print:pb-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--color-brand-glow)] print:shadow-none print:border print:border-brand">
               <span className="text-2xl font-black text-black">KR</span>
            </div>
            <div className="space-y-0.5">
               <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">KevRyn Technologies</h1>
               <p className="text-[8px] font-bold text-brand uppercase tracking-[0.3em]">AI-Powered Innovation Ecosystem</p>
            </div>
         </div>
         
         <div className="flex flex-col md:items-end gap-1.5 text-right">
            <div className="flex items-center gap-2 text-muted-foreground">
               <Globe className="w-2.5 h-2.5" /> <span className="text-[8px] font-bold uppercase tracking-widest leading-none text-white/40">kevryn.ai</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
               <Mail className="w-2.5 h-2.5" /> <span className="text-[8px] font-bold uppercase tracking-widest leading-none text-white/40">protocol@kevryn.ai</span>
            </div>
            <div className="mt-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 no-print">
               <span className="text-[8px] font-black tracking-widest uppercase opacity-40">ID: {data.id?.toString().slice(-8) || "UNKNOWN"}</span>
            </div>
         </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 py-10 text-center print:py-0 print:mt-[-5mm]">
         <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
         >
            <span className="text-[8px] font-black text-accent uppercase tracking-[0.5em]">Official Appointment Document</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
               Offer Of <br/> <span className="text-brand">Internship.</span>
            </h2>
         </motion.div>

         <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 print:mt-6">
            
            {/* LEFT: Candidate Card */}
            <div className="lg:col-span-2 space-y-6">
               <div className="p-8 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 text-left relative overflow-hidden print:bg-white print:border-slate-200">
                  <div className="absolute top-0 right-0 p-6 no-print">
                     <Fingerprint className="w-10 h-10 text-brand/20" />
                  </div>
                  
                  <div className="space-y-8">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Appointed Candidate</span>
                        <h3 className="text-3xl font-black tracking-tighter uppercase">{data.name?.toUpperCase() || "CREDENTIAL CORRUPTED"}</h3>
                     </div>

                     <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
                        <div className="space-y-1">
                           <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Assigned Role</span>
                           <p className="text-base font-bold uppercase tracking-tighter">{data.role?.toUpperCase() || "UNASSIGNED"}</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Duration</span>
                           <p className="text-base font-bold uppercase tracking-tighter">6 MONTHS (Full-time)</p>
                        </div>
                     </div>

                     <div className="p-5 rounded-xl bg-brand/5 border border-brand/20">
                        <p className="text-[10px] font-medium leading-relaxed italic text-white/70">
                           "We are pleased to offer you the position of {data.role || 'Intern'} at KevRyn Technologies. Your performance in the Qualifier Arena has demonstrated exceptional cognitive alignment with our core objectives."
                        </p>
                     </div>
                  </div>
               </div>

               {/* Modern Content Blocks */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-left print:bg-white print:border-slate-200">
                     <Target className="w-4 h-4 text-brand" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Key Objectives</h4>
                     <ul className="text-[9px] text-muted-foreground space-y-1 font-medium leading-none">
                        <li>• Sovereign Engine Optimization</li>
                        <li>• Neural Interface Refactoring</li>
                        <li>• Deployment to Core Nodes</li>
                     </ul>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-left print:bg-white print:border-slate-200">
                     <BookOpen className="w-4 h-4 text-accent" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Learning Areas</h4>
                     <ul className="text-[9px] text-muted-foreground space-y-1 font-medium leading-none">
                        <li>• LLM Orchestration</li>
                        <li>• High-Performance Systems</li>
                        <li>• Cyber Protocol Security</li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* RIGHT: AI Index & Verification */}
            <div className="space-y-6">
               {/* AI Score Card */}
               <div className="p-6 rounded-[2rem] bg-gradient-to-br from-brand/20 to-accent/10 border border-brand/30 text-center space-y-3 print:bg-white print:border-brand/40">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand">AI Compatibility Index</span>
                  <div className="relative inline-block scale-90">
                     <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-white/5" />
                        <motion.circle 
                           cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="5" fill="transparent" 
                           strokeDasharray={276}
                           initial={{ strokeDashoffset: 276 }}
                           animate={{ strokeDashoffset: 276 - (276 * data.score) / 100 }}
                           className="text-brand"
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-foreground tracking-tighter">{data.score}%</span>
                     </div>
                  </div>
               </div>

               {/* QR Verification */}
               <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 text-center space-y-4">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Digital Verification</span>
                  <div className="p-2 bg-white rounded-xl inline-block">
                     <img src={qrImage} alt="Verification QR" className="w-20 h-20" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[6px] font-mono text-brand uppercase break-all leading-none">{data.id || "N/A"}</p>
                     <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Scan to authenticate</p>
                  </div>
               </div>

               {/* Digital Signature Suite */}
               <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 space-y-6 relative overflow-hidden print:p-4">
                  <div className="text-center space-y-4">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Executive Authorization</span>
                    
                    <div className="space-y-6">
                      {/* Founder Signature */}
                      <div className="space-y-1">
                        <div className="py-1 border-b border-white/10">
                          <span className="text-3xl font-signature text-white opacity-90 leading-none block print:text-white">Raviraj Javvadi</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black uppercase tracking-tighter text-brand">Founder & Architect</span>
                        </div>
                      </div>

                      {/* CEO Signature */}
                      <div className="space-y-1">
                        <div className="py-1 border-b border-white/10">
                          <span className="text-3xl font-signature text-white opacity-90 leading-none block print:text-white">Bhoompally Kalyan Reddy</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black uppercase tracking-tighter text-accent">CEO & Hiring Director</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* KevRyn Branding Piece */}
                    <div className="pt-4 mt-2 border-t border-white/5 flex flex-col items-center gap-2">
                       <div className="w-8 h-8 bg-gradient-to-br from-brand to-accent rounded-lg flex items-center justify-center">
                          <span className="text-sm font-black text-black">KR</span>
                       </div>
                       <div className="text-center">
                          <h5 className="text-[9px] font-black tracking-tighter uppercase text-white/80">KevRyn Technologies</h5>
                          <p className="text-[6px] font-bold text-brand uppercase tracking-[0.2em] leading-none">Intelligence Ecosystem</p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

         </div>

         {/* Actions */}
         <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 no-print">
            <button 
              onClick={() => window.print()}
              className="px-10 py-5 rounded-2xl bg-brand text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_40px_var(--color-brand-glow)]"
            >
               <Download className="w-4 h-4 mr-2 inline" /> Export PDF
            </button>
            <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-foreground font-black uppercase tracking-widest text-[10px]">
               Accept Appointment
            </button>
         </div>

         {/* Print Optimized Styles */}
         <style jsx global>{`
           @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
           
           .font-signature {
             font-family: 'Pinyon Script', cursive;
           }

           @media print {
             @page {
               size: A4;
               margin: 0;
             }
             html, body {
               background: #0A0A0A !important;
               color: #ffffff !important;
               margin: 0 !important;
               padding: 0 !important;
               -webkit-print-color-adjust: exact !important;
               print-color-adjust: exact !important;
               height: 297mm !important;
               width: 210mm !important;
               overflow: hidden !important;
             }
             .print-container {
               width: 210mm !important;
               height: 297mm !important;
               padding: 10mm 12mm !important; /* Balanced padding */
               background: #0A0A0A !important;
               color: #ffffff !important;
               position: relative !important;
               margin: 0 !important;
               display: flex !important;
               flex-direction: column !important;
               overflow: hidden !important;
             }
             
             header { 
               margin-bottom: 6mm !important; 
               padding-bottom: 6mm !important; 
               border-bottom: 1pt solid rgba(255,255,255,0.1) !important;
               display: flex !important;
               flex-direction: row !important;
               justify-content: space-between !important;
               width: 100% !important;
             }

             main { padding: 0 !important; margin: 0 !important; flex: 1 !important; }

             h1, h2, h3, h4, span, p, li, div { color: #ffffff !important; }

             h2 { 
               font-size: 42pt !important; 
               margin-bottom: 6mm !important; 
               border-bottom: 3pt solid #00d2ff !important;
               padding-bottom: 2mm !important;
               font-weight: 900 !important;
             }
             
             h3 { font-size: 28pt !important; font-weight: 900 !important; }

             .grid { 
               display: grid !important;
               grid-template-columns: 1.8fr 1.2fr !important;
               gap: 6mm !important; 
               margin-top: 6mm !important;
             }

             /* Dark Mode Cards for Print */
             .p-8, .p-6, .p-5 {
               background-color: rgba(255,255,255,0.03) !important;
               border: 1pt solid rgba(255,255,255,0.1) !important;
               border-radius: 2rem !important;
               box-shadow: none !important;
               backdrop-filter: blur(20px) !important;
             }

             .bg-brand\\/5 { background-color: rgba(0, 210, 255, 0.05) !important; border: 1pt solid rgba(0, 210, 255, 0.2) !important; }
             
             .text-brand { color: #00d2ff !important; }
             .text-accent { color: #ff00ff !important; }
             .text-muted-foreground { color: rgba(255,255,255,0.5) !important; }
             .text-\\[8px\\] { font-size: 8pt !important; }

             /* Logo Box */
             .bg-gradient-to-br { background: linear-gradient(135deg, #00d2ff, #ff00ff) !important; border: none !important; }
             .bg-gradient-to-br span { color: #000000 !important; font-weight: 900 !important; }

             /* QR Code Container - Keep White for Scannability */
             .bg-white.rounded-xl { background-color: #ffffff !important; padding: 4pt !important; }

             .no-print, .actions, button {
               display: none !important;
             }

             .print-footer {
               display: block !important;
               position: absolute !important;
               bottom: 5mm !important;
               left: 12mm !important;
               right: 12mm !important;
               text-align: center !important;
               opacity: 0.3 !important;
               font-size: 8pt !important;
               border-top: 1pt solid rgba(255,255,255,0.1) !important;
               padding-top: 4mm !important;
             }
             
             * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
           }
         `}</style>

         <div className="hidden print:block print-footer">
            <p className="uppercase tracking-[0.4em] font-black italic text-brand">
               Sovereign Document • KevRyn Revolution AI • Authenticity Guaranteed
            </p>
         </div>
      </main>
    </div>
  )
}

export default function OfferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <OfferContent />
    </Suspense>
  )
}
