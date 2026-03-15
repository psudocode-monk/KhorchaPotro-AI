'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ui/ThemeToggle';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">
              KhorchaPotro AI
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
                {/* <Link href="/stocks" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Check Live Stock
                </Link> */}
                <Link href="/news" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Finance News
                </Link>
                
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all overflow-hidden"
                  >
                    <User size={20} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-64 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="flex items-center space-x-3 p-2 mb-4 border-b border-gray-100 dark:border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                              <User size={20} />
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{session.user.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</span>
                            </div>
                          </div>

                            <div className="space-y-1">
                              {/* Profile Link */}
                              <Link 
                                href="/profile"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                              >
                                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-500 transition-colors">
                                  <User size={18} />
                                </div>
                                <span className="text-sm font-medium">My Profile</span>
                              </Link>

                              {/* Theme Toggle - Correctly Aligned */}
                              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => {}}>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                    <ThemeToggle />
                                  </div>
                                  <span className="text-sm font-medium">Change Theme</span>
                                </div>
                              </div>

                              {/* Logout */}
                              <button
                                onClick={() => signOut()}
                                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors group mt-1 border-t border-gray-100 dark:border-white/5 pt-3"
                              >
                                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                  <LogOut size={18} />
                                </div>
                                <span className="text-sm font-medium">Logout Account</span>
                              </button>
                            </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link href="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {!session && <ThemeToggle />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-500/5 rounded-2xl mb-2">
                    <User className="text-emerald-500" size={24} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{session.user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{session.user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-emerald-500/10 rounded-xl"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-emerald-500/10 rounded-xl"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/stocks"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-emerald-500/10 rounded-xl"
                  >
                    Check Live Stock
                  </Link>
                  <Link
                    href="/news" as="/news"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-emerald-500/10 rounded-xl"
                  >
                    Finance News
                  </Link>
                  <div className="px-3 py-2 border-t border-gray-100 dark:border-white/10 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-xl font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-gray-600 dark:text-gray-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
