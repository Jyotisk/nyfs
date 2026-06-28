"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users } from 'lucide-react';

const tabs = [
  { href: '/admin', label: 'SIGNUPS', icon: Users },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 border border-acc-gray bg-acc-gray/20 p-2 rounded-sm mb-12 overflow-hidden">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative p-3 md:p-5 transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 border border-transparent text-center ${
              active
                ? 'bg-bg border-acc-gray shadow-xl shadow-acc-dark/10'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand' : 'text-acc-dark'}`} />
            <span
              className={`text-[9px] sm:text-[11px] font-black tracking-wider sm:tracking-widest uppercase leading-tight ${
                active ? 'text-text' : 'text-acc-dark'
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
