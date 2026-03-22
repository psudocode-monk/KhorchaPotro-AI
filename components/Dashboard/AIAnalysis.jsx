'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Languages } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIAnalysis({ expenses, incomes }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleAnalyzeWithLang = async (lang = language) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses, incomes, language: lang }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    handleAnalyzeWithLang(newLang);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 dark:from-emerald-900/20 dark:to-cyan-900/20 shadow-sm border border-emerald-900/10 dark:border-emerald-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg shrink-0">
            <Sparkles className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Financial Advisor</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full sm:w-auto">
              <Button
                onClick={toggleLanguage}
                variant="outline"
                className="w-full sm:w-auto text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border-gray-200 dark:border-white/10"
                disabled={loading}
              >
                <Languages className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{language === 'en' ? 'Toggle to Hindi' : 'Toggle to English'}</span>
              </Button>
            </motion.div>
          )}
          <div className="w-full sm:w-auto">
            <Button  
              onClick={() => handleAnalyzeWithLang(language)} 
              loading={loading}
              variant="primary"
              className="w-full sm:w-auto shadow-emerald-500/20"
            >
              {analysis ? (
                <>
                  <RefreshCw className={`w-4 h-4 shrink-0 ${loading ? 'animate-spin' : ''}`} />
                  <span className="truncate">Refresh Analysis</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="truncate">Analyze My Spending</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 text-sm text-center relative z-10"
          >
            <p>{error}</p>
          </motion.div>
        ) : analysis ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="prose dark:prose-invert max-w-none"
          >
            <div className="bg-white/80 dark:bg-black/30 backdrop-blur-md rounded-xl p-6 shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-300 leading-relaxed font-light">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400 border-collapse my-4" {...props} />,
                  thead: ({node, ...props}) => <thead className="bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white uppercase text-xs" {...props} />,
                  tr: ({node, ...props}) => <tr className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" {...props} />,
                  th: ({node, ...props}) => <th className="px-6 py-3 font-medium text-emerald-600 dark:text-emerald-400" {...props} />,
                  td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 flex items-center" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-emerald-600 dark:text-emerald-400" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-4" {...props} />,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-gray-500 relative z-10"
          >
            <p>Get personalized insights, wasteful pattern detection, and budget advice powered by Gemini AI.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
    </div>
  );
}
