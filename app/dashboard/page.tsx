"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  User, 
  MapPin, 
  School, 
  Phone, 
  Target, 
  Zap, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Profile {
  full_name: string;
  whatsapp: string;
  institution: string;
  grade: string;
  city: string;
  motivation: string;
  problem: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'URGENT' | 'UPDATE' | 'EVENT';
  created_at: string;
}

function formatAnnouncementDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (meRes.status === 401) {
        router.push('/login');
        return;
      }
      const { user: me } = await meRes.json();
      if (!me) {
        router.push('/login');
        return;
      }

      setUser({ id: me.id, email: me.email });
      setProfile({
        full_name: me.fullName ?? 'Incomplete Profile',
        whatsapp: me.whatsapp ?? 'N/A',
        institution: me.institution ?? 'N/A',
        grade: me.grade ?? 'N/A',
        city: me.city ?? 'N/A',
        motivation: me.motivation ?? 'N/A',
        problem: me.problem ?? 'N/A',
      });

      const annRes = await fetch('/api/announcements', { cache: 'no-store' });
      if (annRes.ok) {
        const { rows } = await annRes.json();
        setAnnouncements((rows as Announcement[]) ?? []);
      }

      setIsLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent animate-spin rounded-full" />
          <span className="text-xs font-black tracking-widest text-brand animate-pulse uppercase">INITIALIZING_SESSION...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-white pb-20">
      {/* Background Kinetic Layer - Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="noise" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 bg-bg/80 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <span className="font-satoshi font-black italic text-brand tracking-tighter text-3xl select-none group-hover:scale-105 transition-transform">
            NYFS
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 px-4 py-2 bg-acc-gray/20 border border-acc-gray rounded-sm">
            <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-acc-dark uppercase">SYSTEM_ONLINE</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono font-black text-xs tracking-widest uppercase text-acc-dark hover:text-brand transition-colors"
          >
            LOGOUT <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-40 px-6 md:px-10 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Profile Information */}
          <div className="lg:col-span-8 space-y-10">
            <header className="mb-14">
              <span className="text-acc-dark font-black text-xs tracking-[0.5em] uppercase mb-4 block underline decoration-brand underline-offset-8">FOUNDER_DASHBOARD</span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                WELCOME,<br />
                <span className="text-orange">{profile?.full_name?.split(' ')[0]}.</span>
              </h1>
            </header>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileItem icon={<Mail className="w-5 h-5" />} label="EMAIL" value={user?.email} />
              <ProfileItem icon={<Phone className="w-5 h-5" />} label="WHATSAPP" value={profile?.whatsapp} />
              <ProfileItem icon={<School className="w-5 h-5" />} label="INSTITUTION" value={profile?.institution} />
              <ProfileItem icon={<Target className="w-5 h-5" />} label="GRADE / YEAR" value={profile?.grade} />
              <ProfileItem icon={<MapPin className="w-5 h-5" />} label="CITY" value={profile?.city} />
              <ProfileItem icon={<ShieldCheck className="w-5 h-5" />} label="STATUS" value="VERIFIED_PARTICIPANT" highlight />
            </div>

            {/* In-depth Sections */}
            <div className="space-y-6 mt-10">
              <div className="p-8 border border-acc-gray bg-acc-gray/10 group hover:border-brand transition-colors">
                <span className="text-[10px] font-black text-brand tracking-widest block mb-4 uppercase">// MOTIVATION</span>
                <p className="text-sm font-bold text-acc-dark leading-relaxed italic">
                  &quot;{profile?.motivation}&quot;
                </p>
              </div>

              <div className="p-8 border border-acc-gray bg-acc-gray/10 group hover:border-brand transition-colors">
                <span className="text-[10px] font-black text-brand tracking-widest block mb-4 uppercase">// PROBLEM_TO_SOLVE</span>
                <p className="text-sm font-bold text-acc-dark leading-relaxed">
                  {profile?.problem}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Announcements & Quick stats */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Notifications Section */}
            <section className="bg-acc-gray/20 border-l-4 border-orange p-8 shadow-2xl shadow-acc-dark/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black tracking-tighter flex items-center gap-3 uppercase">
                  <Bell className="w-5 h-5 text-orange" /> ANNOUNCEMENTS
                </h3>
                <span className="text-[10px] font-black text-orange bg-orange/10 px-2 py-1 rounded-sm">
                  {String(announcements.length).padStart(2, '0')} TOTAL
                </span>
              </div>

              {announcements.length === 0 ? (
                <p className="text-[10px] text-acc-dark/60 font-bold tracking-widest uppercase py-8 text-center">
                  NO ANNOUNCEMENTS YET
                </p>
              ) : (
                <div className="space-y-6">
                  {announcements.map((item) => (
                    <div key={item.id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 border ${item.type === 'URGENT' ? 'border-orange text-orange' : item.type === 'EVENT' ? 'border-brand text-brand' : 'border-acc-dark text-acc-dark'} tracking-widest`}>
                          {item.type}
                        </span>
                        <span className="text-[8px] font-black text-acc-gray tracking-widest">
                          {formatAnnouncementDate(item.created_at)}
                        </span>
                      </div>
                      <h4 className="text-xs font-black group-hover:text-brand transition-colors tracking-widest uppercase mb-2">{item.title}</h4>
                      <p className="text-[10px] text-acc-dark leading-relaxed font-bold opacity-70 whitespace-pre-wrap">
                        {item.content}
                      </p>
                      <div className="mt-4 h-[1px] bg-acc-gray/30 w-full group-last:hidden" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section className="space-y-4">
              <QuickAction icon={<MessageSquare className="w-5 h-5" />} title="JOIN_DISCORD" subtitle="Network with other founders" />
              <QuickAction icon={<Calendar className="w-5 h-5" />} title="EVENT_SCHEDULE" subtitle="Check bootcamp sessions" />
              <QuickAction icon={<Zap className="w-5 h-5" />} title="MY_TEAM" subtitle="Assigned on Day 1" locked />
            </section>

          </div>
        </div>
      </main>

      {/* Sideways Text */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 font-mono font-black text-[8px] text-zinc-200 vertical-text hidden lg:block tracking-[1em] opacity-50 uppercase">
        FOUNDER_ID: {user?.id?.slice(0, 8)} // NYFS_SYS
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value, highlight = false }: { icon: any, label: string, value: string | undefined, highlight?: boolean }) {
  return (
    <div className={`p-6 border ${highlight ? 'border-brand bg-brand/5' : 'border-acc-gray'} flex items-start gap-4 group transition-all hover:translate-x-1`}>
      <div className={`${highlight ? 'text-brand' : 'text-acc-dark group-hover:text-brand'} transition-colors mt-1`}>
        {icon}
      </div>
      <div>
        <span className="text-[10px] font-black text-acc-gray tracking-widest block mb-1 uppercase">{label}</span>
        <span className={`text-sm font-black ${highlight ? 'text-brand' : 'text-text'} break-all`}>{value || 'N/A'}</span>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, subtitle, locked = false }: { icon: any, title: string, subtitle: string, locked?: boolean }) {
  return (
    <div className={`p-6 border ${locked ? 'border-acc-gray opacity-50 grayscale' : 'border-acc-gray hover:border-brand cursor-pointer'} bg-bg group transition-all flex items-center justify-between`}>
      <div className="flex items-center gap-4">
        <div className="text-acc-dark group-hover:text-brand transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="text-[10px] font-black tracking-widest uppercase mb-1">{title}</h4>
          <p className="text-[8px] font-bold text-acc-dark uppercase opacity-70 tracking-widest">{subtitle}</p>
        </div>
      </div>
      {!locked && <ChevronRight className="w-4 h-4 text-acc-gray group-hover:text-brand group-hover:translate-x-1 transition-all" />}
      {locked && <Zap className="w-3 h-3 text-acc-dark" />}
    </div>
  );
}

function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
