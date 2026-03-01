"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
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
