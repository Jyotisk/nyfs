"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Users } from 'lucide-react';

const tabs = [
  { href: '/admin', label: 'SIGNUPS', icon: Users },
  { href: '/admin/announcements', label: 'ANNOUNCEMENTS', icon: Bell },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 border border-acc-gray bg-acc-gray/20 p-2 rounded-sm mb-12 overflow-hidden">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative p-5 transition-all duration-300 flex items-center justify-center gap-3 border border-transparent ${
              active
                ? 'bg-bg border-acc-gray shadow-xl shadow-acc-dark/10'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'text-brand' : 'text-acc-dark'}`} />
            <span
              className={`text-[11px] font-black tracking-widest uppercase ${
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
