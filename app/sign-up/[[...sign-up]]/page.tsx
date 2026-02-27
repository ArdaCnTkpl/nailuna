"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        <SignUp
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

