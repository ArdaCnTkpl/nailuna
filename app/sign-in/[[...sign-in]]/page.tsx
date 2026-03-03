"use client";

import Link from "next/link";
import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

function SignInFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#c6718a] border-t-transparent" />
      <p className="text-sm text-[#8c6a7c]">Loading sign in…</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center text-sm text-[#8c6a7c]">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-[#c6718a] hover:underline">
            Sign up
          </Link>
        </div>
        <div className="flex justify-center">
          <Suspense fallback={<SignInFallback />}>
            <SignIn
              fallbackRedirectUrl="/urun"
              forceRedirectUrl="/urun"
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
      </div>
    </main>
  );
}
