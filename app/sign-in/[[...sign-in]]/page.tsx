"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#c6718a",
              colorBackground: "var(--bg-card)",
              colorText: "var(--text)",
            },
          }}
        />
      </div>
    </main>
  );
}

