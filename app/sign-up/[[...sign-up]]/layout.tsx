import type { Metadata } from "next";
import { SITE_NAME } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign up",
  description: `Create your ${SITE_NAME} account.`,
  robots: { index: false, follow: true },
};

export default function SignUpLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
