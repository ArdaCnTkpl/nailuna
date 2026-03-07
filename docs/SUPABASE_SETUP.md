# Supabase kurulumu (Nailuna)

Uygulama kullanıcıları ve kredi bakiyesini Supabase’te tutar. **Supabase’te hiç şema oluşturmadıysanız** aşağıdaki adımları uygulayın.

## Ne gerekli?

- **Tablolar:** `users`, `credit_ledger`, (opsiyonel: `user_credits`, `generations`)
- **Fonksiyonlar:** `add_credits`, `consume_one_credit`

Bunların hepsi projedeki `supabase/schema.sql` dosyasında tanımlı.

## Adımlar

1. **Supabase Dashboard**’a gidin: https://supabase.com/dashboard  
2. Projenizi seçin (veya yeni proje oluşturun).  
3. Sol menüden **SQL Editor**’ü açın.  
4. **New query** ile yeni bir sorgu açın.  
5. Projedeki `supabase/schema.sql` dosyasının **tüm içeriğini** kopyalayıp SQL Editor’e yapıştırın.  
6. **Run** (veya Ctrl+Enter) ile çalıştırın.

Hata almazsanız şema oluşmuş demektir.

## Kontrol

- **Table Editor**’de `users` ve `credit_ledger` tabloları görünmeli.  
- **Database → Functions** bölümünde `add_credits` ve `consume_one_credit` listelenmeli.

## Ortam değişkenleri

`.env.local` (ve Vercel’de) şunların tanımlı olduğundan emin olun:

- `SUPABASE_URL` – proje URL’iniz (örn. `https://xxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` – Service role key (Settings → API)

Bu key’lerle uygulama `users` / `credit_ledger` ve RPC’leri kullanır; Stripe ödemesi sonrası kredi ekleme ve abonelik bitince bakiye sıfırlama da buna dayanır.
