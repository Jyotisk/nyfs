"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, Rocket, Globe, Zap, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

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
      sessions: ["09:00 - The Blueprint", "13:00 - Networking Lunch", "15:00 - Ideation Sprints"],
    },
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
      sessions: ["10:00 - No-Code Lab", "14:00 - Feedback Sprints", "17:00 - Deck Workshop"],
    },
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
      sessions: ["10:00 - Final Polishing", "14:00 - The Big Pitch", "18:00 - Awards Ceremony"],
    },
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const lineReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function Home() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");
  const quoteRef = useRef<HTMLDivElement>(null);

  // Smooth scrolling (scoped to this page; destroyed on unmount).
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Scroll-progress bar + parallax for the quote card.
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(quoteProgress, [0, 1], [60, -60]);

  useEffect(() => {
    const target = new Date("March 14, 2026 09:00:00").getTime();
    const timer = setInterval(() => {
      const distance = target - Date.now();
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${days}D:${hours}H:${minutes}M:${seconds}S`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500 overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-brand origin-left z-[60]"
      />

      {/* Animated ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-brand/20 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-1/3 -right-40 w-[34rem] h-[34rem] rounded-full bg-orange/15 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-bg/70 backdrop-blur-xl border-b border-acc-gray"
      >
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <span className="font-satoshi font-black italic text-brand tracking-tighter text-3xl select-none group-hover:scale-105 transition-transform">
            NYFS
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
          <Link href="/login" className="nav-link font-mono font-black text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-acc-dark hover:text-brand transition-colors">
            LOGIN
          </Link>
          <Link href="/register" className="px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 border-2 border-brand text-brand font-mono font-black text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase hover:bg-brand hover:text-white transition-all rounded-sm active:scale-95 inline-flex items-center gap-2">
            REGISTER <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </motion.nav>

      {/* ── ABOUT ── */}
      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-acc-gray font-mono font-bold text-xs tracking-[0.5em] uppercase mb-10 block"
          >
            WHO WE ARE
          </motion.span>
          <h1 className="text-6xl md:text-[8vw] font-mono font-black uppercase leading-none tracking-tighter text-text">
            <span className="block overflow-hidden">
              <motion.span className="block" variants={lineReveal} initial="hidden" animate="show">
                ABOUT
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block shimmer-text"
                variants={lineReveal}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              >
                NYFS.
              </motion.span>
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="text-2xl font-bold leading-tight">
              The Northeast Young Founders Summit (NYFS) is the premier platform for Gen Z entrepreneurs in Northeast India.
            </motion.p>
            <motion.p variants={fadeUp} className="text-acc-dark leading-relaxed">
              We bridge the gap between ambition and execution. Our programs are designed to provide young builders with the mindset, network, and tools they need to build ventures that solve real problems in our region and beyond.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -6, rotate: -1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 shadow-[8px_8px_0_0_var(--menthe)]"
              >
                <Rocket className="w-8 h-8 text-orange mb-4" />
                <h4 className="font-black uppercase mb-2">High Impact</h4>
                <p className="text-xs text-acc-dark">Direct mentorship from industry leaders and successful founders.</p>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -6, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 shadow-[8px_8px_0_0_var(--verveine)]"
              >
                <Globe className="w-8 h-8 text-brand mb-4" />
                <h4 className="font-black uppercase mb-2">Global Vision</h4>
                <p className="text-xs text-acc-dark">Local solutions for global challenges through digital innovation.</p>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="pt-6">
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 px-6 md:px-10 py-5 bg-brand text-bg border-4 border-text font-black text-xs tracking-widest uppercase hover:-translate-y-1 transition-all shadow-[8px_8px_0_0_var(--verveine)]"
              >
                REGISTER NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <div ref={quoteRef} className="relative">
            <motion.div
              style={{ y: quoteY }}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative"
            >
               <div className="absolute inset-0 bg-brand/10 -rotate-3 border-4 border-text" />
               <div className="relative bg-white/70 backdrop-blur-2xl border-4 border-text p-12 shadow-[16px_16px_0_0_#000]">
                  <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                    <Zap className="w-12 h-12 text-orange mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-black uppercase mb-6 leading-none">THE NEW <br /> STANDARD.</h2>
                  <p className="text-acc-dark italic">
                    &quot;NYFS isn&apos;t just an event; it&apos;s a movement. We are building an ecosystem where young founders don&apos;t just dream, they execute.&quot;
                  </p>
                  <div className="mt-10 pt-10 border-t border-acc-gray/20">
                     <p className="font-mono text-acc-dark text-xs font-black uppercase tracking-widest">Est. 2026 // Northeast India</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ── MARQUEE TICKER ── */}
      <div className="relative z-10 border-y-4 border-text bg-brand text-bg overflow-hidden py-5 -rotate-1 my-10">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {["IDEA → MVP → PITCH", "3 DAYS", "₹50,000 PRIZE POOL", "MENTOR-LED", "BUILD. PITCH. WIN.", "NORTHEAST INDIA"].map((t, i) => (
                <span key={i} className="flex items-center text-2xl md:text-4xl font-black uppercase tracking-tighter">
                  <span className="px-8">{t}</span>
                  <Zap className="w-6 h-6 fill-bg" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── SUMMITS ── */}
      <section className="font-general relative z-10 pb-40">
        <header className="px-6 md:px-10 pt-20 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
              >
                <motion.span variants={fadeUp} className="text-acc-dark font-bold text-xs tracking-[0.5em] uppercase mb-6 block border-l-2 border-brand pl-4">
                  UPCOMING SCHEDULE
                </motion.span>
                <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter text-text">
                  <motion.span variants={fadeUp} className="block">FLAGSHIP</motion.span>
                  <motion.span variants={fadeUp} className="block shimmer-text">SUMMITS.</motion.span>
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex items-center gap-6"
              >
                 <div className="text-right hidden md:block">
                    <span className="text-[10px] text-acc-dark block font-black mb-1">NEXT WORKSHOP IN</span>
                    <span className="text-xl font-bold tracking-tighter text-text border border-acc-gray px-4 py-2 bg-acc-gray/10 tabular-nums">{countdown}</span>
                 </div>
                 <div className="w-px h-12 bg-acc-gray" />
                 <Zap className="w-8 h-8 text-brand animate-pulse" />
              </motion.div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {summits.map((summit, i) => (
              <motion.div
                key={i}
                layout
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col h-full bg-acc-gray/10 border border-acc-gray transition-colors duration-500 hover:shadow-2xl hover:shadow-brand/10 ${expandedIndex === i ? 'border-brand/50 ring-1 ring-brand/10' : 'hover:border-brand/30'}`}
              >
                {/* Image */}
                <div className="relative h-[400px] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={summit.image} alt={summit.title} className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
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

                  <AnimatePresence initial={false}>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
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
                  </AnimatePresence>

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

                <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-l-[30px] border-t-white border-l-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-20 px-6 md:px-10 bg-bg border-t border-acc-gray">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
         >
            <p className="font-mono text-acc-dark text-[10px] tracking-widest uppercase text-center md:text-left">
               © 2026 NORTHEAST YOUNG FOUNDERS SUMMIT // BUILDING THE FUTURE
            </p>
            <nav className="flex items-center gap-8">
               <Link href="/contact" className="font-mono text-acc-dark text-[10px] font-black tracking-widest uppercase hover:text-brand transition-colors">
                  CONTACT
               </Link>
               <Link href="/privacy" className="font-mono text-acc-dark text-[10px] font-black tracking-widest uppercase hover:text-brand transition-colors">
                  PRIVACY
               </Link>
               <Link href="/terms" className="font-mono text-acc-dark text-[10px] font-black tracking-widest uppercase hover:text-brand transition-colors">
                  TERMS
               </Link>
            </nav>
         </motion.div>
      </footer>
    </div>
  );
}
