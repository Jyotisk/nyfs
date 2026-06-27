"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LayoutDashboard, Users } from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'OVERVIEW', icon: LayoutDashboard },
  { href: '/dashboard/students', label: 'STUDENTS', icon: Users },
  { href: '/admin/announcements', label: 'ANNOUNCEMENTS', icon: Bell },
];

export default function DashNav() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-3 border border-acc-gray bg-acc-gray/20 p-2 rounded-sm mb-12 overflow-hidden">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative p-3 md:p-5 transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 border border-transparent text-center ${
              active
                ? 'bg-bg border-acc-gray shadow-xl shadow-acc-dark/10'
                : 'opacity-40 hover:opacity-70'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand' : 'text-acc-dark'}`} />
            <span
              className={`text-[9px] md:text-[11px] font-black tracking-wider md:tracking-widest uppercase leading-tight ${
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
