import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="font-display text-lg font-bold">Print Panda</h2>
            <p className="mt-2 text-sm text-paper/60 leading-relaxed">
              A self-service print hub by Mohan B. Upload your documents, select print settings, pay via UPI, and collect your prints — fast and simple.
            </p>
            <div className="mt-3 text-xs text-paper/45 leading-relaxed">
              <p>Mohan B</p>
              <p>159, Nadu Street, Krishnapuram,</p>
              <p>Narayanamangalam, Polur Taluk,</p>
              <p>Thiruvannamalai District – 606905</p>
              <p>Tamil Nadu, India</p>
              <p className="mt-1">+91 82203 48218</p>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-paper/50 mb-3">Legal & Policies</h3>
            <ul className="space-y-2 text-sm text-paper/75">
              <li><Link to="/about" className="hover:text-mint transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="hover:text-mint transition-colors">Pricing</Link></li>
              <li><Link to="/terms" className="hover:text-mint transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-mint transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-mint transition-colors">Refund &amp; Cancellation Policy</Link></li>
              <li><Link to="/contact" className="hover:text-mint transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-paper/50 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-paper/75">
              <li className="font-semibold text-paper">Mohan B</li>
              <li>
                <a href="tel:+918220348218" className="hover:text-mint transition-colors">
                  +91 82203 48218
                </a>
              </li>
              <li>
                <a href="mailto:support@printpanda.in" className="hover:text-mint transition-colors">
                  support@printpanda.in
                </a>
              </li>
              <li className="text-paper/55 text-xs leading-relaxed">
                Service: Document Printing &amp; Copying<br />
                MCC Code: 2741 (Misc. Printing &amp; Publishing)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-paper/10 pt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-paper/40">
          <p>© {new Date().getFullYear()} Print Panda · Mohan B. All rights reserved.</p>
          <p>Thiruvannamalai, Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
}
