-- NobiliView Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: users
-- ============================================
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  full_name     text,
  phone         text,
  company       text,
  plan          text not null default 'demo' check (plan in ('demo', 'starter', 'agency')),
  credits       integer not null default 0,
  stripe_customer_id text,
  lemon_license_id text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================
-- TABLE: properties
-- ============================================
create table if not exists public.properties (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.users(id) on delete cascade,
  title             text not null,
  address           text,
  city              text,
  postal_code       text,
  country           text not null default 'France',
  status            text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'expired')),
  nb_rooms          integer,
  nb_baths          integer,
  surface_m2        integer,
  photos_urls       text[] not null default '{}',
  video_url         text,
  world_id          text,
  world_url         text,
  operation_id      text,
  generation_status text not null default 'pending' check (generation_status in ('pending', 'running', 'succeeded', 'failed')),
  expires_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================
-- TABLE: tours
-- ============================================
create table if not exists public.tours (
  id                uuid primary key default uuid_generate_v4(),
  property_id       uuid not null references public.properties(id) on delete cascade,
  title             text,
  world_id          text,
  cdn_url           text,
  thumbnail_url     text,
  status            text not null default 'active' check (status in ('active', 'expired', 'error')),
  nb_views          integer not null default 0,
  public_token      text unique not null default encode(gen_random_bytes(16), 'hex'),
  expires_at        timestamptz,
  created_at        timestamptz not null default now()
);

-- ============================================
-- TABLE: media_assets
-- ============================================
create table if not exists public.media_assets (
  id                  uuid primary key default uuid_generate_v4(),
  property_id         uuid not null references public.properties(id) on delete cascade,
  type                text not null check (type in ('photo', 'video')),
  url                 text not null,
  size_bytes          integer,
  worldlabs_asset_id  text,
  created_at          timestamptz not null default now()
);

-- ============================================
-- TABLE: transactions
-- ============================================
create table if not exists public.transactions (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.users(id) on delete cascade,
  type              text not null check (type in ('purchase', 'refund', 'credit_add')),
  amount_cents      integer not null default 0,
  currency          text not null default 'EUR',
  lemon_order_id    text,
  lemon_product_id  text,
  credits_added     integer,
  created_at        timestamptz not null default now()
);

-- ============================================
-- TABLE: agency_members
-- ============================================
create table if not exists public.agency_members (
  id          uuid primary key default uuid_generate_v4(),
  agency_id   uuid not null references public.users(id) on delete cascade,
  email       text not null,
  role        text not null default 'member' check (role in ('admin', 'member')),
  invited_at  timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_properties_user_id on public.properties(user_id);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_tours_property_id on public.tours(property_id);
create index if not exists idx_tours_public_token on public.tours(public_token);
create index if not exists idx_media_assets_property_id on public.media_assets(property_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.properties enable row level security;
alter table public.tours enable row level security;
alter table public.media_assets enable row level security;
alter table public.transactions enable row level security;
alter table public.agency_members enable row level security;

-- Users: users can only see/update their own row
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Properties: users can only access their own properties
create policy "Users can view own properties"
  on public.properties for select
  using (auth.uid() = user_id);

create policy "Users can insert own properties"
  on public.properties for insert
  with check (auth.uid() = user_id);

create policy "Users can update own properties"
  on public.properties for update
  using (auth.uid() = user_id);

create policy "Users can delete own properties"
  on public.properties for delete
  using (auth.uid() = user_id);

-- Tours: users can view their own tours (via property ownership)
create policy "Users can view own tours"
  on public.tours for select
  using (
    exists (
      select 1 from public.properties
      where properties.id = tours.property_id
      and properties.user_id = auth.uid()
    )
  );

-- Media assets: same as properties
create policy "Users can manage own media assets"
  on public.media_assets for all
  using (
    exists (
      select 1 from public.properties
      where properties.id = media_assets.property_id
      and properties.user_id = auth.uid()
    )
  );

-- Transactions: users can only view their own
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Public tours: anyone can view tours with public_token (for the viewer page)
create policy "Anyone can view public tours by token"
  on public.tours for select
  using (status = 'active');

-- ============================================
-- STORAGE BUCKET
-- ============================================
insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do nothing;

create policy "Anyone can read property media"
  on storage.objects for select
  using (bucket_id = 'properties');

create policy "Authenticated users can upload property media"
  on storage.objects for insert
  with check (bucket_id = 'properties');

-- ============================================
-- FUNCTION: auto-update updated_at
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function update_updated_at();