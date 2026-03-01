"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { useLanguage } from "./context/LanguageContext";

/* Tırnak tasarım kartları – görsel + başlık/açıklama. Kendi fotoğraflarınızı public/designs/ içine koyup src’yi /designs/dosya.jpg yapabilirsiniz. */
const DESIGN_ITEMS = [
  {
    labelKey: "home.design.classic",
    descKey: "home.design.classicDesc",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    labelKey: "home.design.pinkChrome",
    descKey: "home.design.pinkChromeDesc",
    imageUrl: "/designs/pink-chrome.png",
    objectPosition: "50% 72%",
  },
  {
    labelKey: "home.design.almond",
    descKey: "home.design.almondDesc",
    imageUrl: "/designs/almond.png",
  },
  {
    labelKey: "home.design.matte",
    descKey: "home.design.matteDesc",
    imageUrl: "/designs/matte.png",
  },
  {
    labelKey: "home.design.french",
    descKey: "home.design.frenchDesc",
    imageUrl: "/designs/french.png",
  },
  {
    labelKey: "home.design.custom",
    descKey: "home.design.customDesc",
    imageUrl: "/designs/custom.png",
  },
];

const FEATURE_KEYS = [
  { titleKey: "home.feature1.title", descKey: "home.feature1.desc" },
  { titleKey: "home.feature2.title", descKey: "home.feature2.desc" },
  { titleKey: "home.feature3.title", descKey: "home.feature3.desc" },
];

/* How does it work – her adım için kaliteli görsel (yüksek çözünürlük). */
const STEP_ITEMS = [
  {
    titleKey: "home.step1.title",
    descKey: "home.step1.desc",
    imageUrl: "/how-it-works/step1-upload.png",
  },
  {
    titleKey: "home.step2.title",
    descKey: "home.step2.desc",
    imageUrl: "/how-it-works/step2-mark.png",
  },
  {
    titleKey: "home.step3.title",
    descKey: "home.step3.desc",
    imageUrl: "/how-it-works/step3-choose.png",
  },
  {
    titleKey: "home.step4.title",
    descKey: "home.step4.desc",
    imageUrl: "/how-it-works/step4-result.png",
  },
];

/* Yorumlarda kullanıcı fotoğrafları – placeholder avatarlar (pravatar). */
const REVIEW_AVATARS = [
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=10",
  "https://i.pravatar.cc/150?img=16",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=23",
  "https://i.pravatar.cc/150?img=24",
  "https://i.pravatar.cc/150?img=26",
];

const REVIEW_COUNT = 8;

/* Öncesi / sonrası slider – kullanıcı fotoğrafları. */
const BEFORE_AFTER_ITEM = {
  before: "/before-after/before.png",
  after: "/before-after/after.png",
};

export default function Home() {
  const { t } = useLanguage();
  const pricingSliderRef = useRef<HTMLDivElement>(null);
  const [pricingSlideIndex, setPricingSlideIndex] = useState(0);
  const howSliderRef = useRef<HTMLDivElement | null>(null);
  const [howSlideIndex, setHowSlideIndex] = useState(0);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero – VIP luxury */}
      <header
        className="w-full py-16 text-center sm:py-20"
        style={{
          background: "linear-gradient(180deg, var(--accent-light) 0%, transparent 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1 className="font-display text-4xl font-semibold tracking-wide text-[var(--text)] sm:text-5xl">
          {t("home.hero.title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl px-4 text-base tracking-wide text-[var(--text-muted)] sm:text-lg">
          {t("home.hero.subtitle")}
        </p>
        <Link
          href="/urun"
          className="btn-primary mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl px-8 py-3 text-base font-medium"
        >
          {t("home.cta")}
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-16">
        {/* Öncesi / sonrası slider – tek büyük örnek */}
        <section id="oncesi-sonrasi" className="mt-12 scroll-mt-20 sm:mt-16">
          <h2 className="font-display text-center text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            {t("home.beforeAfter.title")}
          </h2>
          <p className="mt-3 text-center text-sm tracking-wide text-[var(--text-muted)]">
            {t("home.beforeAfter.subtitle")}
          </p>
          <div className="mt-8 sm:mt-10 mx-auto max-w-2xl">
            <BeforeAfterSlider
              beforeImage={BEFORE_AFTER_ITEM.before}
              afterImage={BEFORE_AFTER_ITEM.after}
              beforeLabel={t("home.beforeAfter.before")}
              afterLabel={t("home.beforeAfter.after")}
              beforeObjectPosition="50% 55%"
              afterObjectPosition="50% 55%"
              alt="Before and after nail"
            />
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/urun"
              className="btn-primary inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-medium"
            >
              {t("home.beforeAfter.cta")}
            </Link>
          </div>
        </section>

        {/* Dizaynlar */}
        <section id="dizaynlar" className="mt-20 scroll-mt-20 sm:mt-24">
          <h2 className="font-display text-center text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            {t("home.designs.title")}
          </h2>
          <p className="mt-3 text-center text-sm tracking-wide text-[var(--text-muted)]">
            {t("home.designs.subtitle")}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {DESIGN_ITEMS.map((item) => (
              <li
                key={item.labelKey}
                className="card-premium overflow-hidden rounded-2xl transition hover:shadow-[var(--shadow-lg)]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--border)]">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    style={
                      "objectPosition" in item && item.objectPosition
                        ? { objectPosition: item.objectPosition as string }
                        : undefined
                    }
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <span className="font-medium text-[var(--text)]">
                    {t(item.labelKey)}
                  </span>
                  <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                    {t(item.descKey)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section id="features" className="mt-20 scroll-mt-20 sm:mt-24">
          <h2 className="font-display text-center text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            {t("home.features.title")}
          </h2>
          <p className="mt-3 text-center text-sm tracking-wide text-[var(--text-muted)]">
            {t("home.features.subtitle")}
          </p>
          <ul className="mt-8 space-y-6 sm:mt-10">
            {FEATURE_KEYS.map((f) => (
              <li key={f.titleKey} className="card-premium rounded-2xl p-6">
                <h3 className="font-semibold text-[var(--text)]">
                  {t(f.titleKey)}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {t(f.descKey)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* How does it work? */}
        <section id="nasil-calisir" className="mt-20 scroll-mt-20 sm:mt-24">
          <h2 className="font-display text-center text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            {t("home.howItWorks.title")}
          </h2>
          <p className="mt-3 text-center text-sm tracking-wide text-[var(--text-muted)]">
            {t("home.howItWorks.subtitle")}
          </p>
          {/* Mobilde slider, büyük ekranda grid */}
          <div
            ref={howSliderRef}
            onScroll={() => {
              const el = howSliderRef.current;
              if (!el) return;
              const w = el.offsetWidth;
              if (!w) return;
              const i = Math.round(el.scrollLeft / w);
              setHowSlideIndex(Math.min(STEP_ITEMS.length - 1, Math.max(0, i)));
            }}
            className="mt-8 flex overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory scroll-smooth sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {STEP_ITEMS.map((s, i) => (
              <article
                key={s.titleKey}
                className="card-premium relative mx-auto flex min-w-[85%] max-w-sm flex-shrink-0 snap-center overflow-hidden rounded-2xl transition hover:shadow-[var(--shadow-lg)] px-1 sm:mx-0 sm:min-w-0 sm:max-w-none sm:flex-none sm:px-0"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-[var(--border)] sm:aspect-[4/3]">
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative px-3 py-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[#fdf5f8] shadow-[var(--shadow-sm)]">
                    {i + 1}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold text-[var(--text)]">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)] leading-snug">
                    {t(s.descKey)}
                  </p>
                </div>
              </article>
            ))}
          </div>
          {/* Slider noktaları – sadece mobil */}
          <div className="mt-4 flex justify-center gap-2 sm:hidden" aria-hidden>
            {STEP_ITEMS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const el = howSliderRef.current;
                  if (el) {
                    el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" });
                  }
                }}
                className={`h-2 rounded-full transition-all ${
                  i === howSlideIndex
                    ? "w-6 bg-[var(--primary)]"
                    : "w-2 bg-[var(--border)] hover:bg-[var(--text-muted)]/40"
                }`}
                aria-label={`Adım ${i + 1}`}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/urun"
              className="btn-secondary inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium"
            >
              {t("home.tryNow")}
            </Link>
          </div>
        </section>

        {/* Pricing – VIP mobil */}
        <section className="mt-16 scroll-mt-20 sm:mt-24">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-8 shadow-[var(--shadow)] sm:px-8 sm:py-12">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)] sm:text-sm">
              {t("home.pricing.label")}
            </p>
            <h2 className="font-display mt-3 text-center text-2xl font-semibold tracking-wide text-[var(--text)] sm:mt-2 sm:text-3xl">
              {t("home.pricing.title")}
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed tracking-wide text-[var(--text-muted)] sm:text-base">
              {t("home.pricing.subtitle")}
            </p>
            <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent sm:mt-6" aria-hidden />

            {/* Cards – mobilde slayt (tek kart görünür, kaydırma + noktalar) */}
            <div
              ref={pricingSliderRef}
              onScroll={() => {
                const el = pricingSliderRef.current;
                if (!el) return;
                const w = el.offsetWidth;
                const i = Math.round(el.scrollLeft / w);
                setPricingSlideIndex(Math.min(2, Math.max(0, i)));
              }}
              className="mt-8 flex overflow-x-auto overflow-y-hidden pb-2 scroll-smooth scrollbar-hide snap-x snap-mandatory sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* Slide 1: Starter */}
              <div className="flex min-w-[100%] flex-shrink-0 snap-center justify-center px-1 sm:min-w-0 sm:contents">
                <div className="card-premium flex w-full max-w-sm flex-col rounded-2xl p-6 text-left shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] sm:max-w-none">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--text)]">
                  {t("home.pricing.basicTitle")}
                </h3>
                <p className="mt-4 text-2xl font-semibold tabular-nums text-[var(--text)] sm:mt-3">
                  <span className="align-top text-xs font-medium text-[var(--text-muted)]">
                    $
                  </span>
                  9.99
                  <span className="ml-1 align-baseline text-xs text-[var(--text-muted)]">
                    / month
                  </span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {t("home.pricing.basicShortDesc")}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                  <li>{t("home.pricing.basicFeature1")}</li>
                  <li>{t("home.pricing.basicFeature2")}</li>
                  <li>{t("home.pricing.basicFeature3")}</li>
                  <li>{t("home.pricing.basicFeature4")}</li>
                </ul>
                <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:min-h-0 sm:py-2.5">
                  {t("home.pricing.basicCta")}
                </button>
                </div>
              </div>

              {/* Slide 2: Pro – Most Popular */}
              <div className="flex min-w-[100%] flex-shrink-0 snap-center justify-center px-1 sm:order-2 sm:min-w-0 sm:contents">
                <div className="relative order-1 w-full max-w-sm sm:order-none sm:max-w-none">
                <div className="relative w-full rounded-2xl bg-gradient-to-br from-[var(--primary)]/50 to-[var(--accent)]/30 p-[1px] shadow-[var(--gold-glow)]">
                  <div className="card-premium flex h-full flex-col rounded-[1rem] bg-[var(--bg-card)] p-6 text-left shadow-[var(--shadow-lg)] transition hover:-translate-y-1 sm:scale-105">
                    <span className="inline-flex w-fit rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold tracking-wider text-[#fdf5f8] uppercase">
                      {t("home.pricing.proBadge")}
                    </span>
                    <h3 className="mt-4 text-sm font-semibold tracking-wide text-[var(--text)] sm:mt-3">
                      {t("home.pricing.proTitle")}
                    </h3>
                    <p className="mt-4 text-2xl font-semibold tabular-nums text-[var(--text)] sm:mt-3">
                      <span className="align-top text-xs font-medium text-[var(--text-muted)]">
                        $
                      </span>
                      19.99
                      <span className="ml-1 align-baseline text-xs text-[var(--text-muted)]">
                        / month
                      </span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                      {t("home.pricing.proShortDesc")}
                    </p>
                    <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                      <li>{t("home.pricing.proFeature1")}</li>
                      <li>{t("home.pricing.proFeature2")}</li>
                      <li>{t("home.pricing.proFeature3")}</li>
                      <li>{t("home.pricing.proFeature4")}</li>
                      <li>{t("home.pricing.proFeature5")}</li>
                    </ul>
                    <button className="btn-primary mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium shadow-[var(--shadow-sm)] sm:min-h-0 sm:py-2.5">
                      {t("home.pricing.proCta")}
                    </button>
                  </div>
                </div>
                </div>
              </div>

              {/* Slide 3: Studio */}
              <div className="flex min-w-[100%] flex-shrink-0 snap-center justify-center px-1 sm:min-w-0 sm:contents">
                <div className="card-premium flex w-full max-w-sm flex-col rounded-2xl p-6 text-left shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] sm:max-w-none">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--text)]">
                  {t("home.pricing.studioTitle")}
                </h3>
                <p className="mt-4 text-2xl font-semibold tabular-nums text-[var(--text)] sm:mt-3">
                  <span className="align-top text-xs font-medium text-[var(--text-muted)]">
                    $
                  </span>
                  29.99
                  <span className="ml-1 align-baseline text-xs text-[var(--text-muted)]">
                    / month
                  </span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {t("home.pricing.studioShortDesc")}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                  <li>{t("home.pricing.studioFeature1")}</li>
                  <li>{t("home.pricing.studioFeature2")}</li>
                  <li>{t("home.pricing.studioFeature3")}</li>
                  <li>{t("home.pricing.studioFeature4")}</li>
                  <li>{t("home.pricing.studioFeature5")}</li>
                </ul>
                <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:min-h-0 sm:py-2.5">
                  {t("home.pricing.studioCta")}
                </button>
                </div>
              </div>
            </div>

            {/* Slayt göstergeleri – sadece mobil */}
            <div className="mt-4 flex justify-center gap-2 sm:hidden" aria-hidden>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const el = pricingSliderRef.current;
                    if (el) el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" });
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === pricingSlideIndex
                      ? "w-6 bg-[var(--primary)]"
                      : "w-2 bg-[var(--border)] hover:bg-[var(--text-muted)]/40"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Trust text – mobilde ince çizgi ile ayrılmış */}
            <div className="mt-8 border-t border-[var(--border)] pt-6 sm:mt-6 sm:border-t-0 sm:pt-0">
              <p className="text-center text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                {t("home.pricing.trustLine1")}
              </p>
              <p className="mt-2 text-center text-xs text-[var(--text-muted)] sm:text-sm">
                {t("home.pricing.trustLine2")}
              </p>
            </div>
          </div>
        </section>

        {/* Kullanıcı yorumları – örnek yorumlar, yıldız ve fotoğraf ile */}
        <section id="yorumlar" className="mt-20 scroll-mt-20 sm:mt-24">
          <h2 className="font-display text-center text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
            {t("home.reviews.title")}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
            {t("home.reviews.subtitle")}
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 sm:mt-10 sm:gap-7 lg:grid-cols-2 lg:gap-8">
            {Array.from({ length: REVIEW_COUNT }, (_, i) => i + 1).map((i) => {
              const rating = parseInt(t(`home.review${i}.rating`), 10) || 5;
              return (
                <li
                  key={i}
                  className="card-premium rounded-2xl p-6 transition hover:shadow-[var(--shadow-lg)] sm:p-7"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={REVIEW_AVATARS[i - 1]}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[var(--border)] sm:h-16 sm:w-16"
                      width={56}
                      height={56}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block font-medium text-[var(--text)] sm:text-base">
                        {t(`home.review${i}.name`)}
                      </span>
                      <span className="mt-1 flex text-[var(--primary)]" aria-label={`${rating} ${t("home.reviews.stars")}`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg leading-none sm:text-xl">
                            {star <= rating ? "★" : "☆"}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base sm:mt-5">
                    {t(`home.review${i}.text`)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* CTA – User reviews sonrası */}
      </div>
      <section
        className="w-full border-t border-[var(--border)] py-14 text-center sm:py-16"
        style={{
          background: "linear-gradient(0deg, var(--accent-light) 0%, transparent 100%)",
        }}
      >
        <h2 className="font-display text-2xl font-semibold tracking-wide text-[var(--text)] sm:text-3xl">
          {t("home.hero.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-[var(--text-muted)] sm:text-lg">
          {t("home.hero.subtitle")}
        </p>
        <Link
          href="/urun"
          className="btn-primary mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl px-8 py-3 text-base font-medium"
        >
          {t("home.cta")}
        </Link>
      </section>
      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-28">
        {/* Nav anchor links */}
        <nav className="mt-16 flex flex-wrap justify-center gap-6 border-t border-[var(--border)] pt-8 text-sm tracking-wide">
          <a
            href="#dizaynlar"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.designs")}
          </a>
          <a
            href="#features"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.features")}
          </a>
          <a
            href="#nasil-calisir"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.howItWorks")}
          </a>
          <a
            href="#oncesi-sonrasi"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.beforeAfter")}
          </a>
          <a
            href="#yorumlar"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.reviews")}
          </a>
          <Link
            href="/contact"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.contact")}
          </Link>
          <Link
            href="/terms"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/urun"
            className="text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            {t("nav.useAssistant")}
          </Link>
        </nav>

        <footer className="mt-12 text-center text-sm text-[var(--text-muted)] space-y-4">
          <p>{t("home.footer")}</p>
          <p className="text-xs text-[var(--text-muted)]">
            Subscriptions renew automatically each billing period unless cancelled. You can cancel
            anytime from your account settings.
          </p>
          <p>
            <Link
              href="/commerce-disclosure"
              className="text-[var(--primary)] hover:underline"
            >
              {t("commerce.title")}
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
