"use client";

import { useEffect } from "react";

export default function BillingPage() {
  useEffect(() => {
    window.location.href = "/api/stripe/portal";
  }, []);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-[var(--text-muted)]">Redirecting to billing…</p>
    </div>
  );
}
