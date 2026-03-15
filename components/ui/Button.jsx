import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Button({ children, loading, variant = 'primary', className = '', ...props }) {
  const baseStyles = "flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-emerald-500/25 hover:shadow-lg border border-transparent",
    secondary: "bg-white dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/10",
    outline: "bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
        <span className="flex items-center gap-2">
          {children}
        </span>
      )}
    </motion.button>
  );
}
