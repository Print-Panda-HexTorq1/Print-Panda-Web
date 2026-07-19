import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Last updated: June 2026. Please read these terms carefully before using the Print Panda platform."
    >
      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">1. About Print Panda</h2>
        <p>
          Print Panda is a self-service document printing platform operated by <strong>Mohan B</strong>,
          159, Nadu Street, Krishnapuram, Narayanamangalam, Polur Taluk, Thiruvannamalai District – 606905,
          Tamil Nadu, India ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>").
          By accessing or using our platform, you agree to be bound by these Terms and Conditions.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">2. Services Offered</h2>
        <p>Print Panda provides the following services:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink/75">
          <li>Document upload and processing for printing (PDF, Word, Excel, images, and other supported formats)</li>
          <li>Print configuration — color mode (B/W or Color), page selection, copies, paper size, orientation, duplex</li>
          <li>Automated page count detection and price calculation</li>
          <li>UPI-based payment facilitation between customer and print shop operator</li>
          <li>Print queue management and job status tracking</li>
        </ul>
        <div className="mt-3 rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Service Description:</strong> Document Printing &amp; Reprographic Services</p>
          <p><strong>Merchant Category Code (MCC):</strong> 2741 — Miscellaneous Publishing and Printing</p>
          <p><strong>Service Codes:</strong></p>
          <ul className="pl-4 mt-1 space-y-1 text-ink/70">
            <li>PP-BW — Black &amp; White Document Printing (per page)</li>
            <li>PP-CL — Color Document Printing (per page)</li>
            <li>PP-DX — Duplex (double-sided) Printing</li>
            <li>PP-CP — Photocopy Services</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">3. User Eligibility</h2>
        <p>
          You must be at least 18 years of age or have the consent of a parent/guardian to use this platform.
          By using Print Panda, you represent that you have the legal capacity to enter into a binding agreement.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">4. User Obligations</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink/75">
          <li>You are solely responsible for the content of documents you upload.</li>
          <li>You must not upload any documents that are illegal, obscene, defamatory, or that infringe third-party intellectual property rights.</li>
          <li>You must not attempt to reverse-engineer, disrupt, or misuse the platform in any way.</li>
          <li>You are responsible for verifying the print settings (copies, pages, color mode) before submitting a job.</li>
          <li>Payment must be made via UPI as directed. Do not attempt to falsely confirm payment.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">5. Pricing and Payment</h2>
        <p>
          Prices are displayed per page and vary by print shop. The total amount is calculated automatically
          after your document is processed. Payment is made directly to the shop operator via UPI. Print Panda
          does not store or process your UPI credentials. All payments are handled through India's UPI
          infrastructure.
        </p>
        <p className="mt-2">
          Pricing is set by individual shop operators and may vary. The platform displays the price clearly
          before payment is requested.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">6. Delivery of Service</h2>
        <p>
          Once payment is verified and the job enters the print queue, the shop operator will print and
          prepare your document. Service delivery is in-person at the print shop location. Print Panda does
          not ship or courier printed documents. The turnaround time depends on the print shop's queue.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">7. Intellectual Property</h2>
        <p>
          All content, branding, and technology on the Print Panda platform are owned by Mohan B.
          You may not reproduce, distribute, or create derivative works without prior written permission.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">8. Limitation of Liability</h2>
        <p>
          Print Panda acts as a technology facilitator between customers and print shop operators.
          We are not liable for print quality, delays, or disputes between the customer and the operator
          beyond what is described in our Refund Policy. Our total liability in any case shall not exceed
          the amount paid for the specific print job in question.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate access to the platform if a user violates these terms,
          uploads illegal content, or abuses the system.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
          jurisdiction of the courts in Thiruvannamalai, Tamil Nadu, India.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">11. Contact</h2>
        <div className="rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Mohan B</strong></p>
          <p>159, Nadu Street, Krishnapuram, Narayanamangalam, Polur Taluk,</p>
          <p>Thiruvannamalai District – 606905, Tamil Nadu, India</p>
          <p>Phone: +91 82203 48218</p>
          <p>Email: support@printpanda.in</p>
        </div>
      </section>
    </LegalLayout>
  );
}
