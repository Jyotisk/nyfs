"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import DashNav from './DashNav';

export default function DashShell({
  adminEmail,
  children,
}: {
  adminEmail?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login?next=/dashboard');
  };

  return (
    <div className="admin-theme min-h-screen text-text font-mono selection:bg-brand selection:text-white pb-20">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="noise" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-bg/80 backdrop-blur-xl border-b border-acc-gray">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-16 md:h-20 w-auto select-none group-hover:scale-105 transition-transform" />
        </Link>

        <div className="flex items-center gap-8">
          {adminEmail && (
            <span className="hidden md:inline font-mono font-black text-[10px] tracking-widest uppercase text-acc-dark">
              {adminEmail}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono font-black text-xs tracking-widest uppercase text-acc-dark hover:text-brand transition-colors"
          >
            LOGOUT <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-32 md:pt-40 px-6 md:px-10 relative z-10 max-w-[1600px] mx-auto">
        <DashNav />
        {children}
      </main>
    </div>
  );
}
