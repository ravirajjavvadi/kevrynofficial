"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Shield, Zap, Globe, Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function InternshipCertificate() {
  const { id } = useParams();
  const [intern, setIntern] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIntern() {
      try {
        const res = await fetch(`/api/admin/interns/${id}`);
        if (res.ok) {
          const data = await res.json();
          setIntern(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntern();
  }, [id]);

  if (loading || !intern) return null;

  const qrUrl = `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://kevrynofficial.vercel.app/verify/${intern._id}&chld=L|1`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 print:p-0">
      {/* Certificate Frame */}
      <div className="w-[1123px] h-[794px] bg-white border-[20px] border-black/5 p-12 relative overflow-hidden flex flex-col justify-between">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 blur-[100px] pointer-events-none" />
        
        {/* Header Section */}
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-black text-xl italic">KR</div>
               <div className="text-sm font-black tracking-[0.3em] uppercase">KevRyn Intelligence</div>
             </div>
             <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest max-w-[200px]">
               Autonomous Systems & AI Orchestration Division
             </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Credential Node</div>
             <div className="font-mono text-sm font-bold bg-black text-white px-4 py-2 uppercase tracking-tighter">
               {intern.internId || intern._id.toUpperCase()}
             </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="text-center space-y-12 relative z-10 flex-1 flex flex-col justify-center">
          <div className="space-y-6">
            <h1 className="text-6xl font-black text-black tracking-tighter uppercase leading-tight italic">
              Certificate of<br />Excellence
            </h1>
            <div className="w-24 h-1 bg-red-500 mx-auto" />
          </div>

          <div className="space-y-4">
             <p className="text-sm font-bold text-black/60 uppercase tracking-[0.2em]">This sovereign credential is hereby awarded to</p>
             <h2 className="text-5xl font-black text-black tracking-tighter uppercase">{intern.name}</h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-lg font-medium leading-relaxed text-black/80">
              For achieving absolute mastery in the field of <span className="font-black uppercase text-red-500">{intern.domain || 'Core Intelligence Engineering'}</span>. 
              During their tenure, they demonstrated exceptional proficiency in neural logic orchestration, 
              sovereign architecture deployment, and collective intelligence development.
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-end relative z-10 pt-12">
          {/* Verification QR */}
          <div className="flex gap-6 items-end">
            <div className="p-2 border border-black/10 bg-white">
              <img src={qrUrl} alt="QR Verification" className="w-24 h-24" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3" /> Blockchain Verified
              </div>
              <div className="text-[10px] font-bold text-black/40 max-w-[150px] leading-tight">
                Scan to verify credential authenticity on the KevRyn Global Registry.
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="flex gap-16">
            <div className="text-center space-y-2">
              <div className="text-2xl font-serif italic text-black/80 border-b border-black/20 pb-2 px-8">
                Raviraj Javvadi
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">Chief Executive Officer</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-serif italic text-black/80 border-b border-black/20 pb-2 px-8">
                KevRyn Board
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">Managing Director</div>
            </div>
          </div>
        </div>

        {/* Compliance Stamps */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 flex flex-col gap-8 opacity-5">
           <Globe className="w-32 h-32" />
           <Shield className="w-32 h-32" />
           <Award className="w-32 h-32" />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: white !important; }
          .no-print { display: none; }
        }
      `}</style>
      
      {/* Control Panel (Hidden on Print) */}
      <div className="fixed bottom-8 right-8 flex gap-4 no-print">
        <button 
          onClick={() => window.print()}
          className="px-8 py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
        >
          Print / Download PDF
        </button>
      </div>
    </div>
  );
}
