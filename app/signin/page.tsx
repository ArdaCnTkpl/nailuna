"use client";

import Link from "next/link";
import SignInForm from "../components/SignInForm";
import { useLanguage } from "../context/LanguageContext";

export default function SignInPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-sm px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <Link
          href="/"
          className="inline-block text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--primary)]"
        >
          ← {t("nav.home")}
        </Link>
        <div className="mt-8 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--text)]">
            {t("signin.title")}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{t("signin.subtitle")}</p>
        </div>
        <div className="mt-8">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
