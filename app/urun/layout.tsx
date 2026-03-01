import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, fullUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "AI Nail Designer",
  description: `Create your nail design with ${SITE_NAME}. Upload a photo, mark your nails, describe your style or use a reference image. AI generates realistic results in seconds.`,
  openGraph: {
    title: `AI Nail Designer | ${SITE_NAME}`,
    description: `Create your nail design with ${SITE_NAME}. Upload a photo, mark your nails, describe your style or use a reference image.`,
    url: fullUrl("/urun"),
    type: "website",
  },
  alternates: { canonical: fullUrl("/urun") },
  robots: { index: true, follow: true },
};

export default function UrunLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
