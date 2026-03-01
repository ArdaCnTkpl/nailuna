"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex justify-center">
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
      </div>
    </main>
  );
}
