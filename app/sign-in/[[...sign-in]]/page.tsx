"use client";

import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

function SignInFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-[var(--text-muted)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      <p className="text-sm">Loading sign in…</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#f9f4f7] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<SignInFallback />}>
          <SignIn
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

