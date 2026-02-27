"use client";

import { useLanguage } from "../context/LanguageContext";

export default function ContactForm() {
  const { t } = useLanguage();

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]";

  return (
    <div className="card-premium mx-auto max-w-md rounded-2xl p-6 sm:p-8">
      <form
        action="#"
        method="post"
        className="space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-[var(--text)]"
          >
            {t("contact.name")}
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder={t("contact.namePlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-[var(--text)]"
          >
            {t("contact.email")}
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder={t("contact.emailPlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-[var(--text)]"
          >
            {t("contact.message")}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder={t("contact.messagePlaceholder")}
            className={`${inputClass} resize-none`}
          />
        </div>
        <button type="submit" className="btn-primary w-full rounded-2xl px-4 py-3 text-sm font-semibold tracking-wider uppercase">
          {t("contact.submit")}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        {t("contact.demoNote")}
      </p>
    </div>
  );
}
