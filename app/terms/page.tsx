"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 bg-bg/80 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <span className="font-satoshi font-black italic text-brand tracking-tighter text-3xl select-none group-hover:scale-105 transition-transform">
            NYFS
          </span>
        </Link>
        <Link href="/" className="font-mono font-black text-xs tracking-widest uppercase hover:text-brand transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
      </nav>

      <main className="pt-40 pb-20 px-10 max-w-4xl mx-auto">
        <div className="mb-20">
          <FileText className="w-16 h-16 text-orange mb-6" />
          <h1 className="text-6xl md:text-8xl font-mono font-black uppercase leading-none tracking-tighter text-text">
            TERMS OF <br />
            <span className="text-brand">SERVICE.</span>
          </h1>
          <p className="mt-10 text-acc-dark font-bold">Effective Date: May 2026</p>
        </div>

        <div className="space-y-12 text-acc-dark leading-relaxed">
          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-orange pb-2 inline-block">1. Acceptance</h2>
            <p>
              By accessing or using the NYFS website and services, you agree to be bound by these terms. If you do not agree, you may not use our services.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--menthe)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-brand pb-2 inline-block">2. Event Registration</h2>
            <p>
              Registration for the Northeast Young Founders Summit is subject to availability and approval. You must provide accurate and complete information during the registration process.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--verveine)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-orange pb-2 inline-block">3. Payments & Fees</h2>
            <p>
              All fees are payable in Indian Rupees (INR) unless otherwise specified. Payments are processed via secure third-party payment gateways.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-brand pb-2 inline-block">4. Code of Conduct</h2>
            <p>
              Attendees are expected to behave professionally and respectfully. NYFS reserves the right to remove any individual whose behavior is deemed inappropriate or disruptive.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-20 px-10 bg-bg border-t border-acc-gray text-center">
         <p className="font-mono text-acc-dark text-[10px] tracking-widest uppercase">
            © 2026 NORTHEAST YOUNG FOUNDERS SUMMIT // BUILDING THE FUTURE
         </p>
      </footer>
    </div>
  );
}
