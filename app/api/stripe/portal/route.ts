import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getOrCreateUser } from "../../../../lib/getOrCreateUser";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

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
  let stripeCustomerId = user.stripe_customer_id?.trim() || null;

  // Backfill: if we have no customer id, try to find Stripe customer by Clerk email and save it
  if (!stripeCustomerId) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const primaryId = (clerkUser as { primaryEmailAddressId?: string }).primaryEmailAddressId;
      const email = primaryId
        ? clerkUser.emailAddresses.find((e) => e.id === primaryId)?.emailAddress
        : clerkUser.emailAddresses[0]?.emailAddress;
      if (email) {
        const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-02-25.clover" });
        const customers = await stripe.customers.list({ email, limit: 1 });
        if (customers.data.length > 0) {
          stripeCustomerId = customers.data[0].id;
          await supabaseAdmin
            .from("users")
            .update({ stripe_customer_id: stripeCustomerId })
            .eq("clerk_id", userId);
        }
      }
    } catch (e) {
      console.warn("Portal backfill by email failed:", e);
    }
  }

  if (!stripeCustomerId) {
    const portalLoginUrl =
      process.env.STRIPE_BILLING_PORTAL_LOGIN_URL ||
      "https://billing.stripe.com/p/login/dRmcN5bNa5BO4RP3ay6sw00";
    return NextResponse.redirect(portalLoginUrl);
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
