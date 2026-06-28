"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import AdminTabs from '../AdminTabs';

type AnnouncementType = 'URGENT' | 'UPDATE' | 'EVENT';

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  created_at: string;
};

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; rows: AnnouncementRow[]; adminEmail: string }
  | { kind: 'forbidden' }
  | { kind: 'error'; message: string };

const TYPE_OPTIONS: AnnouncementType[] = ['UPDATE', 'URGENT', 'EVENT'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: 'loading' });
  const [form, setForm] = useState<{ title: string; content: string; type: AnnouncementType }>({
    title: '',
    content: '',
    type: 'UPDATE',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadRows = async (email: string) => {
    const res = await fetch('/api/admin/announcements', { cache: 'no-store' });
    if (res.status === 401) {
      router.replace('/login?next=/admin/announcements');
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
    const body: { rows: AnnouncementRow[] } = await res.json();
    setStatus({ kind: 'ready', rows: body.rows, adminEmail: email });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (meRes.status === 401) {
        router.replace('/login?next=/admin/announcements');
        return;
      }
      const { user: me } = await meRes.json();
      if (!me) {
        router.replace('/login?next=/admin/announcements');
        return;
      }
      if (cancelled) return;
      await loadRows(me.email ?? '');
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login?next=/admin/announcements');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.kind !== 'ready') return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const body: { row: AnnouncementRow } = await res.json();
      setStatus({ ...status, rows: [body.row, ...status.rows] });
      setForm({ title: '', content: '', type: 'UPDATE' });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (status.kind !== 'ready') return;
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(`Delete failed: ${body.error ?? res.status}`);
      return;
    }
    setStatus({ ...status, rows: status.rows.filter((r) => r.id !== id) });
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-bg/80 backdrop-blur-xl border-b border-acc-gray">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-16 md:h-20 w-auto select-none group-hover:scale-105 transition-transform" />
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

      <main className="pt-32 md:pt-40 px-6 md:px-10 relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-12">
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

        {status.kind === 'loading' && (
          <div className="py-40 text-center">
            <div className="inline-block w-8 h-8 border-2 border-brand border-t-transparent animate-spin mb-6" />
            <p className="text-xs font-black tracking-widest uppercase text-acc-dark">LOADING...</p>
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

        {status.kind === 'ready' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Create form */}
            <section className="lg:col-span-2 bg-bg border border-acc-gray p-8 shadow-xl shadow-acc-dark/10 h-fit sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <Plus className="w-5 h-5 text-brand" />
                <h2 className="text-sm font-black tracking-widest uppercase">NEW ANNOUNCEMENT</h2>
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-black tracking-widest uppercase">
                  ERROR: {submitError}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase text-acc-dark mb-2 block">
                    TITLE
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. BOOTCAMP DATES CONFIRMED"
                    maxLength={120}
                    className="w-full bg-bg border border-acc-gray px-4 py-3 font-mono text-xs tracking-widest uppercase text-text focus:border-brand outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase text-acc-dark mb-2 block">
                    CONTENT
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={5}
                    placeholder="Body of the announcement..."
                    className="w-full bg-bg border border-acc-gray px-4 py-3 font-mono text-xs text-text focus:border-brand outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase text-acc-dark mb-2 block">
                    TYPE
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPE_OPTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`py-3 border text-[10px] font-black tracking-widest uppercase transition-all ${
                          form.type === t
                            ? 'border-brand bg-brand text-white'
                            : 'border-acc-gray text-acc-dark hover:border-brand hover:text-brand'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 border-2 border-brand text-brand font-black text-[10px] tracking-widest uppercase hover:bg-brand hover:text-white transition-all disabled:opacity-40 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-brand border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Bell className="w-4 h-4" /> PUBLISH
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* List */}
            <section className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black tracking-widest uppercase">
                  PUBLISHED ({status.rows.length})
                </h2>
              </div>

              {status.rows.length === 0 ? (
                <div className="p-12 border border-acc-gray bg-acc-gray/10 text-center">
                  <p className="text-xs font-black tracking-widest uppercase text-acc-dark">
                    NO ANNOUNCEMENTS YET
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {status.rows.map((row) => (
                    <article
                      key={row.id}
                      className="p-6 border border-acc-gray bg-bg hover:border-brand transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[9px] font-black px-2 py-1 border tracking-widest ${
                              row.type === 'URGENT'
                                ? 'border-red-500 text-red-500'
                                : row.type === 'EVENT'
                                ? 'border-brand text-brand'
                                : 'border-acc-dark text-acc-dark'
                            }`}
                          >
                            {row.type}
                          </span>
                          <span className="text-[9px] font-black text-acc-dark/60 tracking-widest">
                            {formatDate(row.created_at)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="text-acc-dark/60 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="text-sm font-black tracking-widest uppercase text-text mb-3">
                        {row.title}
                      </h3>
                      <p className="text-xs font-mono text-acc-dark leading-relaxed whitespace-pre-wrap">
                        {row.content}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
