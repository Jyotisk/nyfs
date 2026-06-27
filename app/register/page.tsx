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
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

const steps = [
  { id: 'personal', title: 'PERSONAL INFO', icon: <Users className="w-5 h-5" /> },
  { id: 'mission', title: 'MISSION & PITCH', icon: <Target className="w-5 h-5" /> },
  { id: 'checkout', title: 'CHECKOUT', icon: <ShieldCheck className="w-5 h-5" /> }
];

const REGISTRATION_FEE = 999;

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
    password: '',
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
        const orderRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: REGISTRATION_FEE }),
        });
        const orderData = await orderRes.json();
        if (orderData.error) throw new Error(orderData.error);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: 'INR',
          name: 'NYFS BOOTCAMP',
          description: 'Registration Fee for NYFS 2026',
          order_id: orderData.id,
          handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string }) {
            setIsLoading(true);
            try {
              const signUpRes = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: formData.email,
                  password: formData.password,
                  full_name: formData.fullName,
                  whatsapp: formData.whatsapp,
                  institution: formData.institution,
                  grade: formData.grade,
                  city: formData.city,
                  motivation: formData.motivation,
                  problem: formData.problem,
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                }),
              });
              const signUpData = await signUpRes.json().catch(() => ({}));
              if (!signUpRes.ok) throw new Error(signUpData.error || 'Registration failed.');
              setIsSubmitted(true);
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Registration failed. Please contact support.';
              setError(msg);
            } finally {
              setIsLoading(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.whatsapp,
          },
          theme: { color: '#0033FF' },
          modal: { ondismiss: () => setIsLoading(false) }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: { error: { description: string } }) {
          setError(response.error.description);
          setIsLoading(false);
        });
        rzp.open();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Payment initiation failed.';
        setError(msg);
        setIsLoading(false);
      }
    } else {
      goNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-light text-navy-deep font-general selection:bg-blue-bright selection:text-white overflow-x-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0033ff08_1px,transparent_1px),linear-gradient(to_bottom,#0033ff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="noise" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 bg-gray-light/95 backdrop-blur-2xl border-b border-navy-deep/10">
        <Link href="/" className="font-general font-black italic text-blue-bright tracking-tighter text-2xl md:text-3xl select-none hover:scale-105 transition-transform">
          NYFS
        </Link>
        <Link href="/login" className="font-general font-black text-[11px] tracking-[0.2em] uppercase text-navy-deep/70 hover:text-blue-bright transition-colors">
          LOGIN
        </Link>
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
              {/* Header */}
              <div className="mb-12">
                <span className="text-blue-bright font-general font-bold text-xs tracking-[0.5em] uppercase mb-4 block">
                  NYFS 2026
                </span>
                <h1 className="text-[16vw] md:text-[clamp(4rem,12vw,9rem)] font-general font-black uppercase leading-[0.8] tracking-tighter text-navy-deep">
                  REGISTER.
                </h1>
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
                          {step.icon}
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
                            <label className={labelCls}>Password</label>
                            <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className={inputCls} required />
                          </div>
                          <div>
                            <label className={labelCls}>WhatsApp Number</label>
                            <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} type="tel" placeholder="+91 00000 00000" className={inputCls} required />
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
                        <div>
                          <label className={labelCls}>City</label>
                          <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="e.g. Guwahati, Shillong" className={inputCls} required />
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
                            { label: 'REG. FEE', value: `₹${REGISTRATION_FEE}` },
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
                      className="flex items-center gap-2 text-navy-deep/50 hover:text-navy-deep transition-colors font-black text-xs tracking-widest uppercase disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" /> BACK
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-3 px-10 py-5 bg-blue-bright border-4 border-navy-deep text-white font-general font-black text-xs tracking-widest uppercase hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(0,3,61,1)] transition-all shadow-[4px_4px_0_0_rgba(0,3,61,1)] disabled:opacity-50 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <>
                        {currentStep === steps.length - 1 ? 'CONFIRM & PAY' : 'CONTINUE'}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
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
              <div className="w-20 h-20 bg-blue-bright border-4 border-navy-deep shadow-[8px_8px_0_0_rgba(0,3,61,1)] mx-auto flex items-center justify-center mb-12">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-[16vw] md:text-[clamp(4rem,10vw,8rem)] font-general font-black uppercase leading-[0.8] tracking-tighter text-navy-deep mb-6">
                ALL <br />
                <span className="outline-text" style={{ WebkitTextStroke: '3px var(--blue-bright)' }}>SET.</span>
              </h1>
              <p className="text-lg text-navy-deep/60 font-general mb-14 max-w-lg mx-auto leading-relaxed">
                We&apos;ve received your application. Stand by for updates from the NYFS team.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-5 bg-navy-deep text-white border-4 border-navy-deep font-general font-black text-xs tracking-widest uppercase hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(0,51,255,0.5)] transition-all shadow-[4px_4px_0_0_rgba(0,51,255,0.5)] active:scale-95"
              >
                ACCESS DASHBOARD <ChevronRight className="w-4 h-4" />
              </Link>
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
