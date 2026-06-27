"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Eye, Search, X } from 'lucide-react';

export type SignupRow = {
  id: string;
  full_name: string | null;
  email: string;
  whatsapp: string | null;
  institution: string | null;
  grade: string | null;
  city: string | null;
  motivation: string | null;
  problem: string | null;
  created_at: string;
};

type SortKey = 'full_name' | 'email' | 'institution' | 'city' | 'created_at';
type SortDir = 'asc' | 'desc';

const columns: { key: SortKey | null; label: string; field: keyof SignupRow; wide?: boolean }[] = [
  { key: 'full_name', label: 'NAME', field: 'full_name' },
  { key: 'email', label: 'EMAIL', field: 'email' },
  { key: null, label: 'WHATSAPP', field: 'whatsapp' },
  { key: 'institution', label: 'SCHOOL / COLLEGE', field: 'institution' },
  { key: null, label: 'GRADE', field: 'grade' },
  { key: 'city', label: 'CITY', field: 'city' },
  { key: 'created_at', label: 'SIGNED UP', field: 'created_at' },
];

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const s = String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function downloadCsv(rows: SignupRow[]) {
  const header = [
    'full_name',
    'email',
    'whatsapp',
    'institution',
    'grade',
    'city',
    'motivation',
    'problem',
    'created_at',
  ];
  const lines = [header.map(csvEscape).join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.full_name,
        r.email,
        r.whatsapp,
        r.institution,
        r.grade,
        r.city,
        r.motivation,
        r.problem,
        r.created_at,
      ]
        .map(csvEscape)
        .join(',')
    );
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.href = url;
  a.download = `nyfs-signups-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SignupsTable({ rows }: { rows: SignupRow[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SignupRow | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: 'created_at',
    dir: 'desc',
  });

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? rows.filter(
          (r) =>
            (r.full_name ?? '').toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q)
        )
      : rows;

    const sorted = [...base].sort((a, b) => {
      const av = (a[sort.key] ?? '') as string;
      const bv = (b[sort.key] ?? '') as string;
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [rows, query, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-acc-dark/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH NAME OR EMAIL"
            className="w-full bg-bg border border-acc-gray pl-12 pr-4 py-3 font-mono text-xs tracking-widest uppercase text-text focus:border-brand outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black tracking-widest uppercase text-acc-dark">
            {query ? `${filtered.length} OF ${rows.length}` : `${rows.length} TOTAL`}
          </span>
          <button
            type="button"
            onClick={() => downloadCsv(filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-3 px-6 py-3 border-2 border-brand text-brand font-black text-[10px] tracking-widest uppercase hover:bg-brand hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-acc-gray bg-bg overflow-x-auto shadow-xl shadow-acc-dark/10">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 bg-acc-gray/40 backdrop-blur z-10">
            <tr>
              {columns.map((col) => {
                const isActive = col.key && sort.key === col.key;
                return (
                  <th
                    key={col.field}
                    className={`px-4 py-4 text-[10px] font-black tracking-widest uppercase text-acc-dark border-b border-acc-gray whitespace-nowrap ${
                      col.key ? 'cursor-pointer hover:text-brand transition-colors' : ''
                    }`}
                    onClick={() => col.key && toggleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-2">
                      {col.label}
                      {isActive && sort.dir === 'asc' && <ArrowUp className="w-3 h-3" />}
                      {isActive && sort.dir === 'desc' && <ArrowDown className="w-3 h-3" />}
                    </span>
                  </th>
                );
              })}
              <th className="px-4 py-4 text-[10px] font-black tracking-widest uppercase text-acc-dark border-b border-acc-gray whitespace-nowrap text-right">
                DETAILS
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-16 text-center text-xs font-black tracking-widest uppercase text-acc-dark/60"
                >
                  NO SIGNUPS FOUND
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="odd:bg-acc-gray/10 hover:bg-brand/5 transition-colors">
                  {columns.map((col) => {
                    const raw = row[col.field];
                    const display =
                      col.field === 'created_at' && typeof raw === 'string'
                        ? formatDate(raw)
                        : raw ?? '—';
                    return (
                      <td
                        key={col.field}
                        className="px-4 py-4 text-xs font-mono text-text border-b border-acc-gray/60 align-top whitespace-nowrap"
                      >
                        {display as string}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 border-b border-acc-gray/60 align-top text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelected(row)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-brand text-brand font-black text-[10px] tracking-widest uppercase hover:bg-brand hover:text-white transition-all"
                    >
                      <Eye className="w-3 h-3" /> VIEW
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && <DetailsModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailField({ label, value, full = false }: { label: string; value: string | null; full?: boolean }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <span className="text-[10px] font-black tracking-widest uppercase text-acc-dark block mb-1">
        {label}
      </span>
      <p className="text-sm font-mono text-text whitespace-pre-wrap break-words">{value || '—'}</p>
    </div>
  );
}

function DetailsModal({ row, onClose }: { row: SignupRow; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-bg border border-acc-gray shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between gap-4 p-8 border-b border-acc-gray bg-bg">
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand block mb-2">
              REGISTRATION DETAILS
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-text">
              {row.full_name || '—'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-2 text-acc-dark hover:text-brand transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailField label="Full Name" value={row.full_name} />
          <DetailField label="Email" value={row.email} />
          <DetailField label="WhatsApp" value={row.whatsapp} />
          <DetailField label="City" value={row.city} />
          <DetailField label="School / College" value={row.institution} />
          <DetailField label="Grade / Year" value={row.grade} />
          <DetailField label="Signed Up" value={formatDate(row.created_at)} />
          <div className="hidden md:block" />
          <DetailField label="Motivation" value={row.motivation} full />
          <DetailField label="Problem to Solve" value={row.problem} full />
        </div>
      </div>
    </div>
  );
}
