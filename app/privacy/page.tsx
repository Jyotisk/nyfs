"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-bg/80 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NYFS" className="h-16 md:h-20 w-auto select-none group-hover:scale-105 transition-transform" />
        </Link>
        <Link href="/" className="font-mono font-black text-xs tracking-widest uppercase hover:text-brand transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
      </nav>

      <main className="pt-32 md:pt-40 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        <div className="mb-20">
          <Shield className="w-16 h-16 text-brand mb-6" />
          <h1 className="text-6xl md:text-8xl font-mono font-black uppercase leading-none tracking-tighter text-text">
            PRIVACY <br />
            <span className="text-orange">POLICY.</span>
          </h1>
          <p className="mt-10 text-acc-dark font-bold">Last Updated: 29 June, 2026</p>
        </div>

        <div className="space-y-12 text-acc-dark leading-relaxed">
          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--menthe)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-orange pb-2 inline-block">1. Data Collection</h2>
            <p>
              We collect information you provide directly to us when you register for the summit, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, and any other information you choose to provide.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--verveine)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-brand pb-2 inline-block">2. Use of Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 font-bold">
              <li>Process your summit registration and payments.</li>
              <li>Send you updates and information about the event.</li>
              <li>Respond to your comments, questions, and requests.</li>
              <li>Monitor and analyze trends, usage, and activities.</li>
            </ul>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_#000]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-orange pb-2 inline-block">3. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. We use secure payment gateways for all transactions and do not store sensitive payment details on our servers.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-2xl border-4 border-text p-8 shadow-[12px_12px_0_0_var(--menthe)]">
            <h2 className="text-2xl font-black text-text uppercase mb-6 border-b-4 border-brand pb-2 inline-block">4. Third-Party Services</h2>
            <p>
              We may use third-party services such as Supabase for database management and Razorpay for payment processing. These services have their own privacy policies regarding how they handle your data.
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
