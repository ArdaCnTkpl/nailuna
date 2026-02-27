# Deploy Öncesi Güvenlik Checklist

## A) Secret sızıntısı

- **Kontrol:** Repoda `sk-`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE`, `CLERK_SECRET_KEY`, `JWT`, `PRIVATE_KEY` gibi gerçek değerler **arandı**; sadece `process.env.*` kullanılıyor, hardcoded key yok.
- **.gitignore:** `.env`, `.env.local`, `.env.*`, `*.pem` ve `!.env.example` tanımlı. Gerçek key’ler sadece ortam değişkenlerinde (Vercel/host) tutulmalı.

## B) Stripe webhook güvenliği

- **Durum:** Projede şu an **Stripe kullanılmıyor** (ödeme/checkout yok).
- **İleride webhook eklenirse:** Signature doğrulaması zorunlu: `stripe.webhooks.constructEvent(bodyRaw, signature, webhookSecret)`. Next.js’te body’nin **raw** okunması gerekir (parse edilmeden).

## C) Credit düşümü server-side

- **Durum:** Kredi düşümü tamamen **server-side**.
- **Akış:** `/api/generate` → Clerk `auth()` → `getOrCreateUser(userId)` → `consumeOneCredit(userId)` (atomik RPC) → sonra OpenAI çağrısı. Client’tan “kredim var” iddiası kabul edilmiyor.

## D) Upload güvenliği (foto)

- **Maks boyut:** 10MB (`MAX_FILE_SIZE_BYTES`).
- **İzin verilen türler:** `image/jpeg`, `image/png`, `image/webp`. Başka MIME reddedilir (400).
- **Yer:** `/api/generate` içinde hem `image` hem `referenceImage` için `isAllowedImageFile()` ile kontrol.
- **Not:** EXIF temizleme eklenmedi; istenirse Sharp ile yapılabilir. Upload’lar public bucket’ta değil; API’ye POST edilip işlendikten sonra yanıt base64 dönüyor, kalıcı public URL yok.

## E) Rate limit / abuse

- **Durum:** Uygulama tarafında **rate limit yok** (user/IP bazlı dakika/saat limiti yok).
- **Öneri:** Vercel Edge Middleware veya Upstash Redis ile `/api/generate` ve `/api/credits/*` için user/IP limiti eklenmeli. Free plan abuse için captcha veya sıkı limit düşünülebilir.

## F) Yetki kontrolleri (multi-user)

- **Durum:** Tüm kullanıcı verisi **Clerk `userId`** ile ilişkili. API’ler `auth()` ile userId alıyor; `getOrCreateUser(userId)`, `consumeOneCredit(userId)` sadece o kullanıcıya ait. Başka kullanıcının “generated image” kaydını okuyacak bir endpoint yok; sonuç yanıtta dönüyor, DB’de saklanmıyor.
- **Supabase:** `service_role` ile erişim var; RLS server-side işlemlerde bypass. Veri erişimi her zaman `clerk_id` / user id üzerinden; cross-user erişim yok.

---

**Özet:** Secret’lar repoda yok, .gitignore uygun. Kredi server-side ve atomik. Upload boyut/tür kontrolü eklendi. Stripe yok; ileride webhook eklenirse signature doğrulaması şart. Rate limit ve (isteğe bağlı) EXIF temizleme sonraki adımlar için not edildi.
