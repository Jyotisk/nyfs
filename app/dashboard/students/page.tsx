"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import DashShell from '../DashShell';
import SignupsTable, { type SignupRow } from '@/app/admin/SignupsTable';

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; rows: SignupRow[]; adminEmail: string }
  | { kind: 'forbidden' }
  | { kind: 'error'; message: string };

export default function StudentsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (meRes.status === 401) {
        router.replace('/login?next=/dashboard/students');
        return;
      }
      const { user: me } = await meRes.json();
      if (!me) {
        router.replace('/login?next=/dashboard/students');
        return;
      }

      try {
        const res = await fetch('/api/admin/signups', { cache: 'no-store' });
        if (cancelled) return;

        if (res.status === 401) {
          router.replace('/login?next=/dashboard/students');
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
        setStatus({ kind: 'ready', rows: body.rows, adminEmail: me.email ?? '' });
      } catch (err: unknown) {
        if (cancelled) return;
        setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const adminEmail = status.kind === 'ready' ? status.adminEmail : undefined;

  return (
    <DashShell adminEmail={adminEmail}>
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-6 h-6 text-brand" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand">
            ADMIN DASHBOARD
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-[8vw] font-black uppercase leading-[0.8] tracking-tighter text-text">
          STUDENTS.
        </h1>
      </div>

      {status.kind === 'loading' && (
        <div className="py-40 text-center">
          <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent animate-spin mb-6" />
          <p className="text-xs font-black tracking-widest uppercase text-acc-dark">
            LOADING REGISTRATIONS...
          </p>
        </div>
      )}

      {status.kind === 'forbidden' && (
        <div className="py-40 text-center max-w-xl mx-auto">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-text mb-6">NOT AUTHORIZED.</h2>
          <p className="text-xs font-black tracking-widest uppercase text-acc-dark">
            YOUR ACCOUNT IS NOT ON THE ADMIN ALLOWLIST.
          </p>
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
    </DashShell>
  );
}
