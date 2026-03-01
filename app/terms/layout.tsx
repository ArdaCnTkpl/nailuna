import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, fullUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME}. By using our AI nail design service you agree to these terms.`,
  openGraph: {
    title: `Terms of Service | ${SITE_NAME}`,
    description: `Terms of Service for ${SITE_NAME}. By using our AI nail design service you agree to these terms.`,
    url: fullUrl("/terms"),
    type: "website",
  },
  alternates: { canonical: fullUrl("/terms") },
  robots: { index: true, follow: true },
};

export default function TermsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
