import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Contact() {
  return (
    <LegalLayout
      title="Contact Us"
      subtitle="We're here to help. Reach out for support, refund requests, or general enquiries."
    >
      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Get In Touch</h2>
        <p>
          For any questions about your print job, payment issues, refund requests, or general
          platform enquiries, please contact us using the details below. We respond within
          48 hours on business days.
        </p>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 mt-2">
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/45 mb-2">Email Support</p>
            <p className="font-semibold text-ink">Mohan B</p>
            <p className="text-ink/70 text-sm">support@printpanda.in</p>
            <p className="mt-1 text-xs text-ink/55">For job issues, payments, refunds</p>
            <p className="mt-2 font-semibold text-ink">+91 82203 48218</p>
            <p className="mt-1 text-xs text-ink/55">Response time: Within 48 hours</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/45 mb-2">Registered Address</p>
            <p className="text-sm text-ink leading-relaxed">
              <strong>Mohan B</strong><br />
              159, Nadu Street, Krishnapuram,<br />
              Narayanamangalam, Polur Taluk,<br />
              Thiruvannamalai District – 606905<br />
              Tamil Nadu, India
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Common Queries</h2>
        <div className="space-y-3">
          {[
            {
              q: "My payment was deducted but no job was created.",
              a: "Email us at support@printpanda.in with your UPI transaction reference (UTR number), the amount, and the date. We will investigate and process a refund within 7 business days."
            },
            {
              q: "I paid but the operator says they haven't received the job.",
              a: "Please share your job token (PP-XXXX) with the operator, or contact us with the token and your UPI reference. We can verify from the backend."
            },
            {
              q: "I uploaded the wrong file. Can I cancel?",
              a: "If the job hasn't started printing yet, contact the shop operator immediately. For platform-level support, email us with your job token."
            },
            {
              q: "I want a refund for a completed job.",
              a: "Refunds for fully printed jobs are generally not available unless there was a verified technical error. Please see our Refund Policy for details."
            },
            {
              q: "How do I get a QR code for my print shop?",
              a: "If you are a print shop operator looking to set up Print Panda, please email support@printpanda.in with your shop details."
            }
          ].map((item, index) => (
            <div key={index} className="rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-sm font-semibold text-ink">{item.q}</p>
              <p className="mt-1 text-sm text-ink/65">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Business Information</h2>
        <div className="rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Platform:</strong> Print Panda (Self-Service Print Hub)</p>
          <p><strong>Owner / Operator:</strong> Mohan B</p>
          <p><strong>Service:</strong> Document Printing &amp; Reprographic Services</p>
          <p><strong>MCC:</strong> 2741 — Miscellaneous Publishing and Printing</p>
          <p><strong>Address:</strong> 159, Nadu Street, Krishnapuram, Narayanamangalam, Polur Taluk, Thiruvannamalai – 606905, TN</p>
          <p><strong>Phone:</strong> +91 82203 48218</p>
          <p><strong>Email:</strong> support@printpanda.in</p>
        </div>
      </section>
    </LegalLayout>
  );
}
