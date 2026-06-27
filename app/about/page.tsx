"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, Globe, Zap } from "lucide-react";

export default function AboutPage() {
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

      <main className="pt-40 pb-20 px-10 max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-acc-gray font-mono font-bold text-xs tracking-[0.5em] uppercase mb-10 block">WHO WE ARE</span>
          <h1 className="text-6xl md:text-[8vw] font-mono font-black uppercase leading-none tracking-tighter text-text">
            ABOUT <br />
            <span className="text-brand">NYFS.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <p className="text-2xl font-bold leading-tight">
              The Northeast Young Founders Summit (NYFS) is the premier platform for Gen Z entrepreneurs in Northeast India.
            </p>
            <p className="text-acc-dark leading-relaxed">
              We bridge the gap between ambition and execution. Our programs are designed to provide young builders with the mindset, network, and tools they need to build ventures that solve real problems in our region and beyond.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              <div className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 shadow-[8px_8px_0_0_var(--menthe)]">
                <Rocket className="w-8 h-8 text-orange mb-4" />
                <h4 className="font-black uppercase mb-2">High Impact</h4>
                <p className="text-xs text-acc-dark">Direct mentorship from industry leaders and successful founders.</p>
              </div>
              <div className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 shadow-[8px_8px_0_0_var(--verveine)]">
                <Globe className="w-8 h-8 text-brand mb-4" />
                <h4 className="font-black uppercase mb-2">Global Vision</h4>
                <p className="text-xs text-acc-dark">Local solutions for global challenges through digital innovation.</p>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-brand/10 -rotate-3 border-4 border-text" />
             <div className="relative bg-white/70 backdrop-blur-2xl border-4 border-text p-12 shadow-[16px_16px_0_0_#000]">
                <Zap className="w-12 h-12 text-orange mb-6" />
                <h2 className="text-4xl font-black uppercase mb-6 leading-none">THE NEW <br /> STANDARD.</h2>
                <p className="text-acc-dark italic">
                  &quot;NYFS isn&apos;t just an event; it&apos;s a movement. We are building an ecosystem where young founders don&apos;t just dream, they execute.&quot;
                </p>
                <div className="mt-10 pt-10 border-t border-acc-gray/20">
                   <p className="font-mono text-acc-dark text-xs font-black uppercase tracking-widest">Est. 2026 // Northeast India</p>
                </div>
             </div>
          </div>
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
