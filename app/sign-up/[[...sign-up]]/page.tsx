"use client";

import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

function SignUpFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-[var(--text-muted)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      <p className="text-sm">Loading sign up…</p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f9f4f7] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<SignUpFallback />}>
          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#c6718a",
                colorBackground: "#ffffff",
                colorText: "#27151e",
              },
            }}
          />
        </Suspense>
      </div>
    </main>
  );
}

