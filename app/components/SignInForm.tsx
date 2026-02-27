"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function SignInForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]";

  return (
    <div className="card-premium mx-auto max-w-sm rounded-2xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="signin-email"
            className="block text-sm font-medium text-[var(--text)]"
          >
            {t("signin.email")}
          </label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("signin.emailPlaceholder")}
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="signin-password"
            className="block text-sm font-medium text-[var(--text)]"
          >
            {t("signin.password")}
          </label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("signin.passwordPlaceholder")}
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <button type="submit" className="btn-primary w-full rounded-2xl px-4 py-3 text-sm font-semibold tracking-wider uppercase">
          {t("signin.submit")}
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          {t("signin.demoNote")}
        </p>
      )}
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        {t("signin.noAccount")}{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--primary)] underline underline-offset-2 hover:no-underline"
        >
          {t("signin.signUp")}
        </Link>
      </p>
    </div>
  );
}
