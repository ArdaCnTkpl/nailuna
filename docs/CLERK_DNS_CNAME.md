# Clerk: clerk.nailuna.app için DNS CNAME

Clerk Dashboard’da **Frontend API** için `clerk.nailuna.app` tanımlı; "Unverified" ise DNS’te CNAME eklemen gerekiyor.

---

## Ne yapmalısın?

Clerk’in söylediği:

- **Host / name:** `clerk` (yani `clerk.nailuna.app`)
- **Hedef / target:** `frontend-api.clerk.services`

Yani: **clerk** → **frontend-api.clerk.services** CNAME kaydı.

---

## DNS’e nasıl eklenir?

`nailuna.app` domain’inin DNS’ini nerede yönettiğine göre (Vercel, Cloudflare, Namecheap, GoDaddy, vb.) o panelden şu kaydı ekle:

| Alan | Değer / Target |
|------|------------------|
| **Type** | CNAME |
| **Name / Host** | `clerk` (bazı sağlayıcılarda `clerk.nailuna.app` veya sadece `clerk`) |
| **Value / Target / Points to** | `frontend-api.clerk.services` |

- **TTL:** Varsayılan (örn. 3600) yeterli.
- **Proxy:** Cloudflare kullanıyorsan ilk aşamada **DNS only** (gri bulut) kullan; doğrulandıktan sonra istersen proxy açabilirsin.

Kaydı ekledikten sonra **birkaç dakika – birkaç saat** (DNS propagation) bekleyebilirsin. Clerk Dashboard’da **Domains** sayfasına dön; doğrulama geçerse "Verified" görünür ve `clerk.nailuna.app` üzerinden script yüklenmeye başlar.

---

## Örnek: Vercel DNS

1. Vercel → Project → **Settings** → **Domains** → `nailuna.app`.
2. **Edit** / DNS kayıtlarını yönet.
3. **Add** → Type: **CNAME**, Name: **clerk**, Value: **frontend-api.clerk.services** → Save.

---

## Örnek: Cloudflare

1. Cloudflare → **nailuna.app** → **DNS** → **Records**.
2. **Add record**: Type **CNAME**, Name **clerk**, Target **frontend-api.clerk.services**, Proxy status **DNS only** → Save.

---

## CNAME eklemek istemiyorsan

Custom domain’i hiç kullanmayacaksan Clerk Dashboard’da **clerk.nailuna.app**’i kaldır; uygulama `*.clerk.accounts.dev` adresini kullanır ve ekstra DNS gerekmez. Adımlar: [CLERK_KUSTOM_DOMAIN_KALDIRMA.md](./CLERK_KUSTOM_DOMAIN_KALDIRMA.md).
