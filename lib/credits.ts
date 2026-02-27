"use server";

import { supabaseAdmin } from "./supabaseAdmin";
import { type DbUser } from "./getOrCreateUser";

export async function addCredits(userId: string, amount: number, reason: string): Promise<DbUser> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const { data, error } = await supabaseAdmin.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
  });

  if (error) {
    throw error;
  }

  return data as DbUser;
}

export async function consumeOneCredit(clerkId: string): Promise<DbUser> {
  const { data, error } = await supabaseAdmin.rpc("consume_one_credit", {
    p_clerk_id: clerkId,
  });

  if (error) {
    if (error.message?.includes("INSUFFICIENT_CREDITS")) {
      const insufficient = new Error("INSUFFICIENT_CREDITS");
      (insufficient as any).code = "INSUFFICIENT_CREDITS";
      throw insufficient;
    }
    throw error;
  }

  return data as DbUser;
}

