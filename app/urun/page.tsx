"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import NailCanvas, { type NailCanvasRef } from "../components/NailCanvas";
import { useLanguage } from "../context/LanguageContext";

type Mode = "text" | "reference";

export default function UrunPage() {
  const { t } = useLanguage();
  const canvasRef = useRef<NailCanvasRef>(null);
  const [mode, setMode] = useState<Mode>("text");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceObjectUrl, setReferenceObjectUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [resultZoomed, setResultZoomed] = useState(false);

  useEffect(() => {
    if (!resultZoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResultZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resultZoomed]);

  const downloadResult = useCallback(() => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `nail-design-${Date.now()}.png`;
    link.click();
  }, [result]);

  const shareResult = useCallback(async () => {
    if (!result) return;
    setShareFeedback(null);
    try {
      const res = await fetch(result);
      const blob = await res.blob();
      const file = new File([blob], "nail-design.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: t("product.shareTitle"),
          text: t("product.shareText"),
          files: [file],
        });
        setShareFeedback(t("product.shareSuccess"));
        setTimeout(() => setShareFeedback(null), 3000);
      } else if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setShareFeedback(t("product.shareCopied"));
        setTimeout(() => setShareFeedback(null), 3000);
      } else {
        downloadResult();
        setShareFeedback(t("product.shareDownloadFallback"));
        setTimeout(() => setShareFeedback(null), 3000);
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setShareFeedback(t("product.shareError"));
      setTimeout(() => setShareFeedback(null), 3000);
    }
  }, [result, downloadResult, t]);

  const applyImageFile = useCallback((file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setImageFile(file);
    setResult(null);
    setError(null);
  }, []);

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      applyImageFile(file);
      e.target.value = "";
    },
    [applyImageFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith("image/")) applyImageFile(file);
    },
    [applyImageFile]
  );

  const handleReferenceUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setReferenceObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setReferenceFile(file);
      setResult(null);
      setError(null);
    },
    []
  );

  const generate = useCallback(async () => {
    if (!imageFile) {
      setError(t("product.error.uploadFirst"));
      return;
    }
    if (mode === "text" && !prompt.trim()) {
      setError(t("product.error.promptRequired"));
      return;
    }
    if (mode === "reference" && !referenceFile) {
      setError(t("product.error.referenceRequired"));
      return;
    }
    if (!canvasRef.current?.hasDrawnPaths?.()) {
      setError(t("product.error.markNails"));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const mask = await canvasRef.current?.getMaskForEdit();
      const form = new FormData();
      form.append("image", imageFile);
      form.append("mode", mode);
      if (mode === "text") {
        form.append("prompt", prompt.trim());
      } else if (referenceFile) {
        form.append("referenceImage", referenceFile);
        if (prompt.trim()) form.append("prompt", prompt.trim());
      }
      if (mask) form.append("mask", mask, "mask.png");

      const res = await fetch("/api/generate", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError("Insufficient credits. Please add more credits.");
          setShowCreditPopup(true);
        } else {
          setError(data.error ?? t("product.error.requestFailed"));
        }
        return;
      }
      if (data.image) setResult(data.image);
      else setError(t("product.error.noImage"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("product.error.connection"));
    } finally {
      setLoading(false);
    }
  }, [imageFile, prompt, mode, referenceFile, t]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-5 pb-14 pt-7 sm:px-6 sm:pb-16 sm:pt-8 md:px-8">
        <header className="mb-10 border-b border-[var(--border)] pb-7 text-center sm:mb-10 sm:pb-8 sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 shadow-[var(--shadow-sm)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)] sm:text-sm">
              AI Nail Studio
            </p>
          </div>
          <h1 className="font-display mt-4 text-2xl font-semibold tracking-wide text-[var(--text)] sm:mt-3 sm:text-3xl">
            {t("product.title")}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)] sm:mx-0 sm:mt-2 sm:text-base">
            {t("product.subtitle")}
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent sm:mx-0 sm:mt-6" aria-hidden />
        </header>

        <section className="space-y-6 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="btn-primary inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-medium shadow-[var(--shadow-sm)] sm:min-h-11 sm:w-auto sm:py-2.5">
              <span className="select-none">{t("product.selectPhoto")}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="sr-only"
              />
            </label>
            <label className="btn-secondary inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-medium sm:min-h-11 sm:w-auto sm:py-2.5">
              <span className="select-none">{t("product.takePhoto")}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleUpload}
                className="sr-only"
              />
            </label>
            {imageFile && (
              <span className="max-w-[50vw] truncate text-sm text-[var(--text-muted)] sm:max-w-[200px]">
                {imageFile.name}
              </span>
            )}
          </div>

          {imageObjectUrl ? (
            <div className="card-premium relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow)] sm:p-6 lg:p-8">
              <div className="relative space-y-8 sm:flex sm:flex-row sm:items-start sm:gap-8 sm:space-y-0">
              {loading && (
                <div
                  className="loading-overlay absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(249,244,247,0.98) 0%, rgba(255,250,252,0.97) 50%, rgba(249,244,247,0.98) 100%)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    boxShadow: "inset 0 0 80px rgba(198, 113, 138, 0.06)",
                  }}
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className="loading-orb loading-vip-glow absolute h-28 w-28 rounded-full sm:h-32 sm:w-32"
                      style={{
                        background:
                          "radial-gradient(circle, var(--primary) 0%, var(--accent) 40%, transparent 70%)",
                      }}
                    />
                    <svg
                      className="loading-ring-wrapper relative h-20 w-20 sm:h-24 sm:w-24"
                      viewBox="0 0 64 64"
                      aria-hidden
                    >
                      <circle
                        className="loading-ring"
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#loading-vip-stroke)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{ transformOrigin: "center" }}
                      />
                      <defs>
                        <linearGradient id="loading-vip-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold tracking-wide text-[var(--text)] sm:mt-7 sm:text-xl">
                    {t("product.generating")}
                  </p>
                  <p className="mt-2 text-xs font-medium tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    {t("product.generatingHint")}
                  </p>
                  <div className="mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
                </div>
              )}
              <div className="min-w-0 flex-1 sm:max-w-[340px]">
                <div className="mb-4 flex items-center gap-3 border-l-2 border-[var(--primary)]/60 pl-3 sm:mb-3 sm:border-l-0 sm:pl-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-light)] text-[10px] font-bold text-[var(--primary)] sm:hidden">1</span>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    {t("product.markNail")}
                  </h2>
                </div>
                <NailCanvas
                  ref={canvasRef}
                  imageObjectUrl={imageObjectUrl}
                  disabled={loading}
                  brushLabel={t("product.brush")}
                  hintText={t("product.canvasHint")}
                  undoLabel={t("product.undo")}
                  clearLabel={t("product.clearMark")}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-4 sm:max-w-[340px]">
                <div>
                  <div className="mb-4 flex items-center gap-3 border-l-2 border-[var(--primary)]/60 pl-3 sm:mb-3 sm:border-l-0 sm:pl-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-light)] text-[10px] font-bold text-[var(--primary)] sm:hidden">2</span>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {t("product.howDesign")}
                    </h2>
                  </div>
                  <div
                    role="tablist"
                    className="inline-flex w-full rounded-xl border border-[var(--border)] p-1 shadow-[var(--shadow-sm)] sm:w-auto"
                    style={{ background: "var(--primary-light)" }}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === "text"}
                      onClick={() => setMode("text")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition sm:flex-none sm:px-3 sm:py-2 ${
                        mode === "text"
                          ? "bg-[var(--bg-card)] text-[var(--text)] shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--primary)]"
                      }`}
                    >
                      {t("product.modeText")}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={mode === "reference"}
                      onClick={() => setMode("reference")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition sm:flex-none sm:px-3 sm:py-2 ${
                        mode === "reference"
                          ? "bg-[var(--bg-card)] text-[var(--text)] shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--primary)]"
                      }`}
                    >
                      {t("product.modeReference")}
                    </button>
                  </div>
                </div>

                {mode === "text" ? (
                  <textarea
                    placeholder={t("product.promptPlaceholder")}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    rows={4}
                    className="input-premium w-full min-w-0 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text)] shadow-[var(--shadow-sm)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-60"
                  />
                ) : (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-[var(--text-muted)]">
                        {t("product.referenceLabel")}
                      </span>
                      <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] py-4 transition hover:border-[var(--border-hover)] shadow-[var(--shadow-sm)]"
                        style={{ background: "var(--primary-light)" }}
                      >
                        {referenceObjectUrl ? (
                          <div className="relative w-full px-2">
                            <img
                              src={referenceObjectUrl}
                              alt="Referans tırnak"
                              className="mx-auto max-h-32 w-full object-contain"
                            />
                            <span className="mt-1 block truncate text-center text-xs text-[var(--text-muted)]">
                              {referenceFile?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[var(--text-muted)]">
                            {t("product.uploadPhoto")}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReferenceUpload}
                          className="sr-only"
                        />
                      </label>
                    </label>
                    <textarea
                      placeholder={t("product.optionalNotes")}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={loading}
                      rows={2}
                      className="input-premium w-full min-w-0 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text)] shadow-[var(--shadow-sm)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-60"
                    />
                  </div>
                )}

                <button
                  onClick={generate}
                  disabled={loading}
                  className="btn-primary w-full min-h-14 rounded-2xl px-5 py-4 text-sm font-medium shadow-[var(--shadow-sm)] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3 sm:min-h-12 sm:py-3"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 shrink-0 spinner"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          className="opacity-20"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          strokeDasharray="32 63"
                          strokeDashoffset="16"
                          className="opacity-90"
                        />
                      </svg>
                      <span>{t("product.generating")}</span>
                    </>
                  ) : mode === "reference" ? (
                    t("product.applyReference")
                  ) : (
                    t("product.generate")
                  )}
                </button>
              </div>
              </div>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`card-premium flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all duration-200 sm:min-h-[300px] ${
                isDragOver
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg)]"
                  : "border-[var(--border)]"
              }`}
              style={{ background: "var(--primary-light)" }}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] sm:mb-4 sm:h-14 sm:w-14">
                <svg className="h-8 w-8 text-[var(--primary)] sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mb-2 text-base font-semibold tracking-wide text-[var(--primary)] sm:text-sm">
                {t("product.dragDrop")}
              </p>
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-[var(--text-muted)] sm:mb-6">
                {t("product.uploadFirst")}
              </p>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <label className="btn-primary inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-medium shadow-[var(--shadow-sm)] sm:min-h-11 sm:w-auto sm:py-2.5">
                  {t("product.uploadPhoto")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="sr-only"
                  />
                </label>
                <label className="btn-secondary inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-medium sm:min-h-11 sm:w-auto sm:py-2.5">
                  {t("product.takePhoto")}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          )}
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {showCreditPopup && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreditPopup(false)}
          >
            <div
              className="card-premium w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-lg)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-lg font-semibold tracking-wide text-[var(--text)]">
                Insufficient credits
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                You need at least <strong>1 credit</strong> to generate a new nail design. Your
                current balance is 0.
              </p>
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)]">
                <p className="font-semibold">Sample credit pack</p>
                <p className="mt-1 text-[var(--text-muted)]">
                  20 credits &mdash; <span className="font-medium">$9.90</span> (demo pricing,
                  checkout flow coming soon)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreditPopup(false)}
                className="btn-primary mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {result && (
          <section className="mt-10 border-t border-[var(--border)] pt-10">
            <div className="mb-4 flex items-center gap-3 border-l-2 border-[var(--primary)]/60 pl-3 sm:border-l-0 sm:pl-0">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-light)] text-[10px] font-bold text-[var(--primary)] sm:hidden" aria-hidden>✓</span>
              <h2 className="font-display text-lg font-semibold tracking-wide text-[var(--text)] sm:text-xl">
                {t("product.resultTitle")}
              </h2>
            </div>
            <div
              className="card-premium mt-4 cursor-zoom-in overflow-hidden rounded-2xl shadow-[var(--shadow)]"
              role="button"
              tabIndex={0}
              onClick={() => setResultZoomed(true)}
              onKeyDown={(e) => e.key === "Enter" && setResultZoomed(true)}
              aria-label={t("product.resultTitle")}
            >
              <img
                src={result}
                alt="AI ile tasarlanmış tırnak"
                className="block w-full min-w-0 max-w-full object-contain"
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={downloadResult}
                className="btn-action btn-action-primary order-1 min-h-12 w-full justify-center sm:order-none sm:min-h-0 sm:w-auto"
              >
                <svg
                  className="h-[18px] w-[18px] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{t("product.download")}</span>
              </button>
              <button
                type="button"
                onClick={shareResult}
                className="btn-action btn-action-outline min-h-12 w-full justify-center sm:min-h-0 sm:w-auto"
              >
                <svg
                  className="h-[18px] w-[18px] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>{t("product.share")}</span>
              </button>
              {shareFeedback && (
                <span className="ml-1 text-xs tracking-wider text-[var(--text-muted)]">
                  {shareFeedback}
                </span>
              )}
            </div>

            {/* Zoom overlay: fotoğrafa tıklanınca tam ekran; dışarı tıklanınca kapanır */}
            {resultZoomed && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
                onClick={() => setResultZoomed(false)}
                role="dialog"
                aria-modal="true"
                aria-label={t("product.resultTitle")}
              >
                <div className="relative flex h-full w-full items-center justify-center p-4">
                  <img
                    src={result}
                    alt="AI ile tasarlanmış tırnak"
                    className="max-h-full max-w-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div
                    className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 sm:bottom-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        downloadResult();
                        setResultZoomed(false);
                      }}
                      className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/35"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {t("product.download")}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await shareResult();
                        setResultZoomed(false);
                      }}
                      className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/35"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      {t("product.share")}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResultZoomed(false);
                    }}
                    className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 hover:border-white/40 sm:right-6 sm:top-6"
                    aria-label="Kapat"
                  >
                    <svg className="h-4 w-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline tracking-wide">Kapat</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
