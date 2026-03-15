'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const [countdown, setCountdown] = useState(5);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check your email link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link might be invalid or expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    let timer;
    if (status === 'success' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (status === 'success' && countdown === 0) {
      // Attempt to close the window
      // Note: Scripts may not close windows that were not opened by script.
      // We'll try to close, and if that fails or the user ignores it, we'll redirect.
      try {
         window.close();
      } catch (e) {
         // silently ignore
      }
      
      // Fallback
      router.push('/login');
    }

    return () => clearTimeout(timer);
  }, [status, countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center inset-0 absolute bg-gray-50 dark:bg-black/90 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 text-center flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verifying...</h2>
              <p className="text-gray-500 dark:text-gray-400">{message}</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
              >
                <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Your email has been verified successfully.
              </p>
              
              <div className="bg-gray-100 dark:bg-black/50 rounded-xl p-4 w-full flex flex-col items-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  This page will close automatically in
                </p>
                <motion.div 
                  key={countdown}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-mono font-bold text-emerald-600 dark:text-emerald-400"
                >
                  {countdown}
                </motion.div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                Or <Link href="/login" className="text-emerald-500 hover:underline">click here</Link> to login manually.
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verification Failed</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{message}</p>
              <Link 
                href="/login"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black/90">
         <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
