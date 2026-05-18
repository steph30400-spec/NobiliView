-- NobiliView PostgreSQL schema

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  full_name text,
  phone text,
  company text,
  plan text not null default 'demo' check (plan in ('demo', 'starter', 'agency')),
  credits integer not null default 0,
  lemon_license_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  address text,
  city text,
  postal_code text,
  country text not null default 'France',
  status text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'expired')),
  nb_rooms integer,
  nb_baths integer,
  surface_m2 integer,
  photos_urls text[] not null default '{}',
  video_url text,
  world_id text,
  world_url text,
  operation_id text,
  generation_status text not null default 'pending' check (generation_status in ('pending', 'running', 'succeeded', 'failed')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  title text,
  world_id text,
  cdn_url text,
  thumbnail_url text,
  status text not null default 'active' check (status in ('active', 'expired', 'error')),
  nb_views integer not null default 0,
  public_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  type text not null check (type in ('photo', 'video', 'splat')),
  url text not null,
  object_key text,
  size_bytes bigint,
  worldlabs_asset_id text,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('purchase', 'refund', 'credit_add')),
  amount_cents integer not null default 0,
  currency text not null default 'EUR',
  lemon_order_id text,
  lemon_product_id text,
  credits_added integer,
  created_at timestamptz not null default now()
);

create table if not exists agency_members (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references users(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_at timestamptz not null default now()
);

create index if not exists idx_properties_user_id on properties(user_id);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_tours_property_id on tours(property_id);
create index if not exists idx_tours_public_token on tours(public_token);
create index if not exists idx_media_assets_property_id on media_assets(property_id);
create index if not exists idx_transactions_user_id on transactions(user_id);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on users;
create trigger trg_users_updated_at
  before update on users
  for each row execute function update_updated_at();

drop trigger if exists trg_properties_updated_at on properties;
create trigger trg_properties_updated_at
  before update on properties
  for each row execute function update_updated_at();

