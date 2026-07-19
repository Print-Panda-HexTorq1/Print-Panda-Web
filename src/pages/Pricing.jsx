import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LegalLayout from "../components/LegalLayout";
import Footer from "../components/Footer";

const PLANS = [
  {
    name: "Starter",
    tag: null,
    monthlyPrice: 499,
    yearlyPrice: 399,
    description: "Perfect for a single print shop just getting started with digital queue management.",
    color: "border-ink/12 bg-white",
    btnClass: "border border-ink/20 bg-white text-ink hover:bg-ink/5",
    features: [
      { label: "1 Shop",                   ok: true },
      { label: "1 Operator / Desktop User", ok: true },
      { label: "Up to 100 jobs / month",    ok: true },
      { label: "Customer upload portal",    ok: true },
      { label: "UPI payment integration",   ok: true },
      { label: "QR code per operator",      ok: true },
      { label: "Real-time print queue",     ok: true },
      { label: "Job status tracking",       ok: true },
      { label: "Basic analytics",           ok: true },
      { label: "Multiple operators",        ok: false },
      { label: "Unlimited jobs",            ok: false },
      { label: "Advanced analytics",        ok: false },
      { label: "Multiple shops",            ok: false },
      { label: "Priority support",          ok: false },
      { label: "Custom branding",           ok: false },
    ],
  },
  {
    name: "Professional",
    tag: "Most Popular",
    monthlyPrice: 1499,
    yearlyPrice: 1199,
    description: "For growing shops with multiple operators and higher print volume needs.",
    color: "border-mint bg-ink text-paper",
    btnClass: "bg-mint text-ink hover:opacity-90",
    features: [
      { label: "1 Shop",                   ok: true },
      { label: "Up to 5 Operators",        ok: true },
      { label: "Unlimited jobs",           ok: true },
      { label: "Customer upload portal",   ok: true },
      { label: "UPI payment integration",  ok: true },
      { label: "QR code per operator",     ok: true },
      { label: "Real-time print queue",    ok: true },
      { label: "Job status tracking",      ok: true },
      { label: "Full analytics dashboard", ok: true },
      { label: "Multiple operators",       ok: true },
      { label: "Per-page pricing control", ok: true },
      { label: "Advanced analytics",       ok: true },
      { label: "Multiple shops",           ok: false },
      { label: "Priority support",         ok: true },
      { label: "Custom branding",          ok: false },
    ],
  },
  {
    name: "Business",
    tag: "Enterprise",
    monthlyPrice: 3999,
    yearlyPrice: 3199,
    description: "For chains, franchise shops, or businesses managing multiple print locations.",
    color: "border-ink/12 bg-white",
    btnClass: "border border-ink/20 bg-white text-ink hover:bg-ink/5",
    features: [
      { label: "Unlimited Shops",           ok: true },
      { label: "Unlimited Operators",       ok: true },
      { label: "Unlimited jobs",            ok: true },
      { label: "Customer upload portal",    ok: true },
      { label: "UPI payment integration",   ok: true },
      { label: "QR code per operator",      ok: true },
      { label: "Real-time print queue",     ok: true },
      { label: "Job status tracking",       ok: true },
      { label: "Full analytics dashboard",  ok: true },
      { label: "Multiple operators",        ok: true },
      { label: "Per-page pricing control",  ok: true },
      { label: "Advanced analytics",        ok: true },
      { label: "Multiple shops",            ok: true },
      { label: "Priority & dedicated support", ok: true },
      { label: "Custom branding / white-label", ok: true },
    ],
  },
];

const ALL_FEATURES = [
  {
    section: "Core Platform",
    items: [
      { label: "Customer upload portal (web)",         desc: "Customers scan a QR code and upload documents from any phone browser — no app needed." },
      { label: "UPI payment integration",              desc: "Automated UPI deep-link generation. Customers pay via GPay, PhonePe, or any UPI app directly to your account." },
      { label: "QR code per operator",                 desc: "Each desktop user gets a unique upload URL and QR code. Customers are tied to their specific operator." },
      { label: "Real-time print queue",                desc: "Jobs appear in the operator's desktop queue instantly after payment is confirmed. No manual entry needed." },
      { label: "Document processing",                  desc: "Supports PDF, Word, Excel, PowerPoint, PNG, JPG, WEBP, text files, and more. Page count detected automatically." },
    ],
  },
  {
    section: "Print Settings",
    items: [
      { label: "Color mode (B/W and Color)",           desc: "Customers choose black & white or full color. Priced separately per page." },
      { label: "Page selection",                       desc: "Customers can print all pages or a custom range (e.g. 1-5, 7, 10-12)." },
      { label: "Copies",                               desc: "Multiple copies supported. Total price calculated automatically." },
      { label: "Paper size (A4, Letter)",              desc: "Customers select paper size at upload time." },
      { label: "Orientation & duplex",                 desc: "Portrait/landscape and single/double-sided printing options." },
    ],
  },
  {
    section: "Analytics & Reporting",
    items: [
      { label: "Basic analytics",                      desc: "Total jobs, printed count, failed jobs, and revenue summary." },
      { label: "Advanced analytics (Pro+)",            desc: "Time-range filters (today, 7d, 30d, all time). Per-shop breakdown. Revenue by color mode." },
      { label: "Recent print logs",                    desc: "Detailed audit log — which operator printed, which job, at what time, with what credentials." },
    ],
  },
  {
    section: "Management",
    items: [
      { label: "Admin dashboard",                      desc: "Web-based admin panel to manage shops, users, pricing, and view analytics." },
      { label: "Per-shop UPI & pricing",               desc: "Each shop has its own UPI ID and per-page rates for B/W and color." },
      { label: "User / operator management",           desc: "Create, edit, delete desktop operators. Change passwords. Generate QR codes." },
      { label: "Job history per customer",             desc: "Customers see their own upload and payment history stored locally in their browser." },
    ],
  },
];

function Check({ ok, dark }) {
  if (ok) {
    return (
      <span className={`text-base font-bold ${dark ? "text-mint" : "text-emerald-500"}`}>✓</span>
    );
  }
  return <span className="text-base text-ink/20">–</span>;
}

function PlanCard({ plan, yearly, index }) {
  const isPro = plan.name === "Professional";
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
  const dark = isPro;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-3xl border-2 p-6 flex flex-col ${plan.color} ${isPro ? "shadow-2xl scale-[1.03] z-10" : "shadow-sm"}`}
    >
      {plan.tag && (
        <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest ${
          isPro ? "bg-mint text-ink" : "bg-ink text-paper"
        }`}>
          {plan.tag}
        </span>
      )}

      <div>
        <p className={`font-display text-lg font-bold ${dark ? "text-paper" : "text-ink"}`}>{plan.name}</p>
        <p className={`mt-1 text-xs leading-relaxed ${dark ? "text-paper/55" : "text-ink/50"}`}>{plan.description}</p>
      </div>

      <div className="mt-5">
        <div className="flex items-end gap-1">
          <span className={`font-display text-4xl font-black ${dark ? "text-paper" : "text-ink"}`}>
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className={`mb-1.5 text-sm ${dark ? "text-paper/50" : "text-ink/40"}`}>/mo</span>
        </div>
        {yearly && (
          <p className={`mt-0.5 text-xs ${dark ? "text-mint" : "text-emerald-600"}`}>
            Save ₹{((plan.monthlyPrice - plan.yearlyPrice) * 12).toLocaleString("en-IN")}/yr
          </p>
        )}
      </div>

      <Link
        to="/admin/login?signup=1"
        className={`mt-5 rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${plan.btnClass}`}
      >
        Get Started
      </Link>

      <ul className="mt-6 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 flex-shrink-0 w-4 text-center">
              <Check ok={f.ok} dark={dark} />
            </span>
            <span className={f.ok ? (dark ? "text-paper/80" : "text-ink/75") : (dark ? "text-paper/28" : "text-ink/28")}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Navbar */}
      <header className="border-b border-ink/10 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-ink hover:text-alert transition-colors">
            Print Panda
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-sm text-ink/60 hover:text-ink transition-colors hidden md:block">Contact</Link>
            <Link to="/admin/login?signup=1" className="rounded-xl bg-mint px-4 py-2 text-sm font-semibold text-ink hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">Pricing</span>
            <h1 className="mt-2 font-display text-4xl font-black text-ink md:text-5xl">Simple, Transparent Plans</h1>
            <p className="mt-3 text-ink/50 max-w-lg mx-auto text-sm leading-relaxed md:text-base">
              All plans include the full Print Panda platform. Pick the size that fits your shop.
            </p>

            {/* Billing toggle */}
            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-ink/12 bg-white px-4 py-2 shadow-sm">
              <span className={`text-sm font-medium ${!yearly ? "text-ink" : "text-ink/40"}`}>Monthly</span>
              <button
                type="button"
                onClick={() => setYearly((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${yearly ? "bg-mint" : "bg-ink/15"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
              <span className={`text-sm font-medium ${yearly ? "text-ink" : "text-ink/40"}`}>
                Yearly
                <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </section>

        {/* Plan cards */}
        <section className="pb-16 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-5 md:grid-cols-3 items-start">
              {PLANS.map((plan, i) => (
                <PlanCard key={plan.name} plan={plan} yearly={yearly} index={i} />
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-ink/38">
              All prices are in Indian Rupees (INR) and exclusive of GST. · Cancel anytime.
            </p>
          </div>
        </section>

        {/* Feature breakdown */}
        <section className="py-16 bg-white border-t border-ink/8">
          <div className="mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mint">Full Feature List</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink">Everything Included</h2>
              <p className="mt-2 text-ink/48 text-sm max-w-md mx-auto">Every plan runs on the same platform. Here's what Print Panda actually does.</p>
            </motion.div>

            <div className="space-y-8">
              {ALL_FEATURES.map((section, si) => (
                <motion.div
                  key={section.section}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: si * 0.06 }}
                >
                  <h3 className="font-display font-bold text-ink text-lg mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-5 rounded-full bg-mint inline-block" />
                    {section.section}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-ink/8 bg-paper/60 p-4">
                        <p className="text-sm font-semibold text-ink">{item.label}</p>
                        <p className="mt-1 text-xs text-ink/52 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-paper border-t border-ink/8">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-8">Common Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is there a free trial?",
                  a: "Yes — sign up and explore the platform. Contact us at support@printpanda.in to activate a 14-day free trial on any paid plan."
                },
                {
                  q: "Can I change my plan later?",
                  a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect from the next billing cycle."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept UPI, Net Banking, and major debit/credit cards for platform subscription payments."
                },
                {
                  q: "What happens to my data if I cancel?",
                  a: "Your job history and shop data are retained for 30 days after cancellation, giving you time to export or review."
                },
                {
                  q: "Is GST included in the prices shown?",
                  a: "No. Prices shown are exclusive of GST. Applicable GST (18%) will be added at checkout."
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-ink/10 bg-white p-5">
                  <p className="font-semibold text-ink text-sm">{item.q}</p>
                  <p className="mt-1.5 text-sm text-ink/58 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-ink text-center px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-paper">Ready to modernise your print shop?</h2>
            <p className="mt-3 text-paper/50 text-sm max-w-md mx-auto">Get started in minutes. No hardware needed — just your existing printer and a phone with UPI.</p>
            <div className="mt-7 flex flex-wrap gap-4 justify-center">
              <Link to="/admin/login?signup=1" className="rounded-xl bg-mint px-7 py-3.5 font-semibold text-ink hover:opacity-90 transition-opacity shadow-xl shadow-mint/20">
                Create Free Account
              </Link>
              <Link to="/contact" className="rounded-xl border border-paper/20 px-7 py-3.5 font-medium text-paper/75 hover:bg-paper/10 transition-colors">
                Talk to Us →
              </Link>
            </div>
            <p className="mt-6 text-xs text-paper/30">
              Operated by Mohan B · Thiruvannamalai, Tamil Nadu · +91 82203 48218
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
