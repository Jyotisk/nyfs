"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import SignupsTable, { type SignupRow } from './SignupsTable';
import AdminTabs from './AdminTabs';

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; rows: SignupRow[]; adminEmail: string }
  | { kind: 'forbidden' }
  | { kind: 'error'; message: string };

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (meRes.status === 401) {
        router.replace('/login?next=/admin');
        return;
      }
      const { user: me } = await meRes.json();
      if (!me) {
        router.replace('/login?next=/admin');
        return;
      }

      try {
        const res = await fetch('/api/admin/signups', { cache: 'no-store' });

        if (cancelled) return;

        if (res.status === 401) {
          router.replace('/login?next=/admin');
          return;
        }
        if (res.status === 403) {
          setStatus({ kind: 'forbidden' });
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setStatus({ kind: 'error', message: body.error ?? `HTTP ${res.status}` });
          return;
        }

        const body: { rows: SignupRow[] } = await res.json();
        setStatus({
          kind: 'ready',
          rows: body.rows,
          adminEmail: me.email ?? '',
        });
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        setStatus({ kind: 'error', message });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login?next=/admin');
  };

  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-white pb-20">
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-bg/80 backdrop-blur-xl border-b border-acc-gray">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-12 md:h-16 w-auto select-none group-hover:scale-105 transition-transform" />
        </Link>

        <div className="flex items-center gap-8">
          {status.kind === 'ready' && (
            <span className="hidden md:inline font-mono font-black text-[10px] tracking-widest uppercase text-acc-dark">
              {status.adminEmail}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="font-mono font-black text-xs tracking-[0.3em] uppercase text-acc-dark hover:text-brand transition-colors"
          >
            SIGN OUT
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-32 md:pt-40 px-6 md:px-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <ShieldCheck className="w-6 h-6 text-brand" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand">
              ADMIN CONSOLE
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter text-text">
            ADMIN.
          </h1>
        </div>

        <AdminTabs />

        {/* Content */}
        {status.kind === 'loading' && (
          <div className="py-40 text-center">
            <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent animate-spin mb-6" />
            <p className="text-xs font-black tracking-widest uppercase text-acc-dark">
              LOADING SIGNUPS...
            </p>
          </div>
        )}

        {status.kind === 'forbidden' && (
          <div className="py-40 text-center max-w-xl mx-auto">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-text mb-6">
              NOT AUTHORIZED.
            </h2>
            <p className="text-xs font-black tracking-widest uppercase text-acc-dark mb-10">
              YOUR ACCOUNT IS NOT ON THE ADMIN ALLOWLIST.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-4 py-4 px-6 md:px-10 bg-text text-bg font-black text-xs tracking-widest uppercase hover:bg-brand transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> RETURN TO HQ
            </Link>
          </div>
        )}

        {status.kind === 'error' && (
          <div className="py-20 max-w-2xl mx-auto">
            <div className="p-6 bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-black tracking-widest uppercase">
              ERROR: {status.message}
            </div>
          </div>
        )}

        {status.kind === 'ready' && <SignupsTable rows={status.rows} />}
      </main>
    </div>
  );
}
