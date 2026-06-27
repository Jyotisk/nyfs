"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg text-text font-mono selection:bg-brand selection:text-dark-teal transition-colors duration-500">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-bg/80 backdrop-blur-xl border-b border-acc-gray transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <span className="font-satoshi font-black italic text-brand tracking-tighter text-3xl select-none group-hover:scale-105 transition-transform">
            NYFS
          </span>
        </Link>
        <Link href="/" className="font-mono font-black text-xs tracking-widest uppercase hover:text-brand transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
      </nav>

      <main className="pt-32 md:pt-40 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-acc-gray font-mono font-bold text-xs tracking-[0.5em] uppercase mb-10 block">SUPPORT CENTER</span>
          <h1 className="text-6xl md:text-[8vw] font-mono font-black uppercase leading-none tracking-tighter text-text">
            CONTACT <br />
            <span className="text-orange">US.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 md:p-10 shadow-[16px_16px_0_0_var(--menthe)] group hover:-translate-y-2 transition-all">
              <Mail className="w-10 h-10 text-orange mb-6" />
              <h3 className="font-mono font-black text-xl uppercase mb-2">Email Us</h3>
              <p className="text-acc-dark">For general inquiries and support:</p>
              <a href="mailto:support@nyfs.in" className="text-2xl font-black text-brand break-all hover:underline mt-4 block">support@nyfs.in</a>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 md:p-10 shadow-[16px_16px_0_0_var(--verveine)] group hover:-translate-y-2 transition-all">
              <Phone className="w-10 h-10 text-brand mb-6" />
              <h3 className="font-mono font-black text-xl uppercase mb-2">Call Us</h3>
              <p className="text-acc-dark">Available Mon-Fri, 10am - 6pm IST:</p>
              <a href="tel:+919876543210" className="text-2xl font-black text-orange hover:underline mt-4 block">+91 98765 43210</a>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border-4 border-text p-6 md:p-10 shadow-[16px_16px_0_0_#000] group hover:-translate-y-2 transition-all flex flex-col justify-between">
            <div>
              <MapPin className="w-10 h-10 text-brand mb-6" />
              <h3 className="font-mono font-black text-xl uppercase mb-2">Our Office</h3>
              <p className="text-acc-dark leading-relaxed">
                Northeast Young Founders Summit HQ<br />
                Innovation Hub, 4th Floor<br />
                Guwahati, Assam 781001<br />
                India
              </p>
            </div>
            
            <div className="mt-20 pt-10 border-t border-acc-gray/20">
              <p className="font-mono text-acc-dark text-[10px] tracking-widest uppercase">
                NYFS // THE NEW STANDARD IN ENTREPRENEURSHIP
              </p>
            </div>
          </div>
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
