# Tırnak AI Asistanı

Fotoğraf yükle, tırnağı işaretle, tasarım tarifini yaz — OpenAI Image Edit API ile tırnak tasarımını oluştur.

## Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` içinde en az aşağıdaki değerleri ayarlayın:

```env
OPENAI_API_KEY=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Supabase
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Supabase şeması

`supabase/schema.sql` dosyasındaki SQL’i Supabase projenin veritabanına uygulayın
(örneğin Supabase SQL editor üzerinden). Bu dosya şunları oluşturur:

- `users` tablosu (Clerk `userId` + `credits_balance`)
- `credit_ledger` tablosu (tüm kredi hareketleri)
- `consume_one_credit` ve `add_credits` fonksiyonları (atomik kredi işlemleri)

## Çalıştırma

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın.

## Kullanım

1. **Fotoğraf seç** — El / tırnak fotoğrafı yükle.
2. **Tırnağı işaretle** — Beyaz fırçayla sadece tırnakları çiz (düzenlenecek alan).
3. **Tasarım tarifi** — Örn. *Luxury pembe krom, badem form, mat cilâ*.
4. **Tırnağı tasarla** — AI düzenlenmiş fotoğrafı görüntüle.

Sonuç, yalnızca işaretlediğin alanlarda değişiklik yapılmış görsel olarak gösterilir.
