'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
  color: 'red' | 'orange' | 'green' | 'blue';
}

const colorMap = {
  red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
};

export function StatCard({ value, label, icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl border bg-gradient-to-b backdrop-blur-md ${colorMap[color]}`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <motion.span
        className={`text-3xl md:text-4xl font-black ${colorMap[color].split(' ').at(-1)}`}
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {value}
      </motion.span>
      <span className="text-slate-400 text-sm font-medium mt-1 text-center">{label}</span>
    </motion.div>
  );
}
