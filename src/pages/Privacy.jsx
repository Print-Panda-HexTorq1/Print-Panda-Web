import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Last updated: June 2026. Your privacy is important to us."
    >
      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">1. Introduction</h2>
        <p>
          This Privacy Policy describes how <strong>Mohan B</strong> operating as <strong>Print Panda</strong>
          (" we", "us", "our") collects, uses, and protects information when you use our platform at
          printpanda.in. By using our service, you consent to the practices described in this policy.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">2. Information We Collect</h2>
        <h3 className="font-semibold text-ink mt-3 mb-1">2a. Information You Provide</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Name:</strong> Optionally provided as a customer label for your print job.</li>
          <li><strong>Document files:</strong> Files you upload for printing. These are processed and deleted after the print job is completed or cancelled.</li>
          <li><strong>Print settings:</strong> Copies, color mode, page selection, paper size, orientation.</li>
        </ul>

        <h3 className="font-semibold text-ink mt-4 mb-1">2b. Automatically Collected Information</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>Job metadata (upload time, page count, print status) stored for queue management.</li>
          <li>Upload progress and error logs for technical diagnostics.</li>
          <li>Your print history stored locally in your browser's localStorage (not on our servers beyond job completion).</li>
        </ul>

        <h3 className="font-semibold text-ink mt-4 mb-1">2c. Information We Do NOT Collect</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>We do not collect or store your UPI ID, bank details, or any financial credentials.</li>
          <li>We do not require account registration from customers.</li>
          <li>We do not use third-party advertising trackers or analytics SDKs.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>To process and queue your print job at the selected print shop.</li>
          <li>To calculate the price for your document based on page count and settings.</li>
          <li>To allow the print shop operator to verify payment and proceed with printing.</li>
          <li>To display job status and print progress to you.</li>
          <li>To investigate and resolve technical issues.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">4. Document Retention</h2>
        <p>
          Uploaded document files are stored temporarily on our servers solely for the purpose of printing.
          Files are automatically deleted within 24 hours of job completion or cancellation.
          We do not retain, sell, share, or use your document content for any other purpose.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">5. Data Sharing</h2>
        <p>
          We do not sell your personal information. Your document and job details are shared only with the
          print shop operator associated with your unique upload link, solely to fulfil the print job.
          We may disclose information if required by applicable Indian law or court order.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">6. Cookies and Local Storage</h2>
        <p>
          Print Panda uses browser <strong>localStorage</strong> to save your print preferences and job
          history locally on your device. This data never leaves your device and is not transmitted to
          our servers. You can clear this data at any time by clearing your browser's site data.
        </p>
        <p className="mt-2">
          We do not use cookies for tracking or advertising purposes.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">7. Security</h2>
        <p>
          All data transmitted between your device and our servers is encrypted using HTTPS (TLS).
          Access to the admin panel and print queues is protected by authentication tokens.
          We take reasonable technical measures to protect your data from unauthorised access.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">8. Your Rights</h2>
        <p>Under applicable Indian law, you have the right to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-ink/75">
          <li>Request confirmation of what data we hold about you (job records).</li>
          <li>Request deletion of your job records by contacting us.</li>
          <li>Withdraw consent by choosing not to use the platform.</li>
        </ul>
        <p className="mt-2">To exercise these rights, contact us at <strong>support@printpanda.in</strong>.</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">9. Children's Privacy</h2>
        <p>
          Our platform is not directed to children under 13. We do not knowingly collect personal information
          from children. If you believe a child has submitted data, please contact us for immediate deletion.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with
          an updated date. Continued use of the platform constitutes acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">11. Contact Us</h2>
        <div className="rounded-xl border border-ink/10 bg-white p-4 text-sm space-y-1">
          <p><strong>Mohan B — Print Panda</strong></p>
          <p>159, Nadu Street, Krishnapuram, Narayanamangalam, Polur Taluk,</p>
          <p>Thiruvannamalai District – 606905, Tamil Nadu, India</p>
          <p>Phone: +91 82203 48218</p>
          <p>Email: support@printpanda.in</p>
        </div>
      </section>
    </LegalLayout>
  );
}
