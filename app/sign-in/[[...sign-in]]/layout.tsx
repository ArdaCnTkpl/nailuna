import type { Metadata } from "next";
import { SITE_NAME } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${SITE_NAME}.`,
  robots: { index: false, follow: true },
};

export default function SignInLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
