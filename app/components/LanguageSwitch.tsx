"use client";

import { useLanguage } from "../context/LanguageContext";
import type { Locale } from "../lib/translations";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "ja", label: "JP" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="inline-flex rounded-full border border-[var(--border)] p-0.5"
      style={{ background: "var(--primary-light)" }}
      role="group"
      aria-label="Language switch"
    >
      {LOCALES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            locale === value
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--primary)]"
          }`}
          aria-pressed={locale === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
