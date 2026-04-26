'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer pulsating ring */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border-4 border-red-500/50"
        />
        {/* Inner spinning cross */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full h-1 bg-red-600 rounded-full" />
          <div className="absolute h-full w-1 bg-red-600 rounded-full" />
        </motion.div>
      </div>
      <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase animate-pulse">
        System Initializing...
      </p>
    </div>
  );
}
