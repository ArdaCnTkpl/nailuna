"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-8">
        <header className="mb-8 border-b border-[var(--border)] pb-5">
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            Terms of Service
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
            These Terms of Service (&quot;Terms&quot;) govern your use of our AI nail design
            application and related services (the &quot;Service&quot;). By using the Service,
            you agree to these Terms.
          </p>

          {/* 1. Eligibility and account */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              1. Eligibility and account
            </h2>
            <p className="mt-2">
              You must be at least 13 years old to use the Service. You are responsible for
              maintaining the confidentiality of your account and for all activities that occur
              under your account.
            </p>
          </section>

          {/* 2. Credits and usage */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              2. Credits and usage
            </h2>
            <p className="mt-2">
              The Service may use a credit system to control access to AI generations. Each
              generation can consume credits from your account.
            </p>
            <p className="mt-2">
              Credits are non-refundable and have no monetary value outside the Service, except
              where required by law or in cases of billing error or technical failure.
            </p>
          </section>

          {/* 3. Payments */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              3. Payments
            </h2>
            <p className="mt-2">
              Payments are processed securely by third-party payment providers such as Stripe.
              Prices, credit packages, subscriptions, and billing terms are disclosed in the
              checkout flow. We do not store your full payment card details.
            </p>
            <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
              Subscriptions and cancellation
            </h3>
            <p className="mt-1">
              If you purchase a subscription, it will automatically renew at the end of each
              billing period unless cancelled. You can cancel your subscription at any time
              through your account settings. Cancellation will take effect at the end of the
              current billing period.
            </p>
          </section>

          {/* 4. User content */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              4. User content
            </h2>
            <p className="mt-2">
              You remain the owner of the photos and prompts you upload. By using the Service,
              you grant us and our AI providers a limited license to process this content solely
              for generating nail designs and operating the Service as described in the Privacy
              Policy.
            </p>
            <p className="mt-2">
              You agree not to upload any content that is illegal, infringing, abusive, or
              otherwise inappropriate.
            </p>
          </section>

          {/* 5. Acceptable use */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              5. Acceptable use
            </h2>
            <p className="mt-2">
              You agree not to misuse the Service, including by attempting to reverse engineer
              the models, bypass usage limits, share harmful content, or interfere with the
              Service&apos;s operation or security.
            </p>
          </section>

          {/* 6. Intellectual property */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              6. Intellectual property
            </h2>
            <p className="mt-2">
              All rights, title, and interest in and to the Service (excluding your content)
              are owned by Nailuna and its licensors. You may not copy, modify, or create
              derivative works based on the Service except as expressly permitted in these
              Terms.
            </p>
          </section>

          {/* 7. Generated outputs */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              7. Generated outputs
            </h2>
            <p className="mt-2">
              Generated images are AI-generated previews and may not perfectly represent
              real-world nail results. The outputs are provided &quot;as is&quot; without
              guarantees of specific aesthetic outcomes.
            </p>
            <p className="mt-2">
              You are responsible for how you use the generated designs.
            </p>
          </section>

          {/* 8. Disclaimer of warranties */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              8. Disclaimer of warranties
            </h2>
            <p className="mt-2">
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot;
              basis without warranties of any kind, whether express or implied, including
              implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </section>

          {/* 9. Limitation of liability */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              9. Limitation of liability
            </h2>
            <p className="mt-2">
              To the maximum extent permitted by law, Nailuna and its operators will not be
              liable for any indirect, incidental, special, consequential, or punitive damages,
              or any loss of profits or revenues, arising out of or in connection with your use
              of the Service.
            </p>
          </section>

          {/* 10. Termination */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              10. Termination
            </h2>
            <p className="mt-2">
              We may suspend or terminate your access to the Service at any time if you violate
              these Terms or if we reasonably believe your use poses a risk to us, other users,
              or third parties.
            </p>
          </section>

          {/* 11. Governing law */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              11. Governing law
            </h2>
            <p className="mt-2">
              These Terms are governed by the laws of Japan. Any disputes will be subject to the
              exclusive jurisdiction of the courts located in Japan, unless applicable law
              requires otherwise.
            </p>
          </section>

          {/* 12. Changes to these Terms */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              12. Changes to these Terms
            </h2>
            <p className="mt-2">
              We may update these Terms from time to time. When material changes occur, we will
              update the &quot;Last updated&quot; date.
            </p>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              13. Contact
            </h2>
            <p className="mt-2">
              If you have any questions about these Terms:
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
          </section>

          {/* 14. Operator */}
          <section>
            <h2 className="font-display text-base font-semibold text-[var(--text)] sm:text-lg">
              14. Operator
            </h2>
            <p className="mt-2 text-[var(--text)]">
              <span className="block font-semibold">Nailuna is operated by:</span>
              <span className="block">Tekkupeli Arda Can</span>
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
            These Terms of Service are for informational purposes only and do not constitute
            legal advice.
          </p>
        </section>
      </div>
    </main>
  );
}

