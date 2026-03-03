# Clerk Custom Domain Nasıl Kaldırılır (clerk.nailuna.app)

Script’in Clerk’in kendi CDN’inden yüklenmesi ve daha hızlı açılması için **clerk.nailuna.app** custom domain’ini kaldırman yeterli. Key’ler (pk_live_..., sk_live_...) aynı kalır.

---

## Adımlar

### 1. Clerk Dashboard’a gir

- Tarayıcıda aç: **https://dashboard.clerk.com**
- Giriş yapıp **Nailuna** (veya ilgili) uygulamasını seç.

### 2. Domains / Paths sayfasını bul

- Sol menüden **Configure** (veya **Settings**) bölümüne gir.
- **Domains** veya **Paths** veya **Customization → Paths** gibi bir sayfayı aç.  
  (Clerk arayüzü sürüme göre değişebilir; “Domain”, “Frontend API”, “Paths” geçen başlıklara bak.)

### 3. Custom domain’i kaldır

- **clerk.nailuna.app** (veya “Custom Frontend API domain”) gibi bir satır göreceksin.
- Yanındaki **Remove**, **Delete**, **Disable** veya çöp kutusu simgesine tıkla.
- Onaylayıp kaydet.

Böylece uygulama tekrar Clerk’in varsayılan adresini (`*.clerk.accounts.dev`) kullanır; script bu adresten yüklenecek.

### 4. (İsteğe bağlı) Env’den JS URL’i kaldır

Custom domain’i kaldırdıktan sonra Clerk zaten kendi CDN’ini kullanır. İstersen:

- **Production (Vercel):** Environment Variables’dan **NEXT_PUBLIC_CLERK_JS_URL** değişkenini **sil** veya boş bırak.
- **Local (.env.local):** Aynı satırı sil veya yorum satırı yap:
  ```bash
  # NEXT_PUBLIC_CLERK_JS_URL=https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js
  ```

Bırakırsan da çalışır; sadece artık gerek kalmaz.

### 5. Deploy / yenile

- **Vercel:** Yeni bir deploy al veya “Redeploy” yap.
- **Local:** `npm run dev` ile sunucuyu yeniden başlat, sayfayı hard refresh (Ctrl+Shift+R) ile yenile.

---

## Bulamazsan

- Sol menüde **Configure**, **Settings**, **Domains**, **Paths** başlıklarını tara.
- Clerk’in yardımında “custom domain” veya “Frontend API” diye ara.
- Hâlâ yoksa: Dashboard’da sağ üstten **Help** veya **Support** ile Clerk’e sor; “How do I remove my custom Frontend API domain (clerk.nailuna.app)?” diyebilirsin.

---

## Özet

| Ne yaptın? | Sonuç |
|------------|--------|
| Clerk Dashboard’da **clerk.nailuna.app**’i kaldırdın | Script artık Clerk CDN’den yüklenir, daha hızlı ve “failed to load” hatası gider. |
| NEXT_PUBLIC_CLERK_JS_URL’i sildin (isteğe bağlı) | Uygulama tamamen Clerk varsayılanına döner. |
| Deploy / yenileme yaptın | Değişiklik canlıya / local’e yansır. |
