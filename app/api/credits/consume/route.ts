import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { consumeOneCredit } from "../../../../lib/credits";

export async function POST(_request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await consumeOneCredit(userId);

    return NextResponse.json({
      id: updated.id,
      credits_balance: updated.credits_balance,
    });
  } catch (e) {
    const err = e as any;
    if (err?.code === "INSUFFICIENT_CREDITS" || err?.message?.includes("INSUFFICIENT_CREDITS")) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
    console.error("consumeOneCredit error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

