"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-bg/80 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-12 md:h-16 w-auto select-none group-hover:scale-105 transition-transform" />
        </Link>
        <Link href="/" className="font-mono font-black text-xs tracking-widest uppercase hover:text-brand transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
      </nav>

      <main className="pt-32 md:pt-40 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        <div className="mb-20">
          <RefreshCcw className="w-16 h-16 text-brand mb-6" />
          <h1 className="text-6xl md:text-8xl font-mono font-black uppercase leading-none tracking-tighter text-text">
            REFUND <br />
            <span className="text-orange">POLICY.</span>
          </h1>
          <p className="mt-10 text-acc-dark font-bold">Effective Date: May 2026</p>
        </div>

        <div className="space-y-12 text-acc-dark leading-relaxed">
          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--menthe)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-orange pb-2 inline-block">1. Cancellation by Attendee</h2>
            <p>
              Cancellations made more than 15 days before the event will be eligible for a 50% refund. Cancellations made within 15 days of the event are non-refundable.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--verveine)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-brand pb-2 inline-block">2. Cancellation by NYFS</h2>
            <p>
              In the unlikely event that NYFS cancels the summit, attendees will be offered a full refund of their registration fee.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-orange pb-2 inline-block">3. Substitution Policy</h2>
            <p>
              You may substitute your registration with another person at any time before the event, provided you notify us at least 48 hours in advance.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-20 px-6 md:px-10 bg-bg border-t border-acc-gray text-center">
         <p className="font-mono text-acc-dark text-[10px] tracking-widest uppercase">
            © 2026 NORTHEAST YOUNG FOUNDERS SUMMIT // BUILDING THE FUTURE
         </p>
      </footer>
    </div>
  );
}
