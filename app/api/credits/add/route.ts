import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "../../../../lib/getOrCreateUser";
import { addCredits } from "../../../../lib/credits";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as
    | { amount?: number; reason?: string }
    | null;

  const amount = body?.amount;
  const reason = body?.reason ?? "manual_adjustment";

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
  }

  const user = await getOrCreateUser(userId);

  // TODO: Bu endpoint sadece admin/dev amaçlıdır. Üretim öncesi kaldır veya korumaya al.
  const updated = await addCredits(user.id, Math.trunc(amount), reason);

  return NextResponse.json({
    id: updated.id,
    credits_balance: updated.credits_balance,
  });
}

