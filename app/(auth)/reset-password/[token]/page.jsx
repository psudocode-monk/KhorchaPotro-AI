'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage({ params }) {
  // Unwrapping params Promise as required by Next.js 15+ dynamic routes
  const unwrappedParams = use(params);
  const token = unwrappedParams.token;
  
  const router = useRouter();
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (passwords.newPassword.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            token, // Comes from the URL parameter
            newPassword: passwords.newPassword 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. The link may have expired.');
      }

      setStatus('success');
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
          router.push('/login');
      }, 3000);

    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-xl transition-all duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Password</h2>
        </div>

        {status === 'success' ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
            >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    Your password has been successfully reset. Redirecting you to the login page...
                </p>
                <Button onClick={() => router.push('/login')} className="w-full">
                    Go to Login Now
                </Button>
            </motion.div>
        ) : (
            <>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
                    Please enter your new password below. Make sure it's at least 6 characters long.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="New Password"
                        type={showPassword.new ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        required
                        rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                            className="text-gray-400 hover:text-white focus:outline-none transition-colors"
                        >
                            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        }
                    />

                    <Input
                        label="Confirm New Password"
                        type={showPassword.confirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        required
                        rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                            className="text-gray-400 hover:text-white focus:outline-none transition-colors"
                        >
                            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        }
                    />

                    {status === 'error' && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                            {errorMsg}
                        </div>
                    )}

                    <Button type="submit" loading={status === 'loading'} className="w-full">
                        Reset Password
                    </Button>
                </form>
            </>
        )}
      </motion.div>
    </div>
  );
}
