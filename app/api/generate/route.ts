import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import sharp from "sharp";
import { getOrCreateUser } from "../../../lib/getOrCreateUser";
import { consumeOneCredit, addCredits } from "../../../lib/credits";

const IMAGE_MODEL = "gpt-image-1.5";
const MAX_EDIT_SIZE = 1024; // px – uzun kenar üst limiti (hız + maliyet)

const WINDOW_MS = 60_000; // 1 dakika
const USER_LIMIT = 5; // user başına 5 istek/dk
const IP_LIMIT = 30; // IP başına 30 istek/dk (opsiyonel, aşıldığında da bloklar)

type Counter = { count: number; windowStart: number };

const userRequests = new Map<string, Counter>();
const ipRequests = new Map<string, Counter>();

function checkRateLimit(userId: string, ip: string | null): boolean {
  const now = Date.now();

  // user başına limit
  const userKey = userId;
  const userEntry = userRequests.get(userKey) ?? { count: 0, windowStart: now };
  if (now - userEntry.windowStart >= WINDOW_MS) {
    userEntry.windowStart = now;
    userEntry.count = 0;
  }
  userEntry.count += 1;
  userRequests.set(userKey, userEntry);

  if (userEntry.count > USER_LIMIT) {
    return true;
  }

  // IP başına limit (opsiyonel)
  if (ip) {
    const ipEntry = ipRequests.get(ip) ?? { count: 0, windowStart: now };
    if (now - ipEntry.windowStart >= WINDOW_MS) {
      ipEntry.windowStart = now;
      ipEntry.count = 0;
    }
    ipEntry.count += 1;
    ipRequests.set(ip, ipEntry);

    if (ipEntry.count > IP_LIMIT) {
      return true;
    }
  }

  return false;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function isAllowedImageFile(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  return ALLOWED_IMAGE_TYPES.includes(type) && file.size > 0 && file.size <= MAX_FILE_SIZE_BYTES;
}

export async function POST(request: NextRequest) {
  let consumedUser: { id: string } | null = null;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ipHeader = request.headers.get("x-forwarded-for");
    const ip =
      ipHeader?.split(",")[0]?.trim() ||
      // @ts-ignore NextRequest may expose ip in some runtimes
      (request as any).ip ||
      null;

    if (checkRateLimit(userId, ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const form = await request.formData();
    const image = form.get("image") as File | null;
    const mask = form.get("mask") as File | null;
    const prompt = (form.get("prompt") as string | null)?.trim() ?? "";
    const mode = (form.get("mode") as string | null) ?? "text";
    const referenceImage = form.get("referenceImage") as File | null;

    if (!image) {
      return NextResponse.json(
        { error: "Tırnak fotoğrafı gerekli." },
        { status: 400 }
      );
    }

    if (!isAllowedImageFile(image)) {
      return NextResponse.json(
        { error: "Invalid image: only JPEG, PNG, or WebP up to 10MB allowed." },
        { status: 400 }
      );
    }

    if (referenceImage && referenceImage.size > 0 && !isAllowedImageFile(referenceImage)) {
      return NextResponse.json(
        { error: "Invalid reference image: only JPEG, PNG, or WebP up to 10MB allowed." },
        { status: 400 }
      );
    }

    // Prompt / referans kontrolü (kullanmadan önce doğrula)
    if (
      !(
        (mode === "reference" && referenceImage && referenceImage.size > 0) ||
        prompt
      )
    ) {
      return NextResponse.json(
        { error: "Yazı ile tarif girin veya referans fotoğrafı yükleyin." },
        { status: 400 }
      );
    }

    // Kullanıcı kaydı oluştur (yoksa) ve 1 kredi tüket (hata durumunda iade edeceğiz)
    await getOrCreateUser(userId);
    try {
      const user = await consumeOneCredit(userId);
      consumedUser = { id: user.id };
    } catch (e) {
      const err = e as any;
      if (
        err?.code === "INSUFFICIENT_CREDITS" ||
        err?.message?.includes?.("INSUFFICIENT_CREDITS")
      ) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 402 }
        );
      }
      throw e;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      if (consumedUser) {
        try {
          await addCredits(consumedUser.id, 1, "refund_failed_generation");
        } catch (refundErr) {
          console.error("Refund failed:", refundErr);
        }
      }
      return NextResponse.json(
        { error: "OPENAI_API_KEY tanımlı değil." },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });

    let editPrompt: string;

    if (mode === "reference" && referenceImage && referenceImage.size > 0) {
      editPrompt = `CRITICAL: You MUST edit ONLY the transparent (masked) nail areas. The opaque areas of the mask are the original image—copy them EXACTLY with zero changes. Do not alter hand, skin, fingers, palm, wrist, background, lighting, shadows, or any pixel outside the mask. The final image must be the original photo with only the nails replaced.

REFERENCE TRANSFER: Recreate the nails from the reference design as faithfully as possible on the masked nails of the user's hand. Copy the same colors, finish (glossy/matte/gel), shape and patterns from the reference. Do NOT invent a new design or style; just transfer the reference nails onto the user's hand.${
        prompt
          ? ` USER NOTES: ${prompt} (treat these only as a subtle tweak; keep the main design identical to the reference).`
          : ""
      }

Photorealistic nails, same hand pose and lighting as original.`;
    } else if (prompt) {
      editPrompt = `CRITICAL: You MUST edit ONLY the transparent (masked) nail areas. The opaque areas of the mask are the original image—copy them EXACTLY with zero changes. Do not alter hand, skin, fingers, palm, wrist, background, lighting, shadows, or any pixel outside the mask. The final image must be the original photo with only the nails replaced.

NAILS: ${prompt}. Photorealistic nails, same hand pose and lighting as original.`;
    } else {
      // Yukarıda zaten kontrol edildi; defansif fallback.
      return NextResponse.json(
        { error: "Yazı ile tarif girin veya referans fotoğrafı yükleyin." },
        { status: 400 }
      );
    }

    // EXIF orientation uygula; telefon fotoğraflarında mask boyut uyumsuzluğunu önler
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const normalizedBuffer = await sharp(imageBuffer, { autoOrient: true })
      .toBuffer();
    const imageMeta = await sharp(normalizedBuffer).metadata();
    const imgW = imageMeta.width ?? 1024;
    const imgH = imageMeta.height ?? 1024;

    const imageFile = new File([new Uint8Array(normalizedBuffer)], image.name || "image.png", {
      type: "image/png",
    });

    const opts: Parameters<typeof openai.images.edit>[0] = {
      model: IMAGE_MODEL,
      image: imageFile,
      prompt: editPrompt,
      n: 1,
    };

    if (mask && mask.size > 0) {
      const maskBuffer = Buffer.from(await mask.arrayBuffer());
      const resizedMask = await sharp(maskBuffer)
        .resize(imgW, imgH, { fit: "fill" })
        .png()
        .toBuffer();
      opts.mask = new File([new Uint8Array(resizedMask)], "mask.png", {
        type: "image/png",
      });
    }

    let result;
    try {
      result = await openai.images.edit(opts);
    } catch (openaiError) {
      if (consumedUser) {
        try {
          await addCredits(consumedUser.id, 1, "refund_failed_generation");
        } catch (refundErr) {
          console.error("Refund failed:", refundErr);
        }
      }
      throw openaiError;
    }
    const first = result.data?.[0];

    if (!first || !("b64_json" in first) || !first.b64_json) {
      if (consumedUser) {
        try {
          await addCredits(consumedUser.id, 1, "refund_failed_generation");
        } catch (refundErr) {
          console.error("Refund failed:", refundErr);
        }
      }
      return NextResponse.json(
        { error: "AI görsel üretemedi." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      image: `data:image/png;base64,${first.b64_json}`,
    });
  } catch (e) {
    console.error("Generate error:", e);
    if (consumedUser) {
      try {
        await addCredits(consumedUser.id, 1, "refund_failed_generation");
      } catch (refundErr) {
        console.error("Refund failed:", refundErr);
      }
    }
    const message =
      e instanceof Error ? e.message : "İstek işlenirken hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
