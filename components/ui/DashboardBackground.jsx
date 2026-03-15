'use client';

import { motion } from 'framer-motion';

export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Orb 1: Emerald (Top left) */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] bg-emerald-300/20 dark:bg-emerald-500/10"
      />

      {/* Orb 2: Cyan (Bottom right) */}
      <motion.div
        animate={{
          x: [0, -150, 50, 0],
          y: [0, -100, -50, 0],
          scale: [1, 1.1, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute -bottom-48 -right-48 w-[30rem] h-[30rem] rounded-full blur-[120px] bg-cyan-300/20 dark:bg-cyan-500/10"
      />

      {/* Orb 3: Amber (Center) */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [0.8, 1, 0.9, 0.8],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] rounded-full blur-[100px] bg-amber-300/10 dark:bg-amber-500/5"
      />
    </div>
  );
}
