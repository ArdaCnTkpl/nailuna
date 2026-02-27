"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import LanguageSwitch from "./LanguageSwitch";
import { useLanguage } from "../context/LanguageContext";

const navLinkClass =
  "block w-full py-4 text-center font-medium tracking-[0.04em] text-[var(--text)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)] border-b border-[var(--border)] last:border-b-0 active:bg-[var(--primary-light)]";

export default function AppHeader() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setCredits(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          const value =
            typeof data?.credits_balance === "number" ? data.credits_balance : null;
          setCredits(value);
        }
      } catch {
        // sessizce yut – header'da kredi görünmemesi sorun olmaz
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--border)] backdrop-blur-xl"
      style={{ background: "var(--bg-header)", boxShadow: "0 1px 0 rgba(201,169,98,0.08)" }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-base font-semibold tracking-wide text-[var(--text)] transition hover:text-[var(--primary)] sm:text-lg shrink-0"
          onClick={closeMenu}
        >
          {t("nav.brand")}
        </Link>

        {/* Mobile: credits badge (menü kapalıyken de görünür) */}
        <SignedIn>
          {credits !== null && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-medium text-[var(--text-muted)] sm:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" aria-hidden />
              {credits} credits
            </span>
          )}
        </SignedIn>

        {/* Desktop nav */}
        <nav className="hidden flex-1 justify-center gap-4 sm:flex sm:gap-6">
          <a
            href="/#features"
            className="text-xs font-medium tracking-wider text-[var(--text-muted)] transition hover:text-[var(--primary)] uppercase"
          >
            {t("nav.features")}
          </a>
          <a
            href="/#nasil-calisir"
            className="text-xs font-medium tracking-wider text-[var(--text-muted)] transition hover:text-[var(--primary)] uppercase"
          >
            {t("nav.howItWorks")}
          </a>
          <Link
            href="/contact"
            className="text-xs font-medium tracking-wider text-[var(--text-muted)] transition hover:text-[var(--primary)] uppercase"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        {/* Desktop: auth + language */}
        <div className="hidden items-center gap-2 sm:flex sm:gap-3 shrink-0">
          <SignedOut>
            <Link
              href="/sign-in"
              className="btn-primary whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-widest uppercase shadow-[var(--shadow-sm)] hover:shadow-[var(--gold-glow)] active:scale-[0.98] sm:px-5 sm:py-2 sm:text-sm"
            >
              {t("nav.signIn")}
            </Link>
          </SignedOut>
          <SignedIn>
            {credits !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" aria-hidden />
                {credits} credits
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <LanguageSwitch />
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] transition hover:bg-[var(--primary-light)] hover:border-[var(--border-hover)] sm:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown – VIP */}
      <div
        className={`overflow-hidden border-t border-[var(--border)] bg-[var(--bg-card)] shadow-[0 8px 24px rgba(30,12,24,0.08)] transition-all duration-200 ease-out sm:hidden ${
          menuOpen ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col py-2">
          <a href="/#features" className={navLinkClass} onClick={closeMenu}>
            {t("nav.features")}
          </a>
          <a href="/#nasil-calisir" className={navLinkClass} onClick={closeMenu}>
            {t("nav.howItWorks")}
          </a>
          <Link href="/contact" className={navLinkClass} onClick={closeMenu}>
            {t("nav.contact")}
          </Link>
          <div className="flex items-center justify-center gap-4 border-t-2 border-[var(--border)] px-5 py-5">
            <SignedOut>
              <Link
                href="/sign-in"
                className="btn-primary inline-flex min-h-12 w-full max-w-[200px] items-center justify-center rounded-full px-5 py-3 text-sm font-medium shadow-[var(--shadow-sm)] sm:min-h-10 sm:max-w-none sm:py-2"
                onClick={closeMenu}
              >
                {t("nav.signIn")}
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                {credits !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" aria-hidden />
                    {credits} credits
                  </span>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <LanguageSwitch />
          </div>
        </nav>
      </div>
    </header>
  );
}
