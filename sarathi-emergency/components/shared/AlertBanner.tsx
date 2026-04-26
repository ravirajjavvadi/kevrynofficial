'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, XCircle, X } from 'lucide-react';
import { useState } from 'react';

type AlertVariant = 'info' | 'warning' | 'critical' | 'success';

interface AlertBannerProps {
  variant?: AlertVariant;
  title: string;
  message: string;
  dismissible?: boolean;
}

const variants: Record<AlertVariant, { bg: string; border: string; icon: any; iconColor: string }> = {
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info, iconColor: 'text-blue-400' },
  warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle, iconColor: 'text-orange-400' },
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/50', icon: XCircle, iconColor: 'text-red-500' },
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2, iconColor: 'text-emerald-400' },
};

export function AlertBanner({ variant = 'info', title, message, dismissible = true }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = variants[variant];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full rounded-xl border p-4 backdrop-blur-sm ${config.bg} ${config.border}`}
        role="alert"
      >
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 ${config.iconColor}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${config.iconColor}`}>{title}</h3>
            <p className="text-slate-300 text-sm mt-1">{message}</p>
          </div>
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss alert"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
