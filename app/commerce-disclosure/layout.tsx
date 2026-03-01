import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, fullUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Commerce Disclosure",
  description: `Commerce disclosure and merchant information for ${SITE_NAME}. Responsible operator, address, payment methods, and refund policy.`,
  openGraph: {
    title: `Commerce Disclosure | ${SITE_NAME}`,
    description: `Commerce disclosure and merchant information for ${SITE_NAME}.`,
    url: fullUrl("/commerce-disclosure"),
    type: "website",
  },
  alternates: { canonical: fullUrl("/commerce-disclosure") },
  robots: { index: true, follow: true },
};

export default function CommerceDisclosureLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
