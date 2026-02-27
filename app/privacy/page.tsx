"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-8">
        <header className="mb-8 border-b border-[var(--border)] pb-5">
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Last updated:{" "}
            {new Date().toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </header>

        <section className="space-y-6 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
          <p>
            This Privacy Policy explains how we collect, use, and protect your information when
            you use our AI nail design application (the &quot;Service&quot;).
          </p>

          {/* 1. Information we collect */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              1. Information we collect
            </h2>
            <div className="mt-2 space-y-2">
              <div>
                <p className="font-semibold text-[var(--text)]">Account data</p>
                <p>
                  Basic profile information from Clerk (such as email and user ID) used to create
                  your user record and credit balance.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--text)]">Uploaded photos</p>
                <p>
                  Hand / nail photos you upload in order to generate designs. These images are
                  processed by our AI providers and may be temporarily stored for processing and
                  safety checks.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--text)]">Usage data</p>
                <p>
                  Non-sensitive analytics such as feature usage, approximate timestamps, and
                  anonymized technical information about your device and browser.
                </p>
              </div>
            </div>
          </section>

          {/* 2. How we use your information */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              2. How we use your information
            </h2>
            <p className="mt-2">We use your information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide and improve the AI nail design experience.</li>
              <li>Manage your credits and track usage.</li>
              <li>Secure accounts and prevent abuse or fraud.</li>
              <li>Analyze aggregated usage to improve the product.</li>
            </ul>
          </section>

          {/* 3. Payments */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              3. Payments
            </h2>
            <p className="mt-2">
              Payments are processed securely by third-party payment providers such as Stripe. We
              do not store or have access to your full payment card details.
            </p>
          </section>

          {/* 4. AI providers and data processing */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              4. AI providers and data processing
            </h2>
            <p className="mt-2">
              We use third-party AI providers (such as OpenAI) to generate nail designs. Your
              uploaded images and prompts may be sent to these providers solely for generating
              results.
            </p>
            <p className="mt-2">
              We do not sell your images or prompts.
            </p>
          </section>

          {/* 5. International data transfers */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              5. International data transfers
            </h2>
            <p className="mt-2">
              Because our service providers may operate globally, your information may be processed
              in countries outside your country of residence. We take reasonable steps to ensure
              appropriate data protection safeguards are in place.
            </p>
          </section>

          {/* 6. Data retention */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              6. Data retention
            </h2>
            <p className="mt-2">
              We keep your account and credit data while your account remains active.
            </p>
            <p className="mt-2">
              Uploaded and generated images may be retained for a limited period for quality,
              debugging, and abuse-prevention purposes, after which they may be deleted or
              anonymized.
            </p>
          </section>

          {/* 7. Your rights */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              7. Your rights
            </h2>
            <p className="mt-2">
              Depending on your location, you may have the right to access, update, or delete your
              personal data.
            </p>
            <p className="mt-2">
              To exercise these rights, contact us at:
            </p>
            <p className="mt-1 text-[var(--text)]">
              <span className="mr-1" aria-hidden>
                📧
              </span>
              <Link
                href="mailto:privacy@nail-ai.app"
                className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                privacy@nail-ai.app
              </Link>
            </p>
            <p className="mt-2">
              We may request identity verification before fulfilling requests.
            </p>
          </section>

          {/* 8. Children’s privacy */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              8. Children&apos;s privacy
            </h2>
            <p className="mt-2">
              The Service is not directed to children under 13. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              9. Security
            </h2>
            <p className="mt-2">
              We implement reasonable technical and organizational measures to protect your data.
              However, no system can guarantee absolute security.
            </p>
          </section>

          {/* 10. Changes to this Privacy Policy */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              10. Changes to this Privacy Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. When material changes occur, we
              will update the &quot;Last updated&quot; date at the top of this page.
            </p>
          </section>

          {/* 11. Data Controller */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              11. Data Controller
            </h2>
            <p className="mt-2 text-[var(--text)]">
              <span className="block font-semibold">Nailuna (operated by Tekkupeli Arda Can)</span>
              <span className="block">Japan</span>
              <span className="block">
                Contact:{" "}
                <Link
                  href="mailto:privacy@nail-ai.app"
                  className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
                >
                  privacy@nail-ai.app
                </Link>
              </span>
            </p>
          </section>

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            This Privacy Policy is for informational purposes only and does not constitute legal
            advice.
          </p>
        </section>
      </div>
    </main>
  );
}

