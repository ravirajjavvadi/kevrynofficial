"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-black relative overflow-hidden pt-20">
       <div className="absolute inset-0 neural-grid opacity-[0.03] z-0" />
       
       <div className="relative z-10 p-1 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-white/5 to-transparent shadow-[0_0_80px_rgba(var(--color-brand-rgb),0.1)]">
         <div className="p-8 pb-12 rounded-[2.4rem] bg-background/80 backdrop-blur-3xl border border-white/5">
             <div className="text-center mb-8">
               <div className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-2">Protocol Authentication</div>
               <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Sovereign Sign-In</h1>
             </div>
             
             <SignIn 
               appearance={{
                 elements: {
                   rootBox: 'mx-auto',
                   card: 'bg-transparent shadow-none',
                   headerTitle: 'hidden',
                   headerSubtitle: 'hidden',
                   socialButtonsBlockButton: 'border-white/10 text-white hover:bg-white/5 shadow-none',
                   socialButtonsBlockButtonText: 'font-bold uppercase tracking-widest text-[10px]',
                   dividerLine: 'bg-white/10',
                   dividerText: 'text-white/40 font-black uppercase tracking-widest text-[10px]',
                   formFieldLabel: 'text-white/60 font-black uppercase tracking-widest text-[10px]',
                   formFieldInput: 'bg-white/5 border-white/10 text-white focus:border-brand focus:ring-1 focus:ring-brand rounded-xl font-medium p-3',
                   formButtonPrimary: 'bg-brand text-black hover:bg-brand/90 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_var(--color-brand-glow)] font-black uppercase tracking-widest text-xs py-4 rounded-xl',
                   footerActionText: 'text-white/40 font-bold',
                   footerActionLink: 'text-brand hover:text-brand/80 font-black tracking-widest uppercase text-[10px]',
                   formFieldWarningText: 'text-brand',
                   formFieldErrorText: 'text-red-500 font-bold',
                 }
               }} 
             />
         </div>
       </div>

       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 blur-[150px] pointer-events-none z-0" />
    </div>
  );
}
