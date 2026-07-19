import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Refund() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      subtitle="Last updated: June 2026. Please read this policy before making a payment."
    >
      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">1. Overview</h2>
        <p>
          Print Panda operates as a self-service document printing platform. Once you upload a document,
          configure settings, and initiate payment, the following refund and cancellation terms apply.
          This policy is offered by <strong>Mohan B</strong> (Print Panda), 159, Nadu Street, Krishnapuram,
          Narayanamangalam, Polur Taluk, Thiruvannamalai District – 606905, Tamil Nadu, India.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">2. Cancellation Policy</h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-ink/10 bg-white p-4">
            <p className="font-semibold text-ink text-sm">Before Payment</p>
            <p className="mt-1 text-sm text-ink/70">
              You may cancel your print job at any time before making a UPI payment. No charges apply.
              Your uploaded file will be removed from the queue automatically.
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-4">
            <p className="font-semibold text-ink text-sm">After Payment — Before Printing Starts</p>
            <p className="mt-1 text-sm text-ink/70">
              If you have paid but the job has not yet started printing, contact the print shop operator
              directly or reach us at support@printpanda.in. Cancellation at this stage may be eligible
              for a refund at the operator's discretion.
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-4">
            <p className="font-semibold text-ink text-sm">After Printing Has Started or Completed</p>
            <p className="mt-1 text-sm text-ink/70">
              Once a job is in "Printing" or "Printed" status, cancellation is not possible as the
              physical service has commenced. Refunds at this stage are subject to the conditions in
              Section 3.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">3. Refund Conditions</h2>
        <p>Refunds may be issued in the following cases:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-ink/75">
          <li>
            <strong>Double payment / duplicate charge:</strong> If your UPI payment was debited twice
            for the same job, a full refund of the duplicate amount will be processed within
            5–7 business days.
          </li>
          <li>
            <strong>Payment deducted but job not created:</strong> If your payment was successful
            but no job appeared in your session, contact us with your UPI transaction reference
            and we will investigate and issue a refund within 5–7 business days.
          </li>
          <li>
            <strong>Print quality issue (verified):</strong> If your document was printed with a
            verified technical defect caused by our system (not your document content or settings),
            a reprint or partial refund may be offered at the operator's discretion.
          </li>
          <li>
            <strong>Operator rejection before printing:</strong> If the shop operator rejects your
            job for any reason before printing begins, a full refund will be initiated within
            5–7 business days.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">4. Non-Refundable Cases</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink/75">
          <li>Jobs that have been fully printed and collected as per your selected settings.</li>
          <li>Incorrect settings (wrong pages, color mode, copies) selected by the customer.</li>
          <li>Issues arising from the customer's document content (formatting errors, blank pages, etc.).</li>
          <li>Change of mind after the job has entered the print queue and payment is confirmed.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">5. How to Request a Refund</h2>
        <p>To request a refund, email us at <strong>support@printpanda.in</strong> with:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink/75">
          <li>Your Print Panda job token / job ID (e.g. PP-123)</li>
          <li>UPI transaction reference number (UTR)</li>
          <li>Date and amount of payment</li>
          <li>Reason for the refund request</li>
        </ul>
        <p className="mt-2">
          We aim to acknowledge all refund requests within 48 hours and resolve within 7 business days.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">6. Refund Method</h2>
        <p>
          Approved refunds are processed back to the original UPI ID used for payment.
          Refunds typically appear within 5–7 business days depending on your bank.
          Print Panda does not charge any fee for processing refunds.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">7. Contact for Disputes</h2>
        <div className="rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Mohan B — Print Panda</strong></p>
          <p>159, Nadu Street, Krishnapuram, Narayanamangalam, Polur Taluk,</p>
          <p>Thiruvannamalai District – 606905, Tamil Nadu, India</p>
          <p>Phone: +91 82203 48218</p>
          <p>Email: support@printpanda.in</p>
          <p className="text-ink/55 text-xs mt-2">Response time: Within 48 hours on business days.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
