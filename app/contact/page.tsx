"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Mail, Phone, ArrowLeft, ArrowRight, Clock } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const organizers = [
  { name: "Zaviaa Hayat", role: "Founder & Lead Organizer", tel: "+919954012087", display: "+91 99540 12087" },
  { name: "Aishani Sharma", role: "Co-Founder & Lead Organizer", tel: "+919101769055", display: "+91 91017 69055" },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500 overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-brand/20 blur-[130px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 -right-40 w-[32rem] h-[32rem] rounded-full bg-orange/15 blur-[130px]"
          animate={{ x: [0, -50, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="noise" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-bg/70 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-12 md:h-16 w-auto select-none group-hover:scale-105 transition-transform" />
        </Link>
        <Link href="/" className="group font-mono font-black text-xs tracking-widest uppercase hover:text-brand transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
        </Link>
      </nav>

      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 md:mb-20"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.span
            variants={fadeUp}
            className="text-black font-mono font-black text-xl md:text-2xl tracking-[0.25em] uppercase mb-8 block border-l-4 border-brand pl-4"
          >
            SUPPORT CENTER
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-[8vw] font-mono font-black uppercase leading-none tracking-tighter text-text"
          >
            CONTACT <span className="text-orange">US.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 text-lg md:text-xl font-general text-acc-dark leading-relaxed max-w-2xl"
          >
            Questions about the summit, registration, or partnerships? Reach out — our team
            usually replies within a day.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Email */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 md:p-10 shadow-[12px_12px_0_0_var(--menthe)] flex flex-col"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-orange/10 border-2 border-text mb-8">
              <Mail className="w-7 h-7 text-orange" />
            </div>
            <h3 className="font-mono font-black text-2xl uppercase mb-3 tracking-tight">Email Us</h3>
            <p className="font-general text-acc-dark mb-6">For general inquiries and support.</p>
            <a
              href="mailto:northeastyoungfounderssummit@gmail.com"
              className="mt-auto font-mono font-black text-base md:text-lg text-brand break-all hover:underline underline-offset-4"
            >
              northeastyoungfounderssummit@gmail.com
            </a>
          </motion.div>

          {/* Call */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 md:p-10 shadow-[12px_12px_0_0_var(--verveine)] flex flex-col"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-brand/10 border-2 border-text mb-8">
              <Phone className="w-7 h-7 text-brand" />
            </div>
            <h3 className="font-mono font-black text-2xl uppercase mb-3 tracking-tight">Call Us</h3>
            <p className="font-general text-acc-dark mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" /> Mon–Sat, 4:00–8:00 PM IST
            </p>
            <div className="mt-auto space-y-5">
              {organizers.map((o) => (
                <div key={o.tel} className="border-l-2 border-brand/40 pl-4">
                  <a
                    href={`tel:${o.tel}`}
                    className="block font-mono font-black text-xl text-orange hover:underline underline-offset-4"
                  >
                    {o.display}
                  </a>
                  <span className="block font-general text-sm text-acc-dark mt-1">
                    {o.name} · {o.role}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Register CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          className="mt-8 bg-text text-bg p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-tight mb-2">
              Ready to build?
            </h3>
            <p className="font-general text-bg/70">Secure your spot at the next NYFS summit.</p>
          </div>
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-grad-brand text-dark-teal border-4 border-bg font-mono font-black text-xs tracking-widest uppercase hover:opacity-90 transition-all active:scale-95 shrink-0"
          >
            REGISTER NOW
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </main>

      <footer className="relative z-10 py-20 px-6 md:px-10 bg-bg border-t border-acc-gray text-center">
        <p className="font-mono text-acc-dark text-[10px] tracking-widest uppercase">
          © 2026 NORTHEAST YOUNG FOUNDERS SUMMIT // BUILDING THE FUTURE
        </p>
      </footer>
    </div>
  );
}
