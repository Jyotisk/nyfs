"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, Rocket, Globe, Zap, Calendar, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";

const summits = [
  {
    title: "DAY 1: Ideate",
    date: "WED, 29 JULY 2026",
    location: "Iris - The Boutique Hotel",
    desc: "You don’t need an idea to start. On Day 1, you’ll break down how startups actually work, spot real problems around you, turn them into ideas, test them, and find your team. By the end, you’ll have a solid idea you actually want to take forward.",
    image: "/3.webp",
    code: "DAY 01",
    details: {
      highlights: ["Entrepreneurship Fundamentals", "Problem Scouting", "Team Formation", "Idea Validation"],
      sessions: ["10:00 AM — Registration & Networking", "10:30 AM — Opening Ceremony & Introduction to Entrepreneurship",
         "12:00 PM — Problem Scouting & Idea Validation Workshop", "1:00 PM — Networking Lunch","2:00 PM — Team Formation & IdeationSprint",
        "4:30 PM — Team Discussions & Mentor Feedback","5:30 PM — Day Wrap-up","5:30–6:00 PM — Networking & Departure" ],
    },
  },
  {
    title: "DAY 2: Build & Validate",
    date: "THU, 30 JULY 2026",
    location: "Iris - The Boutique Hotel",
    desc: "Day 2 is where ideas meet reality. You’ll test your idea with users, create a working MVP using no-code tools, and refine it through feedback. You’ll also learn how to turn your work into a compelling pitch and build a deck that actually wins over judges and investors.",
    image: "/2.jpeg",
    code: "DAY 02",
    details: {
      highlights: ["MVP Development", "Business Model Canvas", "Branding & Marketing", "Pitch Deck Creation"],
      sessions: ["10:00 AM — Arrival & Networking", "10:30 AM — MVP & Business Model Workshop", "12:30 PM — Branding, Marketing & Finance Sessions",
        "1:30 PM — Networking Lunch","2:30 PM — Pitch Deck Workshop","4:00 PM — Team Working Session & Mentor Reviews","5:30 PM — Day Wrap-up",
        "5:30–6:00 PM — Networking & Departure"
      ],
    },
  },
  {
    title: "DAY 3: Pitch & Win",
    date: "FRI, 31 JULY 2026",
    location: "Iris - The Boutique Hotel",
    desc: "Day 3 is D-DAY. You’ll refine your pitch, demo your MVP, and face a panel of founders and operators in a high-pressure, Shark Tank-style final round. This is where you prove what you’ve built.",
    image: "/1.webp",
    code: "DAY 03",
    details: {
      highlights: ["Final Mentorship", "Pitch Competition", "Awards Ceremony", "Founder Networking"],
      sessions: ["10:00 AM — Arrival & Networking", "10:30 AM — Pitching Masterclass & Final Preparations & Mentor Feedback & Practice", 
        "12:30 PM — Networking Lunch", "1:30 PM — Startup Pitch Competition Begins", "4:30 PM — Judges' Deliberation", "5:00 PM — Awards Ceremony & Closing Remarks",
        "5:30–6:00 PM — Networking & Departure"
      ],
    },
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// Countdown target — the event date.
const EVENT_DATE = new Date("2026-07-29T00:00:00").getTime();

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
  const [countdown, setCountdown] = useState("30 DAYS  00:00:00");
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
  const quoteY = useTransform(quoteProgress, [0, 1], [20, -20]);

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const distance = Math.max(0, EVENT_DATE - Date.now());
      const days = Math.floor(distance / 86_400_000);
      const hours = Math.floor((distance % 86_400_000) / 3_600_000);
      const minutes = Math.floor((distance % 3_600_000) / 60_000);
      const seconds = Math.floor((distance % 60_000) / 1000);
      setCountdown(`${days} DAYS  ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500 overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-grad-brand origin-left z-[60]"
      />

      {/* Background: dot grid + ambient glows */}
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
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 md:h-20 bg-white/40 backdrop-blur-xl border-b border-acc-gray"
      >
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-28 md:h-40 w-auto select-none group-hover:scale-105 transition-transform" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
          <Link href="/register" className="px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 border-2 border-brand text-brand font-mono font-black text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase hover:bg-brand hover:text-white transition-all rounded-sm active:scale-95 inline-flex items-center gap-2">
            REGISTER <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </motion.nav>

      {/* ── ABOUT ── */}
      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-black font-mono font-black text-base md:text-2xl tracking-[0.2em] md:tracking-[0.25em] uppercase mb-6 md:mb-10 block border-l-4 border-brand pl-4"
          >
            WHO WE ARE
          </motion.span>
          <h1 className="text-5xl md:text-[6.5vw] font-mono font-black uppercase leading-none tracking-tighter text-text">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="text-2xl md:text-3xl font-general font-bold leading-snug text-text">
              The Northeast Young Founders Summit is built on one belief: the next generation of great Indian companies doesn't have to come from Bangalore or Delhi. It can come from here.
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg md:text-xl font-general font-medium text-acc-dark leading-relaxed">
              The talent was always here; the room to build it wasn't. NYFS is that room - a three-day bootcamp and pitch competition for Gen Z founders and first-time builders across Northeast India, where you'll learn how startups actually get built and pitch your own to mentors and investors on the final day.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -6, rotate: -1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 shadow-[8px_8px_0_0_var(--menthe)]"
              >
                <Rocket className="w-8 h-8 text-orange mb-4" />
                <h4 className="font-black uppercase mb-2 text-xl">THE NETWORK YOU LACKED</h4>
                <p className="text-base font-general text-acc-dark leading-relaxed">The mentors, investors, and founders the region rarely puts in one room - now in one room, for you.</p>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -6, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 shadow-[8px_8px_0_0_var(--verveine)]"
              >
                <Globe className="w-8 h-8 text-brand mb-4" />
                <h4 className="font-black uppercase mb-2 text-xl">MADE FOR FIRST-TIMERS</h4>
                <p className="text-base font-general text-acc-dark leading-relaxed">Built for people who've never pitched, never raised, never built before. Everyone starts somewhere; start here.</p>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="pt-6">
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 px-6 md:px-10 py-5 bg-grad-brand text-dark-teal border-4 border-text font-black text-xs tracking-widest uppercase hover:-translate-y-1 transition-all shadow-[8px_8px_0_0_var(--verveine)]"
              >
                REGISTER NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <div ref={quoteRef} className="relative flex flex-col gap-4">
            {/* Floating decorative shapes filling the space above the card */}
            <div className="relative h-10 md:h-14 hidden lg:block" aria-hidden>
              <motion.div
                className="absolute left-2 top-1 w-10 h-10 border-4 border-text bg-brand/20"
                animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-28 top-0 w-8 h-8 rounded-full border-4 border-text bg-orange/30"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
              <motion.div
                className="absolute left-1/2 top-3 w-6 h-6 rounded-full bg-verveine/40"
                animate={{ y: [0, 7, 0], x: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="absolute right-24 top-0 flex items-center justify-center w-11 h-11 border-4 border-text bg-white shadow-[6px_6px_0_0_var(--verveine)]"
                animate={{ y: [0, -7, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <Rocket className="w-5 h-5 text-orange" />
              </motion.div>
              <motion.div
                className="absolute right-2 top-2 flex items-center justify-center w-10 h-10 border-4 border-text bg-white shadow-[6px_6px_0_0_var(--menthe)]"
                animate={{ y: [0, 8, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              >
                <Zap className="w-4 h-4 text-brand fill-brand" />
              </motion.div>
            </div>

            <motion.div
              style={{ y: quoteY }}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative"
            >
               <div className="absolute inset-0 bg-brand/10 -rotate-3 border-4 border-text" />
               <div className="relative bg-white/70 backdrop-blur-2xl border-4 border-text p-8 md:p-12 shadow-[12px_12px_0_0_#000] md:shadow-[16px_16px_0_0_#000]">
                  <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                    <Zap className="w-10 h-10 md:w-12 md:h-12 text-orange mb-6" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase mb-6 leading-none">THE NEW <br /> STANDARD.</h2>
                  <p className="text-acc-dark italic text-lg md:text-xl">
                    "The standard used to be: have a good idea, then leave to build it.We're setting a new one good idea, and build it right here."
                  </p>
                  <div className="mt-10 pt-10 border-t border-acc-gray/20">
                     <p className="font-mono text-acc-dark text-xs font-black uppercase tracking-widest">Est. 2026 // Northeast India</p>
                  </div>
               </div>
            </motion.div>

            {/* Quick facts — aligned with the left-hand cards */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-3 divide-x divide-acc-gray border-4 border-text bg-white/70 backdrop-blur-2xl shadow-[8px_8px_0_0_var(--menthe)]"
            >
              {[
                { Icon: Calendar, label: "DATES", value: <>29th June – 1st<br />July, 2026</> },
                { Icon: Trophy, label: "PRIZE POOL", value: <>Up to<br />Rs. 50,000</> },
                { Icon: Users, label: "FOR", value: <>High School and College Students</> },
              ].map(({ Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative p-3 sm:p-4 md:p-6 flex flex-col items-center text-center overflow-hidden"
                >
                  {/* hover sweep */}
                  <span className="absolute inset-0 bg-grad-brand opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
                  <motion.div
                    className="relative mb-2 md:mb-3 text-text group-hover:text-brand transition-colors"
                    animate={{ y: [0, -5, 0], rotate: [0, i % 2 === 0 ? 6 : -6, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                  <span className="relative text-[9px] sm:text-[10px] font-black tracking-wider sm:tracking-widest uppercase text-brand mb-1.5 md:mb-2">{label}</span>
                  <span className="relative text-xs sm:text-sm md:text-base font-black leading-tight text-text">{value}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      {/* ── MARQUEE TICKER ── */}
      <div className="relative z-10 border-y-4 border-text bg-grad-brand text-dark-teal overflow-hidden py-7 my-10">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {["IDEA → MVP → PITCH", "3 DAYS", "₹50,000 PRIZE POOL", "MENTOR-LED", "BUILD. PITCH. WIN.", "NORTHEAST INDIA"].map((t, i) => (
                <span key={i} className="flex items-center text-2xl md:text-4xl font-black uppercase tracking-tighter">
                  <span className="px-8">{t}</span>
                  <Zap className="w-6 h-6 fill-dark-teal" />
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
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className="text-black font-mono font-black text-xl md:text-2xl tracking-[0.25em] uppercase mb-6 block border-l-4 border-brand pl-4">
                  UPCOMING SCHEDULE
                </span>
                <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter text-text">
                  <span className="block">FLAGSHIP</span>
                  <span className="block shimmer-text">SUMMIT.</span>
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
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
                initial={{ opacity: 0, scale: 0.88, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1], delay: i * 0.15 }}
                viewport={{ once: true, amount: 0.05 }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3, ease: EASE } }}
                className={`group relative flex flex-col h-full bg-acc-gray/10 border border-acc-gray transition-colors duration-500 hover:shadow-2xl hover:shadow-brand/10 ${expandedIndex === i ? 'border-brand/50 ring-1 ring-brand/10' : 'hover:border-brand/30'}`}
              >
                {/* Image */}
                <div className="relative h-[400px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={summit.image} alt={summit.title} className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 font-black text-[10px] text-white bg-brand px-2 py-1 tracking-widest">
                    {summit.code}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-acc-dark font-bold mb-4">
                    <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand" /> {summit.date}</div>
                    <div className="w-1 h-1 bg-acc-gray rounded-full" />
                    <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand" /> {summit.location}</div>
                  </div>

                  <h3 className="text-2xl md:text-2.5xl font-black uppercase mb-4 leading-tight tracking-tight text-text group-hover:text-brand transition-colors">
                    {summit.title}
                  </h3>

                  <p className="text-base text-text leading-relaxed mb-6 italic opacity-90">
                    {summit.desc}
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
                         <span className="text-sm font-black text-brand tracking-widest uppercase mb-4 block underline">HIGHLIGHTS</span>
                         <ul className="space-y-3">
                            {summit.details.highlights.map((h, idx) => (
                               <li key={idx} className="text-base text-acc-dark flex items-center gap-2 font-medium">
                                  <Zap className="w-3 h-3 text-brand fill-brand shrink-0" /> {h}
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div>
                         <span className="text-sm font-black text-brand tracking-widest uppercase mb-4 block underline">SCHEDULE</span>
                         <ul className="space-y-4">
                            {summit.details.sessions.map((s, idx) => (
                               <li key={idx} className="border-l-2 border-acc-gray pl-4 py-1">
                                  <span className="text-xs text-acc-dark block font-black">{s.split(' - ')[0]}</span>
                                  <span className="text-base font-bold text-text">{s.split(' - ')[1]}</span>
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

      {/* ── CALL TO ACTION ── */}
      <section className="relative z-10 px-6 md:px-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-7xl mx-auto bg-text text-bg border-4 border-text overflow-hidden relative"
        >
          {/* gradient accent strip */}
          <div className="h-2 w-full bg-grad-brand" />

          <div className="p-10 md:p-20 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-grad-brand text-dark-teal font-mono font-black text-[11px] md:text-xs tracking-[0.25em] uppercase">
              <Zap className="w-4 h-4 fill-dark-teal" /> LIMITED SEATS
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-mono font-black uppercase leading-[0.9] tracking-tighter mb-6">
              YOUR SEAT WON&apos;T<br />
              <span className="text-grad-brand">WAIT.</span>
            </h2>

            <p className="font-general text-base md:text-xl text-bg/70 max-w-xl mb-12 leading-relaxed">
              Only a limited number of spots for the next NYFS cohort. Lock yours in before
              registrations close on <span className="font-mono font-black text-bg/90">22 JULY 2026</span>.
            </p>

            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-10 md:px-14 py-5 md:py-6 bg-grad-brand text-dark-teal border-4 border-bg font-mono font-black text-sm md:text-base tracking-widest uppercase hover:-translate-y-1 transition-all active:scale-95"
            >
              REGISTER NOW
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* <p className="mt-6 font-mono text-[10px] md:text-xs tracking-widest uppercase text-bg/50">
              29 JUNE 2026 · GUWAHATI · FREE ENTRY
            </p> */}
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 py-10 px-6 md:px-10 bg-white border-t border-acc-gray">
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
               <Link href="/login" className="font-mono text-acc-dark text-[10px] font-black tracking-widest uppercase hover:text-brand transition-colors">
                  ADMIN LOGIN
               </Link>
            </nav>
         </motion.div>
      </footer>
    </div>
  );
}
