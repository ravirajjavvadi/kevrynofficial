import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6 text-center">
      <div className="card-glow border-red-500/30 bg-red-500/5 p-12 max-w-lg w-full flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping"></div>
          <span className="text-4xl">📡</span>
        </div>
        <h1 className="text-6xl font-black text-red-500 mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Signal Lost</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          The emergency route or coordinate you are looking for has been moved or does not exist in the dispatch system.
        </p>
        <Link href="/">
          <button className="btn-emergency w-full">
            Return to Base
          </button>
        </Link>
      </div>
    </div>
  );
}
