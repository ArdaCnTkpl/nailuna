import type { Metadata } from "next";
import { SITE_NAME, fullUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. How we collect, use, and protect your data when you use our AI nail design app.`,
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Privacy Policy for ${SITE_NAME}. How we collect, use, and protect your data when you use our AI nail design app.`,
    url: fullUrl("/privacy"),
    type: "website",
  },
  alternates: { canonical: fullUrl("/privacy") },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
