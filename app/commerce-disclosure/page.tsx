"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const COMMERCE_ITEMS: { labelKey: string; valueKey: string; isEmail?: boolean; isPricingLink?: boolean }[] = [
  { labelKey: "commerce.legalNameLabel", valueKey: "commerce.legalNameValue" },
  { labelKey: "commerce.addressLabel", valueKey: "commerce.addressValue" },
  { labelKey: "commerce.phoneLabel", valueKey: "commerce.phoneValue" },
  { labelKey: "commerce.emailLabel", valueKey: "commerce.emailValue", isEmail: true },
  { labelKey: "commerce.operatorLabel", valueKey: "commerce.operatorValue" },
  { labelKey: "commerce.pricingLabel", valueKey: "commerce.pricingValue", isPricingLink: true },
  { labelKey: "commerce.additionalFeesLabel", valueKey: "commerce.additionalFeesValue" },
  { labelKey: "commerce.returnsByCustomerLabel", valueKey: "commerce.returnsByCustomerValue" },
  { labelKey: "commerce.returnsDefectiveLabel", valueKey: "commerce.returnsDefectiveValue" },
  { labelKey: "commerce.serviceDeliveryLabel", valueKey: "commerce.serviceDeliveryValue" },
  { labelKey: "commerce.paymentMethodsLabel", valueKey: "commerce.paymentMethodsValue" },
  { labelKey: "commerce.paymentTimingLabel", valueKey: "commerce.paymentTimingValue" },
  { labelKey: "commerce.recommendedEnvLabel", valueKey: "commerce.recommendedEnvValue" },
];

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
          {COMMERCE_ITEMS.map(({ labelKey, valueKey, isEmail, isPricingLink }) => (
            <div key={labelKey}>
              <dt className="font-medium text-[var(--text)]">{t(labelKey)}</dt>
              <dd className="mt-1">
                {isEmail ? (
                  <a href="mailto:ardacan.tekkupeli@gmail.com" className="text-[var(--primary)] hover:underline">
                    {t(valueKey)}
                  </a>
                ) : isPricingLink ? (
                  <>
                    {t(valueKey)}{" "}
                    <Link href="/pricing" className="text-[var(--primary)] hover:underline">
                      {t("commerce.pricingUrl")}
                    </Link>
                  </>
                ) : (
                  t(valueKey)
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
