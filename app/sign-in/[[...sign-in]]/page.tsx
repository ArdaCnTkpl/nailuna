"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
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
  );
}
