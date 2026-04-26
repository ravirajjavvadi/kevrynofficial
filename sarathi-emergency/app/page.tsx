'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Phone,
  Shield,
  Zap,
  MapPin,
  Clock,
  Activity,
  Truck,
  Building2,
  Github,
} from 'lucide-react';
import { useI18n } from '@/components/shared/LanguageProvider';
import { StatCard } from '@/components/shared/StatCard';

export default function Home() {
  const { t } = useI18n();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: MapPin,
      title: 'AI-Powered Routing',
      description: 'Smart route analysis with real-time traffic',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Activity,
      title: 'Hospital Network',
      description: 'Bed availability & specialty filtering',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Zap,
      title: 'Green Corridor',
      description: 'Traffic alert system for emergency corridors',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Phone,
      title: 'Voice Assistant',
      description: 'Hands-free navigation for drivers',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Live location updates & ETA calculations',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Secure Auth',
      description: 'OTP-based driver verification',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight"
                >
                  <span className="gradient-text block">{t('home.saveLives')}</span>
                  <span className="text-white">{t('home.withPrecision')}</span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-slate-300 max-w-md"
                >
                  {t('home.subtitle')}
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link href="/driver-login" className="flex-1">
                  <button className="w-full btn-emergency text-lg py-4 group flex items-center justify-center gap-2 relative overflow-hidden">
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🚑
                    </motion.span>
                    {t('nav.driverLogin')}
                  </button>
                </Link>
                <Link href="/public-sos" className="flex-1">
                  <button className="w-full btn-secondary text-lg py-4 flex items-center justify-center gap-2">
                    <Phone size={20} />
                    {t('nav.sos')}
                  </button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="flex gap-4 pt-4">
                <div className="status-active px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  24/7 Live Tracking
                </div>
                <div className="status-active px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  100% Uptime SLA
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div variants={itemVariants} className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="card-glow p-8 relative z-10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <span className="text-sm font-semibold">🚑 Ambulance Unit 47</span>
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30">
                    <p className="text-xs text-slate-300 mb-2">Current Route</p>
                    <p className="text-sm font-semibold text-white">Hospital Central</p>
                    <div className="mt-3 flex justify-between text-xs text-slate-400">
                      <span>📍 2.3 km away</span>
                      <span>⏱️ 4 min ETA</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900/50 rounded-lg text-center border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Beds Available</p>
                      <p className="text-xl font-bold text-emerald-400">12</p>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg text-center border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">ETA Confidence</p>
                      <p className="text-xl font-bold text-blue-400">98%</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Traffic Status</p>
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-green-500/50 rounded-full"></div>
                      <div className="flex-1 h-2 bg-yellow-500/50 rounded-full"></div>
                      <div className="flex-1 h-2 bg-red-500/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-8 border-2 border-dashed border-red-500/20 rounded-2xl"
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 md:px-12 py-12 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="1,200+" label="Emergency Calls Handled" icon="🚑" color="red" />
            <StatCard value="98%" label="ETA Accuracy" icon="🎯" color="blue" />
            <StatCard value="4 min" label="Avg Response Time" icon="⚡" color="orange" />
            <StatCard value="50+" label="Hospitals Connected" icon="🏥" color="green" />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="px-6 md:px-12 py-20 max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for <span className="gradient-text">Emergency Response</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Everything first responders need to navigate emergencies efficiently and safely
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={featureVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card-glow p-6 hover:border-slate-600 transition-colors group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Portal Options */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 md:px-12 py-16 max-w-7xl mx-auto"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12">
              {t('home.choosePortal')}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Driver Portal */}
              <motion.div
                variants={featureVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="card-glow p-8 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-3.5 mb-4 group-hover:scale-110 transition-transform">
                      <Truck className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t('home.driverPortal')}</h3>
                    <p className="text-slate-400 mb-6">
                      Access live GPS, traffic heatmaps, and AI-optimized routes
                    </p>
                    <Link href="/driver-login">
                      <button className="w-full btn-primary group-hover:from-blue-700 group-hover:to-blue-800">
                        {t('home.loginDriver')}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Public SOS */}
              <motion.div
                variants={featureVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="card-glow p-8 hover:border-red-500/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-3.5 mb-4 group-hover:scale-110 transition-transform">
                      <Phone className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t('home.sosPortal')}</h3>
                    <p className="text-slate-400 mb-6">
                      One-tap emergency alert for immediate assistance
                    </p>
                    <Link href="/public-sos">
                      <button className="w-full btn-emergency group-hover:from-red-700 group-hover:to-red-800">
                        {t('home.sendAlert')}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Admin Panel */}
              <motion.div
                variants={featureVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="card-glow p-8 hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 p-3.5 mb-4 group-hover:scale-110 transition-transform">
                      <Building2 className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t('home.adminPortal')}</h3>
                    <p className="text-slate-400 mb-6">
                      Manage resources, bed availability, and traffic zones
                    </p>
                    <Link href="/hospital-login">
                      <button className="w-full btn-secondary">
                        {t('home.adminDashboard')}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 md:px-12 py-20 max-w-5xl mx-auto text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card-glow p-12 border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-500/10"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
              Ready to Save Lives?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of emergency responders using SARATHI for faster,
              smarter emergency navigation.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/driver-login">
                <button className="btn-emergency text-lg px-8 py-4">
                  Get Started Now
                </button>
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Contact Support
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 backdrop-blur-md mt-20 py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Image src="/favicon.ico" alt="Sarathi logo" width={24} height={24} />
                <div>
                  <span className="font-bold gradient-text text-lg">SARATHI Emergency</span>
                  <p className="text-xs text-slate-500">AI-powered emergency navigation</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Documentation</a>
                <a href="#" className="hover:text-white transition">Support</a>
              </div>
              <a
                href="https://github.com/rickeygona"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="rickeygona on GitHub"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
              >
                <Github size={18} />
                <span>rickeygona</span>
              </a>
            </div>
            <div className="border-t border-slate-800/50 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
              <span>© 2026 SARATHI. All emergency cases prioritized.</span>
              <span>Built with ❤️ for emergency responders</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
