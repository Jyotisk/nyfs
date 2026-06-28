"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, CalendarClock, MapPin, Users } from 'lucide-react';
import DashShell from './DashShell';

type Stats = {
  totalStudents: number;
  last7Days: number;
  uniqueCities: number;
  uniqueInstitutions: number;
  totalAnnouncements: number;
  recent: {
    id: string;
    full_name: string | null;
    email: string;
    city: string | null;
    created_at: string;
  }[];
};

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; stats: Stats; adminEmail: string }
  | { kind: 'forbidden' }
  | { kind: 'error'; message: string };

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (meRes.status === 401) {
        router.replace('/login?next=/dashboard');
        return;
      }
      const { user: me } = await meRes.json();
      if (!me) {
        router.replace('/login?next=/dashboard');
        return;
      }

      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (cancelled) return;

        if (res.status === 401) {
          router.replace('/login?next=/dashboard');
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

        const stats: Stats = await res.json();
        setStatus({ kind: 'ready', stats, adminEmail: me.email ?? '' });
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
          OVERVIEW.
        </h1>
      </div>

      {status.kind === 'loading' && (
        <div className="py-40 text-center">
          <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent animate-spin mb-6" />
          <p className="text-xs font-black tracking-widest uppercase text-acc-dark">LOADING...</p>
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

      {status.kind === 'ready' && (
        <div className="space-y-12">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users className="w-5 h-5" />} label="TOTAL STUDENTS" value={status.stats.totalStudents} highlight />
            <StatCard icon={<CalendarClock className="w-5 h-5" />} label="LAST 7 DAYS" value={status.stats.last7Days} />
            <StatCard icon={<MapPin className="w-5 h-5" />} label="CITIES" value={status.stats.uniqueCities} />
            <StatCard icon={<Building2 className="w-5 h-5" />} label="INSTITUTIONS" value={status.stats.uniqueInstitutions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent registrations */}
            <section className="lg:col-span-2 border border-acc-gray bg-bg p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black tracking-widest uppercase flex items-center gap-3">
                  <Users className="w-4 h-4 text-brand" /> RECENT REGISTRATIONS
                </h2>
                <Link
                  href="/dashboard/students"
                  className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-brand hover:gap-3 transition-all"
                >
                  VIEW ALL <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {status.stats.recent.length === 0 ? (
                <p className="text-[10px] font-black tracking-widest uppercase text-acc-dark/60 py-10 text-center">
                  NO REGISTRATIONS YET
                </p>
              ) : (
                <div className="divide-y divide-acc-gray/40">
                  {status.stats.recent.map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-4 gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-widest text-text truncate">
                          {r.full_name ?? '—'}
                        </p>
                        <p className="text-[10px] font-mono text-acc-dark truncate">{r.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-black tracking-widest uppercase text-acc-dark">
                          {r.city ?? '—'}
                        </p>
                        <p className="text-[9px] font-mono text-acc-dark/60">{formatDate(r.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick actions */}
            <section className="space-y-6">
              <Link
                href="/dashboard/students"
                className="block border border-acc-gray bg-bg p-6 hover:border-brand transition-colors group"
              >
                <Users className="w-6 h-6 text-brand mb-4" />
                <h3 className="text-xs font-black tracking-widest uppercase mb-1 group-hover:text-brand transition-colors">
                  ALL STUDENTS
                </h3>
                <p className="text-[10px] font-bold text-acc-dark uppercase tracking-widest">
                  Browse, search &amp; export the full list
                </p>
              </Link>
            </section>
          </div>
        </div>
      )}
    </DashShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`p-6 border ${highlight ? 'border-brand bg-brand/5' : 'border-acc-gray bg-bg'} transition-all hover:-translate-y-1`}>
      <div className={`${highlight ? 'text-brand' : 'text-acc-dark'} mb-4`}>{icon}</div>
      <div className="text-4xl md:text-5xl font-black tracking-tighter text-text mb-1">{value}</div>
      <div className="text-[10px] font-black tracking-widest uppercase text-acc-dark">{label}</div>
    </div>
  );
}
