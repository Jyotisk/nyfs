"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, Mail, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState('/');
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    // Accept only same-origin absolute paths. Reject protocol-relative (//evil.com)
    // and anything starting with `/\` which some routers treat similarly.
    if (next && /^\/[^/\\]/.test(next)) setRedirectTo(next);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      router.push(redirectTo === '/' ? '/dashboard' : redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal pb-20">
      {/* Background Kinetic Layer - Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="noise" />
      </div>

      <main className="min-h-screen flex items-center justify-center px-10 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand transition-colors group mb-8">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-[10px] tracking-widest uppercase">BACK TO HQ</span>
            </Link>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-text">
              LOGIN.
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-bg border-4 border-text p-10 shadow-[16px_16px_0_0_var(--menthe)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldCheck className="w-12 h-12 text-brand" />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-black tracking-widest uppercase">
                ERROR: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-2 block">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="example@network.net" 
                    className="w-full bg-white/50 backdrop-blur-sm border-2 border-text pl-14 pr-6 py-4 font-mono text-text focus:border-brand outline-none transition-colors" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-2 block">SECURE PASSWORD</label>
                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-white/50 backdrop-blur-sm border-2 border-text pl-14 pr-6 py-4 font-mono text-text focus:border-brand outline-none transition-colors" 
                    required 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" className="text-[10px] font-black tracking-widest uppercase text-zinc-400 hover:text-brand transition-colors">
                  FORGOT PASSWORD?
                </button>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-6 bg-brand text-bg border-4 border-text font-black text-xs tracking-widest uppercase hover:bg-text hover:text-bg transition-all shadow-[8px_8px_0_0_var(--verveine)] flex items-center justify-center gap-4 group disabled:opacity-50">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    AUTHENTICATE
                    <Zap className="w-4 h-4 group-hover:fill-white transition-all" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-zinc-200 text-center">
              <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase block mb-4">NEW TO THE NETWORK?</span>
              <Link href="/register" className="text-xs font-black text-zinc-950 hover:text-brand transition-colors uppercase tracking-widest">
                CREATE AN ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Sideways Text */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 font-mono font-black text-[8px] text-text/20 vertical-text hidden lg:block tracking-[1em] uppercase">
        SECURE_AUTH_GATEWAY // NYFS_SYS
      </div>
    </div>
  );
}
