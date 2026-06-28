"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Zap,
  Target,
  Users,
  ShieldCheck,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 'personal', title: 'PERSONAL INFO', icon: <Users className="w-5 h-5" /> },
  { id: 'mission', title: 'MISSION & PITCH', icon: <Target className="w-5 h-5" /> },
  { id: 'confirm', title: 'REVIEW & CONFIRM', icon: <ShieldCheck className="w-5 h-5" /> }
];

// Shared input className
const inputCls =
  "w-full bg-white border-2 border-navy-deep px-5 py-4 font-general font-bold text-base text-navy-deep focus:border-blue-bright focus:-translate-y-0.5 focus:shadow-[4px_4px_0_0_rgba(0,51,255,0.3)] outline-none transition-all placeholder:text-navy-deep/30";

const labelCls = "text-[10px] font-black tracking-[0.25em] uppercase text-navy-deep/60 mb-2 block";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    institution: '',
    grade: '',
    city: '',
    motivation: '',
    problem: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const goNext = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            full_name: formData.fullName,
            whatsapp: formData.whatsapp,
            institution: formData.institution,
            grade: formData.grade,
            city: formData.city,
            motivation: formData.motivation,
            problem: formData.problem,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Registration failed. Please try again.');
        setIsSubmitted(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    } else {
      goNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-light text-navy-deep font-general selection:bg-blue-bright selection:text-white overflow-x-hidden">
      {/* Background grid + ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0033ff08_1px,transparent_1px),linear-gradient(to_bottom,#0033ff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-blue-bright/15 blur-[130px]"
          animate={{ x: [0, 50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 -right-32 w-[32rem] h-[32rem] rounded-full bg-purple-light/15 blur-[130px]"
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="noise" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gray-light/80 backdrop-blur-2xl border-b border-navy-deep/10">
        <div className="flex items-center gap-6">
          <Link href="/" className="select-none hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NYFS" className="h-14 md:h-16 w-auto" />
          </Link>
          <Link
            href="/"
            className="group hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-navy-deep/15 rounded-sm font-general font-black text-[10px] tracking-[0.2em] uppercase text-navy-deep/70 hover:border-blue-bright hover:text-blue-bright transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> HOME
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-28 md:pt-32 pb-24 px-6 md:px-10 relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              {/* Back button */}
              <Link
                href="/"
                className="group inline-flex items-center gap-2 mb-8 text-navy-deep/50 hover:text-blue-bright transition-colors font-general font-black text-[11px] tracking-[0.2em] uppercase"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
              </Link>

              {/* Header */}
              <div className="mb-12">
                <span className="text-blue-bright font-general font-bold text-xs tracking-[0.5em] uppercase mb-4 block">
                  NYFS 2026
                </span>
                <h1 className="text-[16vw] md:text-[clamp(4rem,12vw,9rem)] font-general font-black uppercase leading-[0.8] tracking-tighter text-navy-deep">
                  REGISTER.
                </h1>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase text-navy-deep/40">
                    STEP {currentStep + 1} / {steps.length}
                  </span>
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase text-blue-bright">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-navy-deep/10 overflow-hidden rounded-sm">
                  <motion.div
                    className="h-full bg-blue-bright"
                    initial={false}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Step tabs */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-12">
                {steps.map((step, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => isDone && setCurrentStep(i)}
                      className={`relative p-4 md:p-6 flex flex-col items-start gap-3 border-2 transition-all duration-300
                        ${isActive
                          ? 'bg-navy-deep text-white border-navy-deep shadow-[6px_6px_0_0_rgba(0,51,255,0.5)] -translate-y-1'
                          : isDone
                          ? 'bg-blue-bright/10 border-blue-bright text-navy-deep hover:-translate-y-1 cursor-pointer'
                          : 'bg-white/60 border-navy-deep/20 text-navy-deep/40 cursor-not-allowed'
                        }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-black tracking-widest ${isActive ? 'text-white/60' : isDone ? 'text-blue-bright' : 'text-navy-deep/30'}`}>
                          0{i + 1}
                        </span>
                        <span className={isActive ? 'text-blue-bright' : isDone ? 'text-blue-bright' : 'text-navy-deep/30'}>
                          {isDone ? <Check className="w-5 h-5" /> : step.icon}
                        </span>
                      </div>
                      <span className={`text-xs md:text-sm font-black tracking-widest uppercase text-left leading-tight ${isActive ? 'text-white' : isDone ? 'text-navy-deep' : 'text-navy-deep/30'}`}>
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form card */}
              <form
                onSubmit={handleSubmit}
                className="bg-white border-4 border-navy-deep p-8 md:p-14 shadow-[12px_12px_0_0_rgba(0,3,61,1)]"
              >
                {error && (
                  <div className="mb-8 p-4 bg-red-50 border-2 border-red-400 text-red-600 text-xs font-black tracking-widest uppercase">
                    ⚠ {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="min-h-[320px]"
                  >
                    {/* ── STEP 0: Personal Info ── */}
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelCls}>Full Name</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Your Name" className={inputCls} required />
                          </div>
                          <div>
                            <label className={labelCls}>Email Address</label>
                            <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="you@example.com" className={inputCls} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelCls}>WhatsApp Number</label>
                            <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" placeholder="+91 00000 00000" className={inputCls} required />
                          </div>
                          <div>
                            <label className={labelCls}>City</label>
                            <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="e.g. Guwahati, Shillong" className={inputCls} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelCls}>School / College</label>
                            <input name="institution" value={formData.institution} onChange={handleChange} type="text" placeholder="Institution Name" className={inputCls} required />
                          </div>
                          <div>
                            <label className={labelCls}>Grade / Year</label>
                            <input name="grade" value={formData.grade} onChange={handleChange} type="text" placeholder="e.g. 11th, Final Year" className={inputCls} required />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 1: Mission & Pitch ── */}
                    {currentStep === 1 && (
                      <div className="space-y-8">
                        <div>
                          <label className={labelCls}>Why do you want to join this bootcamp?</label>
                          <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows={4} placeholder="Tell us about your motivation..." className={`${inputCls} resize-none`} required />
                        </div>
                        <div>
                          <label className={labelCls}>What&apos;s one problem you think is worth solving?</label>
                          <textarea name="problem" value={formData.problem} onChange={handleChange} rows={4} placeholder="Identify a specific challenge..." className={`${inputCls} resize-none`} required />
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: Checkout ── */}
                    {currentStep === 2 && (
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div>
                            <span className="text-blue-bright font-general font-black text-[10px] tracking-[0.3em] uppercase mb-4 block border-b-2 border-blue-bright/20 pb-2">
                              WHAT YOU GET
                            </span>
                            <ul className="space-y-3">
                              {[
                                '3-day startup bootcamp: idea → MVP → pitch',
                                'Work individually and in teams',
                                'Mentor-led sessions and hands-on guidance',
                                'Learn how real startups go from idea to execution',
                                'Network with ambitious students and founders',
                              ].map((item, id) => (
                                <li key={id} className="text-xs font-bold text-navy-deep/70 flex items-start gap-2 leading-relaxed">
                                  <Zap className="w-3 h-3 text-blue-bright mt-0.5 flex-shrink-0" /> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-purple-light font-general font-black text-[10px] tracking-[0.3em] uppercase mb-4 block border-b-2 border-purple-light/20 pb-2">
                              EXPERIENCE HIGHLIGHTS
                            </span>
                            <ul className="space-y-3">
                              {[
                                'Founders behind multi-crore ventures',
                                'Top startup ecosystem access',
                                'Real-world thinking, not textbook theory',
                                'High-pressure pitch environment',
                              ].map((item, id) => (
                                <li key={id} className="text-xs font-bold text-navy-deep/70 flex items-start gap-2 leading-relaxed">
                                  <ChevronRight className="w-3 h-3 text-purple-light mt-0.5 flex-shrink-0" /> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Stats bar */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-navy-deep/10">
                          {[
                            { label: 'PRIZE POOL', value: '₹50,000' },
                            { label: 'DATES', value: '29–31 JULY' },
                            { label: 'REG. FEE', value: 'FREE' },
                          ].map((stat) => (
                            <div key={stat.label} className="border-l-4 border-blue-bright pl-4">
                              <span className="text-[9px] font-black tracking-[0.25em] text-blue-bright uppercase block mb-1">{stat.label}</span>
                              <span className="text-xl md:text-2xl font-general font-black text-navy-deep">{stat.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-4 pt-2">
                          <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-5 h-5 border-2 border-navy-deep bg-transparent cursor-pointer accent-blue-bright flex-shrink-0"
                            required
                          />
                          <label htmlFor="terms" className="text-xs font-bold text-navy-deep/60 uppercase tracking-widest cursor-pointer hover:text-navy-deep transition-colors leading-relaxed">
                            I agree to the Terms &amp; Conditions and Event Guidelines
                          </label>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Form actions */}
                <div className="mt-12 flex items-center justify-between gap-6 pt-8 border-t-2 border-navy-deep/10">
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={isLoading}
                      className="group flex items-center gap-2 text-navy-deep/50 hover:text-navy-deep transition-colors font-black text-xs tracking-widest uppercase disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK
                    </button>
                  ) : (
                    <div />
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    className="group flex items-center gap-3 px-6 md:px-10 py-5 bg-blue-bright border-4 border-navy-deep text-white font-general font-black text-xs tracking-widest uppercase hover:shadow-[8px_8px_0_0_rgba(0,3,61,1)] transition-shadow shadow-[4px_4px_0_0_rgba(0,3,61,1)] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <>
                        {currentStep === steps.length - 1 ? 'COMPLETE REGISTRATION' : 'CONTINUE'}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 md:py-48"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                className="w-20 h-20 bg-blue-bright border-4 border-navy-deep shadow-[8px_8px_0_0_rgba(0,3,61,1)] mx-auto flex items-center justify-center mb-12"
              >
                <ShieldCheck className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-[16vw] md:text-[clamp(4rem,10vw,8rem)] font-general font-black uppercase leading-[0.8] tracking-tighter text-navy-deep mb-6">
                ALL <br />
                <span className="outline-text" style={{ WebkitTextStroke: '3px var(--blue-bright)' }}>SET.</span>
              </h1>
              <p className="text-lg text-navy-deep/60 font-general mb-14 max-w-lg mx-auto leading-relaxed">
                We&apos;ve received your application. Stand by for updates from the NYFS team.
              </p>
              <div className="flex flex-col items-center gap-8">
                <div className="inline-flex items-center gap-3 px-6 md:px-10 py-5 bg-navy-deep text-white border-4 border-navy-deep font-general font-black text-xs tracking-widest uppercase shadow-[4px_4px_0_0_rgba(0,51,255,0.5)]">
                  REGISTERED SUCCESSFULLY <ShieldCheck className="w-4 h-4" />
                </div>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-navy-deep/50 hover:text-blue-bright transition-colors font-general font-black text-[11px] tracking-[0.2em] uppercase"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Vertical label */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 font-general font-black text-[8px] text-navy-deep/20 vertical-text hidden lg:block tracking-[1em] uppercase">
        NYFS 2026 // REGISTRATION
      </div>
    </div>
  );
}
