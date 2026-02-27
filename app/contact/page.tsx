"use client";

import Link from "next/link";
import ContactForm from "../components/ContactForm";
import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-16">
        <Link
          href="/"
          className="inline-block text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--primary)]"
        >
          ← {t("nav.home")}
        </Link>

        {/* Hero – anasayfa ile aynı */}
        <header className="mt-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-wide text-[var(--text)] sm:text-4xl">
            {t("home.hero.title")}
          </h1>
          <p className="mt-4 text-base text-[var(--text-muted)] sm:text-lg">
            {t("home.hero.subtitle")}
          </p>
          <Link
            href="/urun"
            className="btn-primary mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl px-8 py-3 text-base font-medium"
          >
            {t("home.cta")}
          </Link>
        </header>

        {/* Contact */}
        <section className="mt-20 sm:mt-24">
          <h2 className="font-display text-center text-xl font-semibold tracking-wide text-[var(--text)] sm:text-2xl">
            {t("home.contact.title")}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
            {t("home.contact.subtitle")}
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
