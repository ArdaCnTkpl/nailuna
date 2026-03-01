import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, fullUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME}. Questions or feedback? Get in touch with our team.`,
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description: `Contact ${SITE_NAME}. Questions or feedback? Get in touch with our team.`,
    url: fullUrl("/contact"),
    type: "website",
  },
  alternates: { canonical: fullUrl("/contact") },
  robots: { index: true, follow: true },
};

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
