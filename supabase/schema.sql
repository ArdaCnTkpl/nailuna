-- Users tablosu: Clerk kullanıcısını ve bakiye bilgisini tutar
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  credits_balance int not null default 0,
  created_at timestamptz default now()
);

-- Stripe abonelik yönetimi (Customer Portal) için; checkout tamamlanınca webhook ile set edilir
alter table public.users add column if not exists stripe_customer_id text;

-- Kredi hareketlerini takip eden ledger
create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  delta int not null,
  reason text not null,
  created_at timestamptz default now()
);

-- Indexler
create index if not exists users_clerk_id_idx on public.users (clerk_id);
create index if not exists credit_ledger_user_id_idx on public.credit_ledger (user_id);
create index if not exists credit_ledger_created_at_idx on public.credit_ledger (created_at);

-- Atomik kredi tüketimi için PostgreSQL fonksiyonu
create or replace function public.consume_one_credit(p_clerk_id text)
returns public.users
language plpgsql
as $$
declare
  v_user public.users;
begin
  -- Bakiye > 0 olan kullanıcıyı bul ve 1 kredi düş
  update public.users
  set credits_balance = credits_balance - 1
  where clerk_id = p_clerk_id
    and credits_balance > 0
  returning * into v_user;

  if not found then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  insert into public.credit_ledger (user_id, delta, reason)
  values (v_user.id, -1, 'usage');

  return v_user;
end;
$$;

-- Kredi ekleme için yardımcı fonksiyon (atomik update + ledger yazımı)
create or replace function public.add_credits(p_user_id uuid, p_amount int, p_reason text)
returns public.users
language plpgsql
as $$
declare
  v_user public.users;
begin
  update public.users
  set credits_balance = credits_balance + p_amount
  where id = p_user_id
  returning * into v_user;

  insert into public.credit_ledger (user_id, delta, reason)
  values (p_user_id, p_amount, p_reason);

  return v_user;
end;
$$;

-- -------------------------------------------------------------------
-- RLS: user_credits ve generations için minimum policy seti
-- -------------------------------------------------------------------

-- Kullanıcı bazlı kredi görünümü için basit bir tablo (Clerk/Supabase uid ile eşleşecek text id)
create table if not exists public.user_credits (
  user_id text primary key,
  credits int not null default 0,
  updated_at timestamptz default now()
);

-- Kullanıcıların kendi kredilerini görmesini sağlamak için RLS
alter table public.user_credits enable row level security;

-- Yalnızca kendi satırını okuyabilsin; yazma işlemleri sadece server-side service_role ile yapılır
drop policy if exists "select_own_credits" on public.user_credits;
create policy "select_own_credits"
  on public.user_credits
  for select
  using (auth.uid()::text = user_id);

-- Üretilen görseller için basit generations tablosu
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  image_url text not null,
  created_at timestamptz default now(),
  constraint generations_user_fk
    foreign key (user_id) references public.users(clerk_id) on delete cascade
);

alter table public.generations enable row level security;

-- Kullanıcılar yalnızca kendi generation kayıtlarını görebilsin / ekleyebilsin
drop policy if exists "select_own_generations" on public.generations;
create policy "select_own_generations"
  on public.generations
  for select
  using (auth.uid()::text = user_id);

drop policy if exists "insert_own_generations" on public.generations;
create policy "insert_own_generations"
  on public.generations
  for insert
  with check (auth.uid()::text = user_id);

