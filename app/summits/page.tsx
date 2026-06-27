"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Zap, Bell } from 'lucide-react';
import Link from 'next/link';

const summits = [
  {
    title: "DAY 1: IDEA_GENESIS",
    date: "SAT, 14 MAR 2026",
    location: "GUWAHATI_CENTRE",
    desc: "You don’t need an idea to start. On Day 1, you’ll break down how startups actually work, spot real problems around you, turn them into ideas, test them, and find your team. By the end, you’ll have a solid idea you actually want to take forward.",
    image: "/startup_workshop_nyfs_1776185402143.png",
    code: "EVNT_DAY_01",
    details: {
       highlights: ["Problem Scouting", "Team Formation", "Idea Validation"],
       sessions: ["09:00 - The Blueprint", "13:00 - Networking Lunch", "15:00 - Ideation Sprints"]
    }
  },
  {
    title: "DAY 2: MVP_BUILD",
    date: "SUN, 15 MAR 2026",
    location: "GUWAHATI_CENTRE",
    desc: "Day 2 is where ideas meet reality. You’ll test your idea with users, create a working MVP using no-code tools, and refine it through feedback. You’ll also learn how to turn your work into a compelling pitch and build a deck that actually wins over judges and investors.",
    image: "/entrepreneurship_expo_nyfs_1776185434460.png",
    code: "EVNT_DAY_02",
    details: {
       highlights: ["MVP Engineering", "User Feedback Loop", "Pitch Architecture"],
       sessions: ["10:00 - No-Code Lab", "14:00 - Feedback Sprints", "17:00 - Deck Workshop"]
    }
  },
  {
    title: "DAY 3: THE_PITCH",
    date: "MON, 16 MAR 2026",
    location: "GUWAHATI_CENTRE",
    desc: "Day 3 is D-DAY. You’ll refine your pitch, demo your MVP, and face a panel of founders and operators in a high-pressure, Shark Tank-style final round. This is where you prove what you’ve built.",
    image: "/founder_workspace_render_1776181552224.png",
    code: "EVNT_DAY_03",
    details: {
       highlights: ["Shark Tank Round", "Live MVP Demos", "Investor Feedback"],
       sessions: ["10:00 - Final Polishing", "14:00 - The Big Pitch", "18:00 - Awards Ceremony"]
    }
  }
];

export default function SummitsPage() {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [countdown, setCountdown] = React.useState("");

  React.useEffect(() => {
    const target = new Date("March 14, 2026 09:00:00").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}D:${hours}H:${minutes}M:${seconds}S`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text font-general selection:bg-brand selection:text-dark-teal pb-40 transition-colors duration-500">
      {/* Background Kinetic Layer - Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="noise" />
      </div>

      {/* Navigation: LONG HORIZONTAL NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 bg-bg/80 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        {/* Brand: Left side */}
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <span className="font-general font-black italic text-brand tracking-tighter text-3xl select-none group-hover:scale-105 transition-transform">
            NYFS
          </span>
        </Link>

        {/* Actions: Right side */}
        <div className="flex items-center gap-12">
           <Link href="/login" className="font-general font-black text-xs tracking-[0.3em] uppercase text-acc-dark hover:text-brand transition-colors">
             LOGIN
           </Link>

           <Link href="/register" className="px-10 py-3 border-2 border-brand text-brand font-general font-black text-xs tracking-widest uppercase hover:bg-brand hover:text-white transition-all rounded-sm shadow-xl shadow-brand/10 active:scale-95 inline-flex items-center justify-center">
             REGISTER
           </Link>
        </div>
      </nav>

      {/* Header Section */}
      <header className="pt-40 px-10 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <span className="text-acc-dark font-bold text-xs tracking-[0.5em] uppercase mb-6 block border-l-2 border-brand pl-4">UPCOMING SCHEDULE</span>
              <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter text-text">
                FLAGSHIP <br />
                <span className="outline-text-brand">SUMMITS.</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right hidden md:block">
                  <span className="text-[10px] text-acc-dark block font-black mb-1">NEXT WORKSHOP IN</span>
                  <span className="text-xl font-bold font-general tracking-tighter text-text border border-acc-gray px-4 py-2 bg-acc-gray/10">{countdown}</span>
               </div>
               <div className="w-px h-12 bg-acc-gray" />
               <Zap className="w-8 h-8 text-brand animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Grid: Events */}
      <main className="px-10 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {summits.map((summit, i) => (
            <motion.div 
              key={i}
              layout
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className={`group relative flex flex-col h-full bg-acc-gray/10 border border-acc-gray transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5 ${expandedIndex === i ? 'border-brand/50 ring-1 ring-brand/10' : 'hover:border-brand/30'}`}
            >
              {/* Image Container - FIXED HEIGHT FOR UNIFORMITY */}
              <div className="relative h-[400px] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={summit.image} alt={summit.title} className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-700" />
                <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Schematic Labels */}
                <div className="absolute top-4 left-4 font-black text-[10px] text-white bg-brand px-2 py-1 tracking-widest">
                  {summit.code}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[10px] text-acc-dark font-bold mb-4">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-brand" /> {summit.date}</div>
                  <div className="w-1 h-1 bg-acc-gray rounded-full" />
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand" /> {summit.location}</div>
                </div>

                <h3 className="text-2xl font-black uppercase mb-4 leading-tight tracking-tight text-text group-hover:text-brand transition-colors">
                  {summit.title}
                </h3>

                <p className="text-sm text-text leading-relaxed mb-6 italic opacity-90">
                  &quot;{summit.desc}&quot;
                </p>

                {/* EXPANDABLE SECTION */}
                {expandedIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden border-t border-acc-gray mt-6 pt-6 mb-8"
                  >
                    <div className="mb-6">
                       <span className="text-[10px] font-black text-brand tracking-widest uppercase mb-4 block underline">HIGHLIGHTS</span>
                       <ul className="space-y-2">
                          {summit.details.highlights.map((h, idx) => (
                             <li key={idx} className="text-xs text-acc-dark flex items-center gap-2">
                                <Zap className="w-2 h-2 text-brand fill-brand" /> {h}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-brand tracking-widest uppercase mb-4 block underline">SCHEDULE</span>
                       <ul className="space-y-4">
                          {summit.details.sessions.map((s, idx) => (
                             <li key={idx} className="border-l-2 border-acc-gray pl-4 py-1">
                                <span className="text-[10px] text-acc-dark block font-black">{s.split(' - ')[0]}</span>
                                <span className="text-xs font-bold text-text">{s.split(' - ')[1]}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                  </motion.div>
                )}

                <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className={`w-full py-4 font-black text-xs tracking-widest uppercase transition-all shadow-xl active:scale-[0.98] ${expandedIndex === i ? 'bg-text text-bg' : 'border-2 border-brand text-brand hover:bg-brand hover:text-white shadow-brand/10'}`}
                  >
                    {expandedIndex === i ? 'CLOSE' : 'MORE DETAILS'}
                  </button>
                  
                  {expandedIndex === i && (
                    <Link 
                      href="/register"
                      className="w-full py-4 border-2 border-brand text-brand font-black text-xs tracking-widest uppercase hover:bg-brand hover:text-white transition-all shadow-xl shadow-brand/10 flex items-center justify-center"
                    >
                      APPLY NOW
                    </Link>
                  )}
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-l-[30px] border-t-white border-l-transparent" />
            </motion.div>
          ))}
        </div>
      </main>

    </div>
  );
}
