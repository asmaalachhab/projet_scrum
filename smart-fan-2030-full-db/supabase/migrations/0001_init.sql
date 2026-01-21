-- Smart Fan Companion 2030 (Option A2) - Supabase schema
-- Compatible avec le frontend (src/app/...) et src/app/data/supabaseRepo.ts

create extension if not exists pgcrypto;

-- =========================
-- 1) TABLES
-- =========================

-- Profiles (lié à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  favorite_team text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stadiums
create table if not exists public.stadiums (
  id text primary key,
  name text not null,
  city text not null,
  country text not null,
  capacity integer not null,
  image_url text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);

-- Matches
create table if not exists public.matches (
  id text primary key,
  home_team text not null,
  away_team text not null,
  home_flag text not null,
  away_flag text not null,
  date date not null,
  time text not null,
  stadium_id text not null references public.stadiums(id) on delete restrict,
  city text not null,
  country text not null,
  phase text not null,
  price numeric(10,2) not null,
  available_seats integer not null,
  created_at timestamptz not null default now()
);

create index if not exists matches_date_idx on public.matches(date);
create index if not exists matches_stadium_idx on public.matches(stadium_id);

-- Fan zones
create table if not exists public.fan_zones (
  id text primary key,
  name text not null,
  city text not null,
  country text not null,
  lat double precision not null,
  lng double precision not null,
  capacity integer not null,
  activities text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

-- Recommendations
create table if not exists public.recommendations (
  id text primary key,
  type text not null check (type in ('hotel','restaurant','activity','transport')),
  title text not null,
  description text not null,
  price numeric(10,2) not null,
  rating numeric(3,2) not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- Chatbot FAQ (Option 2A)
create table if not exists public.chatbot_faq (
  key text primary key,
  response text not null
);

-- Tickets (privés, liés à l'utilisateur)
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id text not null references public.matches(id) on delete restrict,
  section text not null,
  row text not null,
  seat text not null,
  price numeric(10,2) not null,
  qr_code text not null,
  purchase_date timestamptz not null default now()
);

create index if not exists tickets_user_idx on public.tickets(user_id);
create index if not exists tickets_match_idx on public.tickets(match_id);

-- =========================
-- 2) UPDATED_AT helper
-- =========================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- =========================
-- 3) TRIGGER: auto-create profile on signup
-- =========================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', new.email, 'Utilisateur')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =========================
-- 4) RLS (Row Level Security)
-- =========================

alter table public.profiles enable row level security;
alter table public.stadiums enable row level security;
alter table public.matches enable row level security;
alter table public.fan_zones enable row level security;
alter table public.recommendations enable row level security;
alter table public.chatbot_faq enable row level security;
alter table public.tickets enable row level security;

-- Public read policies (anon + authenticated)
drop policy if exists "public_read_stadiums" on public.stadiums;
create policy "public_read_stadiums" on public.stadiums
for select using (true);

drop policy if exists "public_read_matches" on public.matches;
create policy "public_read_matches" on public.matches
for select using (true);

drop policy if exists "public_read_fan_zones" on public.fan_zones;
create policy "public_read_fan_zones" on public.fan_zones
for select using (true);

drop policy if exists "public_read_recommendations" on public.recommendations;
create policy "public_read_recommendations" on public.recommendations
for select using (true);

drop policy if exists "public_read_chatbot_faq" on public.chatbot_faq;
create policy "public_read_chatbot_faq" on public.chatbot_faq
for select using (true);

-- Profiles: user can read/update their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

-- Tickets: user can read/insert their own tickets
drop policy if exists "tickets_select_own" on public.tickets;
create policy "tickets_select_own" on public.tickets
for select using (auth.uid() = user_id);

drop policy if exists "tickets_insert_own" on public.tickets;
create policy "tickets_insert_own" on public.tickets
for insert with check (auth.uid() = user_id);

-- =========================
-- 5) RPC: purchase_ticket (atomic buy)
-- =========================

create or replace function public.purchase_ticket(
  p_match_id text,
  p_section text,
  p_row text,
  p_seat text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_price numeric(10,2);
  v_ticket_id uuid;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  -- lock + decrement seats
  update public.matches
  set available_seats = available_seats - 1
  where id = p_match_id and available_seats > 0
  returning price into v_price;

  if not found then
    raise exception 'SOLD_OUT';
  end if;

  insert into public.tickets (user_id, match_id, section, row, seat, price, qr_code)
  values (
    auth.uid(),
    p_match_id,
    p_section,
    p_row,
    p_seat,
    v_price,
    'TICKET-' || gen_random_uuid()::text
  )
  returning id into v_ticket_id;

  return json_build_object('ticket_id', v_ticket_id::text);
end;
$$;

-- Grant execute to anon/auth (function itself checks auth.uid())
grant execute on function public.purchase_ticket(text, text, text, text) to anon, authenticated;
