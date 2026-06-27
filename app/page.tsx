"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/preregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-light font-general selection:bg-blue-bright selection:text-white overflow-hidden flex flex-col">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0033ff0a_1px,transparent_1px),linear-gradient(to_bottom,#0033ff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
        {/* Hero glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-bright/10 blur-[120px]" />
        <div className="noise" />
      </div>

      {/* Decorative rotating shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] border-[60px] border-blue-bright/5 rounded-full pointer-events-none z-0"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-15%] left-[-10%] w-[400px] h-[400px] border-[40px] border-purple-light/10 rounded-full pointer-events-none z-0"
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-3xl text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="mb-8"
          >
            <span className="font-general font-black italic text-blue-bright tracking-tighter text-5xl md:text-7xl select-none">
              NYFS
            </span>
            <div className="mt-2 text-[10px] font-black tracking-[0.5em] uppercase text-navy-deep/40">
              Northeast Young Founders Summit
            </div>
          </motion.div>

          {/* Headline */}
          <div className="mb-6">
            <h1 className="text-[18vw] sm:text-[14vw] md:text-[clamp(5rem,14vw,11rem)] font-general font-black uppercase leading-[0.8] tracking-tighter text-navy-deep">
              COMING
            </h1>
            <h1 className="text-[18vw] sm:text-[14vw] md:text-[clamp(5rem,14vw,11rem)] font-general font-black uppercase leading-[0.8] tracking-tighter outline-text" style={{ WebkitTextStroke: "3px var(--blue-bright)" }}>
              SOON.
            </h1>
          </div>

          {/* Event info pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 border-2 border-navy-deep/20 bg-white/60 backdrop-blur-md px-5 py-2.5 mb-14 shadow-[4px_4px_0_0_rgba(0,3,61,0.08)]"
          >
            <span className="w-2 h-2 rounded-full bg-blue-bright animate-pulse" />
            <span className="font-general font-black text-sm md:text-base tracking-[0.3em] uppercase text-navy-deep/70">
              29 – 31 JULY 2026 &nbsp;·&nbsp; Guwahati
            </span>
          </motion.div>

          {/* Pre-register form */}
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 bg-blue-bright border-4 border-navy-deep shadow-[6px_6px_0_0_rgba(0,3,61,1)] flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="font-general font-black text-navy-deep text-xl uppercase tracking-widest">
                  You&apos;re on the list!
                </p>
                <p className="font-general text-navy-deep/60 text-sm max-w-sm">
                  We&apos;ll notify you as soon as registrations open. Get ready.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xl mx-auto"
              >
                <p className="font-general text-navy-deep/60 text-sm mb-6 leading-relaxed">
                  Be the first to know when registrations open.
                  <br />Drop your email and we&apos;ll reach out.
                </p>

                <div className="flex flex-col sm:flex-row gap-0 border-4 border-navy-deep shadow-[8px_8px_0_0_rgba(0,3,61,1)] bg-white">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-6 py-5 font-general font-bold text-navy-deep text-sm outline-none bg-transparent placeholder:text-navy-deep/30 border-b-4 sm:border-b-0 sm:border-r-4 border-navy-deep"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-5 bg-blue-bright text-white font-general font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-navy-deep transition-colors disabled:opacity-60 active:scale-95 flex-shrink-0"
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <>
                        PRE-REGISTER
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {status === "error" && (
                  <p className="mt-3 text-xs font-black text-red-500 tracking-widest uppercase">
                    ⚠ {errorMsg}
                  </p>
                )}


              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer strip */}
      <footer className="relative z-10 border-t border-navy-deep/10 py-5 px-6 flex items-center justify-between">
        <span className="font-general font-black italic text-blue-bright text-lg">NYFS</span>
        <span className="font-general font-black text-[9px] tracking-[0.4em] uppercase text-navy-deep/30">
          © 2026 Northeast Young Founders Summit
        </span>
      </footer>
    </div>
  );
}
