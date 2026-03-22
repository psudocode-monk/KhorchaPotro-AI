'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, CheckCircle2, ShieldCheck, Zap, Globe2, Ear, Database, Layout, TrendingUp, BarChart3, Lock, Users, Activity, PlayCircle, Target } from 'lucide-react';
import DashboardBackground from '@/components/ui/DashboardBackground';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const REVIEWS = [
  { name: "Rahul S.", role: "Freelancer", text: "Bi-lingual commands blew my mind. Easiest expense tracker in India!", stars: 5 },
  { name: "Priya M.", role: "Small Business Owner", text: "The UI is gorgeous. IntelliSpend makes finance actually fun to look at.", stars: 5 },
  { name: "Amit K.", role: "Student", text: "The AI Insights are crazy accurate. I saved ₹5000 my first month.", stars: 5 },
  { name: "Sneha V.", role: "Corporate", text: "Stock playground is such a unique addition. Learned trading without losing money!", stars: 5 },
  { name: "Vikram D.", role: "Entrepreneur", text: "Never thought an Indian app could look this premium. Award winning design!", stars: 5 },
  { name: "Anjali P.", role: "Designer", text: "Beautiful aesthetic. The dark mode gradients are just chef's kiss.", stars: 5 },
];

const TECH_STACK = [
  { name: "Next.js", icon: <Globe2 className="w-8 h-8 text-black dark:text-white" />, desc: "React Framework for insane performance and SEO." },
  { name: "React 19", icon: <Layout className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />, desc: "Component architecture powering the dynamic interfaces." },
  { name: "MongoDB", icon: <Database className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />, desc: "NoSQL DB keeping your financial data secure and scalable." },
  { name: "Gemini AI", icon: <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400" />, desc: "Google's most capable AI powering our financial insights." },
  { name: "Tailwind v4", icon: <ShieldCheck className="w-8 h-8 text-sky-500 dark:text-sky-400" />, desc: "Utility-first CSS building this gorgeous aesthetic." },
  { name: "Bi-lingual", icon: <Ear className="w-8 h-8 text-rose-500 dark:text-rose-400" />, desc: "English & Hindi native voice support first of its kind." },
];

const BACKGROUND_TEXT = "IntelliSense - India's First Bi-Lingual AI Powered Expense Tracker • ";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 pt-16">
      <DashboardBackground />
      
      {/* MASSIVE HERO BACKGROUND MARQUEE */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none z-0 flex flex-col justify-center overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
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

      <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-bold backdrop-blur-md mb-6 uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.15)]">
             <span className="flex h-2.5 w-2.5 relative justify-center items-center">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
             </span>
             First time in market: Bi-lingual Indian Expense Tracker
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] pb-2">
            Master your money with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-indigo-400 animate-gradient-x">
              IntelliSpend
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The most beautifully designed, award-winning financial dashboard built specifically for India. Track expenses, analyze with Gemini AI, and play the stock market seamlessly in English or Hindi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href={!session ? "/register" : "/dashboard"} 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] overflow-hidden scale-100 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-2 text-lg">
                {session ? "Go to Dashboard" : "Start Tracking for Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            {!session && (
              <Link href="/login" className="px-8 py-4 font-bold text-gray-700 dark:text-gray-300 transition-all hover:text-emerald-600 dark:hover:text-emerald-400">
                Log into existing account
              </Link>
            )}
          </div>
        </motion.div>

        {/* REVIEWS MARQUEE */}
        <div className="w-full mt-32 relative flex flex-col items-center">
          <h3 className="text-sm font-bold tracking-[0.2em] text-cyan-600 dark:text-cyan-400 uppercase mb-8 opacity-80 text-center">Loved by thousands across India</h3>
          
          <div className="absolute left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10 bottom-0 pointer-events-none"></div>
          <div className="absolute right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10 bottom-0 pointer-events-none"></div>

          <div className="w-full overflow-hidden flex transform -rotate-1 relative">
            <motion.div 
               className="flex whitespace-nowrap py-4 w-max hover:[animation-play-state:paused]"
               animate={{ x: ["0%", "-33.333333%"] }}
               transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
              {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
                <div key={i} className="w-[300px] sm:w-[350px] shrink-0 mx-4 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 hover:border-emerald-500/30 transition-all group cursor-default">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 text-[15px] whitespace-normal mb-6 font-medium italic leading-relaxed group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors break-words">"{review.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-inner shrink-0">{review.name.charAt(0)}</div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-gray-900 dark:text-white text-sm truncate">{review.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{review.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* TECH STACK MARQUEE */}
        <div className="w-full mt-24 mb-20 relative flex flex-col items-center">
          <h3 className="text-sm font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase mb-8 opacity-80 text-center">Powered by Next-Gen Technologies</h3>
          
          <div className="absolute left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10 bottom-0 pointer-events-none"></div>
          <div className="absolute right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10 bottom-0 pointer-events-none"></div>

          <div className="w-full overflow-hidden flex transform rotate-1 relative">
            <motion.div 
               className="flex whitespace-nowrap py-4 w-max hover:[animation-play-state:paused]"
               animate={{ x: ["-33.333333%", "0%"] }}
               transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            >
              {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                <div key={i} className="relative w-[280px] sm:w-[320px] shrink-0 mx-4 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/5 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-help group/card">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover/card:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm shrink-0">
                      {tech.icon}
                    </div>
                    <div className="flex flex-col whitespace-normal break-words">
                      <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">{tech.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-snug">{tech.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* BENTO BOX FEATURES */}
        <div className="w-full mt-32 mb-20 relative flex flex-col items-center">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">Everything you need. <br className="hidden sm:block"/><span className="text-emerald-500">Nothing you don't.</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A ridiculously powerful suite of financial tools packed into a beautiful, award-winning interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4">
            {/* Big Feature 1 */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <Zap className="w-48 h-48 text-emerald-500" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Gemini AI Financial Advisor</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md leading-relaxed">
                  Stop guessing where your money goes. Our Google Gemini powered engine scans your expenses and delivers terrifyingly accurate insights and savings strategies in real-time.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-500">
                <Ear className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Bi-lingual Input</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                First in the Indian market! Speak your expenses naturally in Hindi or English, and watch IntelliSpend automatically categorize and track them instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 text-cyan-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Stock Playground</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Learn to trade without the risk. A fully simulated real-time stock and crypto environment with dynamic candlestick charts and ₹10,000 demo paper cash.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute right-0 bottom-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/4 translate-y-1/4">
                <BarChart3 className="w-64 h-64 text-emerald-500" />
              </div>
              <div className="flex flex-col h-full justify-center relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Bank-Grade Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg leading-relaxed">
                  Beautiful historical charts, strict budgeting constraints, and completely private NoSQL data architecture ensures your financial lifecycle is perfectly monitored and entirely yours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS & STATS SECTION */}
        <div className="w-full py-20 my-20 bg-emerald-900/5 dark:bg-emerald-500/5 border-y border-emerald-500/10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">₹5M+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">Expenses Tracked</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">10k+</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">99.9%</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">AI Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">2</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">Supported Languages</div>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="w-full mt-10 mb-32 relative flex flex-col items-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent blur-3xl -z-10"></div>
          <div className="bg-white/50 dark:bg-[#111]/50 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[3rem] p-12 md:p-20 text-center max-w-4xl w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 relative z-10">Ready to take control?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto relative z-10">Join thousands of Indians who have completely transformed their financial lives with IntelliSpend.</p>
            <div className="relative z-10">
              <Link 
                href={!session ? "/register" : "/dashboard"} 
                className="inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center gap-2 text-lg">
                  {session ? "Enter Dashboard" : "Create Free Account"}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t border-gray-200 dark:border-white/10 pt-16 pb-8 mt-auto px-4 mix-blend-luminosity">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                IntelliSpend
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                The premier AI-powered bi-lingual financial dashboard built specifically for the modern Indian ecosystem.
              </p>
              <div className="flex gap-4 text-emerald-600 dark:text-emerald-500 font-medium">
                <Link href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">GitHub</Link>
                <Link href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Discord</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-3 test-sm text-gray-500 dark:text-gray-400">
                <li><Link href="/dashboard" className="hover:text-emerald-500 transition-colors">Dashboard</Link></li>
                <li><Link href="/stocks" className="hover:text-emerald-500 transition-colors">Stock Simulator</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">AI Insights</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3 test-sm text-gray-500 dark:text-gray-400">
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 border-t border-gray-200 dark:border-white/5 pt-8">
            © {new Date().getFullYear()} IntelliSpend. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
