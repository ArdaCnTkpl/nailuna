import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getOrCreateUser } from "../../../../lib/getOrCreateUser";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Billing portal not configured" }, { status: 500 });
  }

  const user = await getOrCreateUser(userId);
  const stripeCustomerId = user.stripe_customer_id?.trim() || null;

  if (!stripeCustomerId) {
    const origin = req.headers.get("origin") ?? req.nextUrl.origin;
    return NextResponse.redirect(`${origin}/urun?billing=no_subscription`);
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://nailuna.app";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/urun`,
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }
  } catch (e) {
    console.error("Stripe portal session error:", e);
  }

  return NextResponse.json({ error: "Could not open billing portal" }, { status: 500 });
}
