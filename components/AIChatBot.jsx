"use client";

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNotificationSound } from '@/lib/useNotificationSound';

export default function AIChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const playNotificationSound = useNotificationSound();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am your IntelliSpend assistant. How can I help you with your finances today?'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const isExcludedPage = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/forgot-password' || 
    pathname.startsWith('/reset-password/') || 
    pathname.startsWith('/stocks');

  // Periodic tooltip logic (every 20 seconds)
  useEffect(() => {
    if (isExcludedPage) return;

    const tooltipInterval = setInterval(() => {
      if (!isOpen) {
        setShowTooltip(true);
        playNotificationSound();
        // Hide after 6 seconds so user has time to read it
        setTimeout(() => setShowTooltip(false), 6000); 
      }
    }, 20000);

    return () => clearInterval(tooltipInterval);
  }, [isOpen, playNotificationSound, pathname, isExcludedPage]);

  // Hide the chatbot entirely on excluded pages
  if (isExcludedPage) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        // We ensure we send all previous messages plus the new one
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user', // Match Gemini roles if needed
            content: msg.content
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.text },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className="flex flex-col items-end space-y-4">
        <AnimatePresence>
          {/* Chat Window */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-emerald-500/20 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col"
              // Prevent dragging when clicking inside the chat window
              onPointerDownCapture={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gray-50/80 dark:bg-gray-800/80 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">IntelliSpend</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 opacity-70">
                        {message.role === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                        <span className="text-[10px] uppercase font-semibold">
                          {message.role === 'user' ? 'You' : 'AI'}
                        </span>
                      </div>
                      <div className={`prose prose-sm ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none text-sm leading-relaxed`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl p-4 rounded-tl-sm flex items-center gap-2 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-end gap-2"
                >
                  <div className="relative flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Ask about your finances..."
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-12 max-h-32 min-h-12 scrollbar-none"
                      rows={1}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center h-12 w-12"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 ml-1" />
                    )}
                  </button>
                </form>
                <div className="text-[10px] text-center text-gray-500 mt-2">
                  AI can make mistakes. Please verify important financial information.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Tooltip & Toggle Button Container */}
        <div className="flex items-center gap-4 relative">
          <AnimatePresence>
            {!isOpen && showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-100 text-sm py-2 px-4 rounded-xl border border-gray-200 dark:border-emerald-500/30 shadow-lg whitespace-nowrap hidden sm:block pointer-events-none"
              >
                Need help with your expenses?
                {/* Little triangle arrow pointing right */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-t border-r border-gray-200 dark:border-emerald-500/30 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Draggable Icon */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setShowTooltip(false);
              }}
              className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors relative group ${
                isOpen 
                  ? 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700' 
                  : 'bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500'
              }`}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <MessageSquare className="w-6 h-6" />
                    {/* Notification dot */}
                    {showTooltip && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
