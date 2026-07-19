import React, { useRef, useCallback, useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const PrintUniverse = lazy(() => import("../components/PrintUniverse"));

// ── Sticky Navbar ─────────────────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-ink/96 backdrop-blur-md border-b border-paper/10 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-mint flex items-center justify-center shadow-lg shadow-mint/30">
            <span className="font-display font-bold text-ink text-sm leading-none">P</span>
          </div>
          <span className="font-display font-bold text-paper text-lg tracking-tight">
            Print Panda
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/about"   className="hidden md:block text-sm text-paper/65 hover:text-paper transition-colors">About</Link>
          <Link to="/pricing" className="hidden md:block text-sm text-paper/65 hover:text-paper transition-colors">Pricing</Link>
          <Link to="/contact" className="hidden md:block text-sm text-paper/65 hover:text-paper transition-colors">Contact</Link>
          <Link to="/admin"
            className="rounded-xl bg-mint px-4 py-2 text-sm font-semibold text-ink hover:opacity-90 transition-opacity shadow-lg shadow-mint/20"
          >
            Control Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── How-It-Works step ─────────────────────────────────────────────────────────
function Step({ number, icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative rounded-3xl border border-ink/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* connector line on desktop */}
      <div className="hidden md:block absolute top-10 -right-6 w-12 border-t-2 border-dashed border-ink/10 z-10" />

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-ink flex flex-col items-center justify-center shadow-lg">
          <span className="font-display font-black text-mint text-xs leading-none">{number}</span>
        </div>
        <div>
          <div className="text-2xl mb-2 leading-none">{icon}</div>
          <h3 className="font-display font-bold text-ink text-lg leading-snug">{title}</h3>
          <p className="mt-1.5 text-sm text-ink/58 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function Feature({ icon, title, description, delay, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-2xl border p-5 transition-shadow hover:shadow-lg ${
        accent
          ? "border-mint/30 bg-mint/8 hover:bg-mint/12"
          : "border-ink/10 bg-white"
      }`}
    >
      <div className="text-3xl mb-3 leading-none">{icon}</div>
      <h3 className="font-display font-semibold text-ink text-base mb-1.5">{title}</h3>
      <p className="text-sm text-ink/58 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────────────────────
function Stat({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <p className="font-display text-3xl font-black text-ink md:text-4xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/45">{label}</p>
    </motion.div>
  );
}

// ── Main Landing page ─────────────────────────────────────────────────────────
export default function Landing() {
  const mouse    = useRef([0, 0]);
  const heroRef  = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mouse.current = [
      ((e.clientX - r.left) / r.width)  * 2 - 1,
      -(((e.clientY - r.top) / r.height) * 2 - 1),
    ];
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar scrolled={scrolled} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        className="relative h-screen overflow-hidden"
        style={{ background: "linear-gradient(135deg,#070d15 0%,#101820 55%,#0e1d28 100%)" }}
      >
        {/* 3D canvas — full section background */}
        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          <Suspense fallback={null}>
            <PrintUniverse mouse={mouse} />
          </Suspense>
        </div>

        {/* Left gradient overlay so text stays readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(7,13,21,0.94) 0%, rgba(7,13,21,0.72) 38%, rgba(7,13,21,0.18) 66%, transparent 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(7,13,21,0.7))" }}
        />

        {/* Text column */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 h-full flex items-center">
          <div className="max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">
                Self-Service Print Hub
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="mt-5 font-display font-black text-paper leading-[1.05] text-5xl md:text-6xl lg:text-7xl"
            >
              Upload.
              <br />
              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: "2px #32d1a0",
                  textShadow: "0 0 40px rgba(50,209,160,0.35)",
                }}
              >
                Pay.
              </span>
              <br />
              Print.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.26 }}
              className="mt-5 text-[15px] text-paper/62 leading-relaxed max-w-[420px] md:text-base"
            >
              Drop your document, choose print settings, and pay via UPI — your job enters the print queue automatically. Collect when it's ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/admin/login?signup=1"
                className="rounded-xl bg-mint px-6 py-3 font-semibold text-ink text-sm hover:opacity-92 active:scale-95 transition-all shadow-xl shadow-mint/25"
              >
                Get Started Free
              </Link>
              <Link
                to="/admin"
                className="rounded-xl border border-paper/22 bg-paper/8 px-6 py-3 font-semibold text-paper text-sm hover:bg-paper/16 transition-colors backdrop-blur-sm"
              >
                Control Panel →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              {["PDF", "Word", "Excel", "PowerPoint", "Images", "Text"].map((f) => (
                <span key={f} className="text-xs text-paper/32 font-medium">{f}</span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="h-8 w-5 rounded-full border border-paper/22 flex items-start justify-center pt-1.5"
          >
            <div className="h-1.5 w-1 rounded-full bg-paper/45" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">Simple Process</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">How It Works</h2>
            <p className="mt-3 text-ink/50 max-w-md mx-auto text-sm leading-relaxed">
              Three steps from document to print — no app, no account, no queuing.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            <Step delay={0}    number="1" icon="📱" title="Scan & Upload"
              description="Scan the QR code at your shop or open your unique link. Upload any document — PDF, Word, image, PowerPoint, and more." />
            <Step delay={0.12} number="2" icon="💳" title="Choose & Pay"
              description="Select copies, color mode, paper size. Your price is calculated instantly. Pay with GPay, PhonePe, or any UPI app in one tap." />
            <Step delay={0.24} number="3" icon="🖨️" title="Collect Your Print"
              description="Your job enters the shop queue. Track it live from your phone. When it's ready, collect your prints from the counter." />
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-paper">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">Everything You Need</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">Built for Modern Printing</h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature delay={0}    icon="📄" title="Any Document Format"  accent
              description="PDF, Word, Excel, PowerPoint, PNG, JPG, text files — if you can view it, you can print it." />
            <Feature delay={0.06} icon="⚡" title="Instant UPI Payment"
              description="Pay directly to the shop via GPay, PhonePe, or any UPI app. No third-party gateway, no delays." />
            <Feature delay={0.12} icon="📊" title="Real-Time Queue"      accent
              description="Track your job — queued, printing, printed. Live status updates every 2 seconds on your phone." />
            <Feature delay={0.18} icon="💰" title="Transparent Pricing"
              description="Per-page rates shown before you pay. B/W and color pricing set by your shop — zero surprises." />
            <Feature delay={0.24} icon="📋" title="Job History"          accent
              description="Your upload history is stored in your browser. Review past jobs, amounts, and status anytime." />
            <Feature delay={0.30} icon="📱" title="No App Required"
              description="Works on any smartphone browser. No installation. No sign-up. Scan and print in under a minute." />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-ink/8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Stat delay={0}    value="30+"    label="Formats Supported" />
            <Stat delay={0.08} value="100%"   label="UPI Native" />
            <Stat delay={0.16} value="< 2s"   label="Upload Response" />
            <Stat delay={0.24} value="24 / 7" label="Queue Available" />
          </div>
        </div>
      </section>

      {/* ── FOR SHOP OWNERS CTA ──────────────────────────────────────────────── */}
      <section className="py-22 bg-ink" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">
              For Print Shop Owners
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-paper md:text-4xl lg:text-5xl leading-tight">
              Modernise Your<br />Print Shop Today
            </h2>
            <p className="mt-5 text-paper/55 max-w-lg mx-auto text-sm leading-relaxed md:text-base">
              Give every operator their unique QR code. Customers upload directly and pay via UPI. You manage the entire print queue from the desktop app — no more USB drives, no more lost jobs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                to="/admin/login?signup=1"
                className="rounded-xl bg-mint px-7 py-3.5 font-semibold text-ink text-sm hover:opacity-90 transition-opacity shadow-xl shadow-mint/22"
              >
                Get Your Shop on Print Panda
              </Link>
              <Link
                to="/about"
                className="rounded-xl border border-paper/20 px-7 py-3.5 font-medium text-paper/78 text-sm hover:bg-paper/10 transition-colors"
              >
                Learn More →
              </Link>
            </div>

            {/* Owner details */}
            <p className="mt-10 text-xs text-paper/30">
              Operated by <strong className="text-paper/50">Mohan B</strong> · Thiruvannamalai, Tamil Nadu, India
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── LEGAL QUICK LINKS ────────────────────────────────────────────────── */}
      <div className="bg-ink/95 border-t border-paper/10 py-5">
        <div className="mx-auto max-w-5xl px-4 flex flex-wrap justify-center gap-5 text-xs text-paper/38">
          {[
            ["/about",   "About"],
            ["/pricing", "Pricing"],
            ["/terms",   "Terms & Conditions"],
            ["/privacy", "Privacy Policy"],
            ["/refund",  "Refund Policy"],
            ["/contact", "Contact Us"],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="hover:text-paper/65 transition-colors">{label}</Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
