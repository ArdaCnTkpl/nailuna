import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "../../../lib/getOrCreateUser";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getOrCreateUser(userId);

  return NextResponse.json({
    id: user.id,
    clerk_id: user.clerk_id,
    credits_balance: user.credits_balance,
    created_at: user.created_at,
  });
}

