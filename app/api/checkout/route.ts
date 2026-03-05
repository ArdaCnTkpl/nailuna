import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const PRICE_MAP: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  creator: process.env.STRIPE_PRICE_CREATOR,
  studio: process.env.STRIPE_PRICE_STUDIO,
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY is not set" }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as { plan?: string } | null;
  const plan = body?.plan;

  if (!plan || !(plan in PRICE_MAP)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = PRICE_MAP[plan];
  if (!priceId) {
    return NextResponse.json({ error: "Price ID not configured for plan" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://nailuna.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/urun?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      client_reference_id: userId,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ error: "Stripe checkout failed" }, { status: 500 });
  }
}

