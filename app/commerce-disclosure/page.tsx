"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function CommerceDisclosurePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-2xl px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 md:px-8">
        <header className="mb-8 border-b border-[var(--border)] pb-5">
          <Link
            href="/"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            ← {t("nav.home")}
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            {t("commerce.title")}
          </h1>
        </header>

        <dl className="space-y-5 text-sm text-[var(--text-muted)]">
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.merchantLabel")}</dt>
            <dd className="mt-1">{t("commerce.merchantValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.operatorLabel")}</dt>
            <dd className="mt-1">{t("commerce.operatorValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.addressLabel")}</dt>
            <dd className="mt-1">{t("commerce.addressValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.emailLabel")}</dt>
            <dd className="mt-1">
              <a href="mailto:support@nailuna.app" className="text-[var(--primary)] hover:underline">
                {t("commerce.emailValue")}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.pricingLabel")}</dt>
            <dd className="mt-1">
              {t("commerce.pricingValue")}{" "}
              <Link href="/pricing" className="text-[var(--primary)] hover:underline">
                {t("commerce.pricingUrl")}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.additionalFeesLabel")}</dt>
            <dd className="mt-1">{t("commerce.additionalFeesValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.paymentMethodsLabel")}</dt>
            <dd className="mt-1">{t("commerce.paymentMethodsValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.paymentTimingLabel")}</dt>
            <dd className="mt-1">{t("commerce.paymentTimingValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.serviceDeliveryLabel")}</dt>
            <dd className="mt-1">{t("commerce.serviceDeliveryValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.cancellationsLabel")}</dt>
            <dd className="mt-1">{t("commerce.cancellationsValue")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--text)]">{t("commerce.recommendedEnvLabel")}</dt>
            <dd className="mt-1">{t("commerce.recommendedEnvValue")}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
