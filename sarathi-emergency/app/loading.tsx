export default function Loading() {
  // We can't import the client component directly into a server component effectively 
  // without Next.js handling it natively via the 'use client' boundary, which it does.
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center text-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase animate-pulse">
          Routing Grid...
        </p>
      </div>
    </div>
  );
}
