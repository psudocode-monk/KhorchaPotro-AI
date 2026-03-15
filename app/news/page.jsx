'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Clock, ChevronRight, Loader2 } from 'lucide-react';
import DashboardBackground from '@/components/ui/DashboardBackground';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Could not load live news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      <DashboardBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-2xl mb-4">
            <Newspaper className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 mb-4 tracking-tight">
            Financial News
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Stay informed with the latest market updates, economic analysis, and global financial events.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Curating latest news...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-500/5 border border-red-500/20 rounded-3xl">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {news.map((item, index) => {
              const hasImage = !!item.image;
              
              return (
                <motion.a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group flex ${hasImage ? 'flex-col' : 'flex-col md:flex-row col-span-1 md:col-span-2 lg:col-span-3'} bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-cyan-500/30 transition-all duration-300`}
                >
                  {hasImage && (
                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex flex-col flex-1 p-6 relative ${!hasImage ? 'justify-center' : ''}`}>
                    {!hasImage && (
                      <div className="absolute top-6 right-6">
                        <span className="px-3 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                          {item.category}
                        </span>
                      </div>
                    )}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">{item.source}</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.time}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                    {item.summary}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-auto flex justify-between items-center group-hover:border-cyan-500/20 transition-colors">
                    <span className="text-sm font-medium text-gray-900 dark:text-white inline-flex items-center">
                      Read full story
                      <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500" />
                    </span>
                    <button className="p-2 text-cyan-500/70 group-hover:text-cyan-500 transition-colors bg-cyan-50/50 dark:bg-cyan-500/10 rounded-full">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.a>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
