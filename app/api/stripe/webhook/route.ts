import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrCreateUser } from "../../../../lib/getOrCreateUser";
import { addCredits } from "../../../../lib/credits";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!stripeSecretKey || !webhookSecret) {
    console.error("Stripe webhook misconfigured: missing keys");
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!sig) throw new Error("Missing Stripe signature header");
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // İlk ödeme / her yenileme için kredi ver (subscription mode kullanıyoruz)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan as string | undefined;
      const clerkId = session.client_reference_id as string | undefined;

      if (!clerkId || !plan) {
        console.warn("Webhook checkout.session.completed missing clerkId or plan");
      } else {
        let creditsToAdd = 0;
        if (plan === "starter") creditsToAdd = 30;
        else if (plan === "creator") creditsToAdd = 60;
        else if (plan === "studio") creditsToAdd = 120;

        if (creditsToAdd > 0) {
          const user = await getOrCreateUser(clerkId);
          await addCredits(user.id, creditsToAdd, `stripe_${plan}_checkout`);
          const stripeCustomerId = session.customer as string | undefined;
          if (stripeCustomerId) {
            const { error: updateErr } = await supabaseAdmin
              .from("users")
              .update({ stripe_customer_id: stripeCustomerId })
              .eq("clerk_id", clerkId);
            if (updateErr) {
              console.error("Webhook: failed to save stripe_customer_id:", updateErr);
            }
          }
        }
      }
    }

    // Abonelik sona erdiğinde kullanıcı kredilerini sıfırla
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkId = (subscription.metadata?.clerkId as string | undefined) ?? null;

      if (!clerkId) {
        console.warn("Subscription deleted without clerkId metadata");
      } else {
        const { error } = await supabaseAdmin
          .from("users")
          .update({ credits_balance: 0 })
          .eq("clerk_id", clerkId);

        if (error) {
          console.error("Failed to reset credits on subscription end:", error);
        }
      }
    }
  } catch (err) {
    console.error("Stripe webhook handling error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

