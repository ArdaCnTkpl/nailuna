"use server";

import { supabaseAdmin } from "./supabaseAdmin";

export type DbUser = {
  id: string;
  clerk_id: string;
  credits_balance: number;
  stripe_customer_id?: string | null;
  created_at: string | null;
};

export async function getOrCreateUser(clerkId: string): Promise<DbUser> {
  // Varsa kullanıcıyı getir
  const { data: existing, error: selectError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .maybeSingle<DbUser>();

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 = no rows returned
    throw selectError;
  }

  if (existing) return existing;

  // Yoksa oluştur; clerk_id unique olduğu için race durumunda mevcut kaydı döner
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({ clerk_id: clerkId })
    .select("*")
    .single<DbUser>();

  if (error) {
    // Eğer unique violation alırsak (iki istek aynı anda geldiyse) tekrar oku
    if (error.code === "23505") {
      const { data: again, error: againError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("clerk_id", clerkId)
        .single<DbUser>();
      if (againError || !again) throw againError ?? new Error("User not found after upsert.");
      return again;
    }
    throw error;
  }

  return data;
}

