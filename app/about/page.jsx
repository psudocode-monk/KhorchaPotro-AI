'use client';

import DashboardBackground from '@/components/ui/DashboardBackground';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Ear, TrendingUp, BarChart3, Database, ShieldCheck, Zap } from 'lucide-react';

const BACKGROUND_TEXT = "IntelliSpend - India's First Bi-Lingual AI Powered Expense Tracker • ";

const FEATURES = [
  {
    icon: <Zap className="w-8 h-8 text-amber-500" />,
    title: "Gemini AI Advisor",
    desc: "Experience Google's most advanced AI providing contextual, terrifyingly accurate savings strategies.",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20 hover:border-amber-500/50"
  },
  {
    icon: <Ear className="w-8 h-8 text-indigo-500" />,
    title: "Bi-Lingual AI Support",
    desc: "See your expenses in English or Hindi with watching the platform categorize them instantly.",
    color: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/20 hover:border-indigo-500/50"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
    title: "Stock Playground",
    desc: "Practice trading real assets like Gold, Reliance, and Ethereum with ₹10,000 demo paper cash.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20 hover:border-emerald-500/50"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-cyan-500" />,
    title: "Advanced Analytics",
    desc: "Stunning historical charts powered by Recharts giving you ultimate visibility into your net worth.",
    color: "from-cyan-500/20 to-sky-500/20",
    border: "border-cyan-500/20 hover:border-cyan-500/50"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-purple-500" />,
    title: "Smart Budget Triggers",
    desc: "Set AI-driven budget limits that automatically alert you before you overspend during the month.",
    color: "from-purple-500/20 to-fuchsia-500/20",
    border: "border-purple-500/20 hover:border-purple-500/50"
  },
  {
    icon: <Database className="w-8 h-8 text-rose-500" />,
    title: "NoSQL Architecture",
    desc: "Your data is stored in bank-grade MongoDB clusters securely protected by NextAuth frameworks.",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20 hover:border-rose-500/50"
  }
];

export default function About() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <DashboardBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 relative z-10"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-32 pt-8">
      <DashboardBackground />

      {/* MASSIVE BACKGROUND MARQUEE */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-center overflow-hidden opacity-5 dark:opacity-[0.05]">
        <motion.div 
          className="flex whitespace-nowrap font-black text-[10rem] md:text-[14rem] uppercase leading-none tracking-tighter"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 60, repeat: Infinity }}
        >
          {BACKGROUND_TEXT}{BACKGROUND_TEXT}
        </motion.div>
        <motion.div 
          className="flex whitespace-nowrap font-black text-[10rem] md:text-[14rem] uppercase leading-none tracking-tighter"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 75, repeat: Infinity }}
        >
          {BACKGROUND_TEXT}{BACKGROUND_TEXT}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* HERO TITLE BLOCK */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold backdrop-blur-md mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.15)]">
             <ShieldCheck className="w-4 h-4" />
             The Future of Personal Finance
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 animate-gradient-x">IntelliSpend</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            Managing finances shouldn't be a chore. It should be an <strong className="text-emerald-500">experience</strong>. We combined the power of Google Gemini with bi-lingua AI support to actively grow your wealth.
          </p>
        </motion.div>

        {/* COMBINED FEATURES GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, i) => (
            <div 
              key={i} 
              className={`bg-white/70 dark:bg-black/40 backdrop-blur-2xl border ${feature.border} rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 group relative overflow-hidden`}
            >
              <div className={`absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0`}></div>
              
              <div className="relative z-10">
                <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-lg">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
