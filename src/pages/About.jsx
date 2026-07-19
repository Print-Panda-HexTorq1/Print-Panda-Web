import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function About() {
  return (
    <LegalLayout
      title="About Us"
      subtitle="Last updated: June 2026"
    >
      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Who We Are</h2>
        <p>
          Print Panda is a self-service document printing platform operated by <strong>Mohan B</strong>, based in
          Thiruvannamalai, Tamil Nadu, India. We provide an easy-to-use web portal that allows customers to upload
          their documents, configure print settings, make payments via UPI, and have their files printed at
          participating print shops — without needing to wait in queues or manually hand over files.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Our Service</h2>
        <p>
          Print Panda bridges the gap between customers and local print shop operators. Through our platform:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink/75">
          <li>Customers scan a QR code or open a unique link to access the upload portal for their local print shop.</li>
          <li>They upload supported document formats (PDF, Word, Excel, images, etc.).</li>
          <li>They select print preferences such as color mode, number of copies, page selection, paper size, and orientation.</li>
          <li>A price is calculated automatically based on the document's page count and the shop's per-page rates.</li>
          <li>The customer pays via UPI directly to the print shop operator.</li>
          <li>The document enters the shop's print queue and is printed by the operator.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Service Category</h2>
        <p>
          Print Panda operates as a <strong>document printing and reprographic services</strong> platform.
        </p>
        <div className="mt-3 rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Business Name:</strong> Print Panda</p>
          <p><strong>Legal Owner:</strong> Mohan B</p>
          <p><strong>Service Type:</strong> Document Printing, Copying &amp; Reprographic Services</p>
          <p><strong>Merchant Category Code (MCC):</strong> 2741 — Miscellaneous Publishing and Printing</p>
          <p><strong>Business Model:</strong> B2C — Customers pay print shops via the platform</p>
          <p><strong>Payment Method:</strong> UPI (Unified Payments Interface)</p>
          <p><strong>Currency:</strong> Indian Rupees (INR)</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Our Mission</h2>
        <p>
          We believe printing should be simple. No USB drives, no email attachments to shop owners, no waiting.
          Print Panda makes the entire experience seamless — customers get a token, pay from their phone, and
          collect their prints. Print shop operators get a modern, organised queue on their desktop app.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Business Details</h2>
        <div className="rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Owner / Proprietor:</strong> Mohan B</p>
          <p><strong>Registered Address:</strong></p>
          <p className="pl-4 text-ink/70">
            159, Nadu Street, Krishnapuram,<br />
            Narayanamangalam, Polur Taluk,<br />
            Thiruvannamalai District – 606905<br />
            Tamil Nadu, India
          </p>
          <p><strong>Phone:</strong> +91 82203 48218</p>
          <p><strong>Email:</strong> support@printpanda.in</p>
          <p><strong>Platform URL:</strong> https://printpanda.in</p>
        </div>
      </section>
    </LegalLayout>
  );
}
