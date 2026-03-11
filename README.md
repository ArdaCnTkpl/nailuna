# Nailuna – AI Nail Design Studio

Upload a photo of your hand, mark your nails with a simple brush, describe the style you want – Nailuna uses OpenAI’s Image Edit API to generate realistic nail designs on top of your own photo.

## Setup

```bash
npm install
cp .env.example .env.local
```

In `.env.local` set at least:

```env
OPENAI_API_KEY=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Supabase (server-side only)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Supabase schema

Apply the SQL from `supabase/schema.sql` to your Supabase project (for example via the Supabase SQL editor). It will create:

- `users` table (Clerk `userId` + `credits_balance`)
- `credit_ledger` table (all credit movements)
- `consume_one_credit` and `add_credits` functions (atomic credit operations)

## Running locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload photo** – Take or upload a hand / nail photo.
2. **Mark nails** – Use the white brush to paint only the nail areas you want to change.
3. **Describe the design** – e.g. _Luxury rose chrome, almond shape, matte finish_.
4. **Generate** – The AI returns an edited photo where only the marked nails are changed.

The result keeps your original hand, skin, and background, and replaces only the nail areas with the requested design.
