import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import AppHeader from "./components/AppHeader";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nailuna",
  description: "Upload your nail photo, describe your design, and let AI create your dream nails.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="tr" className={`${dmSans.variable} ${cormorant.variable}`}>
        <body className="min-h-screen font-sans antialiased bg-[var(--bg)] text-[var(--text)]">
          <LanguageProvider>
            <AppHeader />
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
