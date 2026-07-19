import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function LegalLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-ink/10 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-display font-bold text-ink hover:text-alert transition-colors">
            Print Panda
          </Link>
          <span className="text-ink/30">/</span>
          <span className="text-sm text-ink/60">{title}</span>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink/55">{subtitle}</p>}
        <div className="mt-6 prose-sm text-ink/80 leading-relaxed space-y-5">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
