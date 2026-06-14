-- =============================================
-- LuxEvents.app — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
create type user_role as enum ('client', 'provider', 'admin');
create type provider_category as enum (
  'venue', 'catering', 'photography', 'videography',
  'dj', 'live_music', 'florist', 'decorator', 'cake',
  'hair_makeup', 'planner', 'transportation', 'photo_booth',
  'entertainment', 'lighting', 'rentals', 'officiant', 'other'
);
create type subscription_status as enum ('trial', 'active', 'past_due', 'cancelled', 'inactive');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'disputed');
create type price_type as enum ('fixed', 'starting_from', 'per_hour', 'per_person', 'custom_quote');

-- ─────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'client',
  full_name   text,
  avatar_url  text,
  phone       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Public profiles viewable" on profiles for select using (true);

-- ─────────────────────────────────────────────
-- PROVIDERS
-- ─────────────────────────────────────────────
create table providers (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references profiles(id) on delete cascade,
  business_name           text not null,
  slug                    text unique not null,
  category                provider_category not null,
  description             text,
  tagline                 text,
  city                    text,
  state                   text default 'TX',
  zip                     text,
  address                 text,
  website                 text,
  instagram               text,
  facebook                text,
  years_in_business       int,
  min_price               numeric(10,2),
  max_price               numeric(10,2),
  cover_image_url         text,
  logo_url                text,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     subscription_status default 'inactive',
  subscription_plan       text default 'basic',
  commission_rate         numeric(5,4) default 0.10,
  rating                  numeric(3,2) default 0,
  review_count            int default 0,
  is_featured             boolean default false,
  is_verified             boolean default false,
  is_active               boolean default true,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table providers enable row level security;
create policy "Anyone can view active providers" on providers for select using (is_active = true);
create policy "Providers can update own record" on providers for update using (auth.uid() = user_id);
create policy "Providers can insert own record" on providers for insert with check (auth.uid() = user_id);

create index idx_providers_category on providers(category);
create index idx_providers_city on providers(city);
create index idx_providers_slug on providers(slug);
create index idx_providers_rating on providers(rating desc);

-- ─────────────────────────────────────────────
-- PROVIDER MEDIA (photos/videos)
-- ─────────────────────────────────────────────
create table provider_media (
  id          uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references providers(id) on delete cascade,
  url         text not null,
  type        text default 'image',  -- 'image' | 'video'
  caption     text,
  is_cover    boolean default false,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

alter table provider_media enable row level security;
create policy "Anyone can view media" on provider_media for select using (true);
create policy "Provider owns media" on provider_media for all using (
  auth.uid() = (select user_id from providers where id = provider_id)
);

-- ─────────────────────────────────────────────
-- SERVICES / PACKAGES
-- ─────────────────────────────────────────────
create table services (
  id            uuid primary key default uuid_generate_v4(),
  provider_id   uuid not null references providers(id) on delete cascade,
  name          text not null,
  description   text,
  price         numeric(10,2),
  price_type    price_type default 'fixed',
  duration_hrs  numeric(5,2),
  min_guests    int,
  max_guests    int,
  is_active     boolean default true,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

alter table services enable row level security;
create policy "Anyone can view active services" on services for select using (is_active = true);
create policy "Provider manages own services" on services for all using (
  auth.uid() = (select user_id from providers where id = provider_id)
);

-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
create table bookings (
  id                      uuid primary key default uuid_generate_v4(),
  client_id               uuid not null references profiles(id),
  provider_id             uuid not null references providers(id),
  service_id              uuid references services(id),
  event_date              date not null,
  event_end_date          date,
  event_type              text,
  guest_count             int,
  venue_address           text,
  total_amount            numeric(10,2) not null,
  platform_fee            numeric(10,2) not null,
  provider_amount         numeric(10,2) not null,
  status                  booking_status default 'pending',
  stripe_payment_intent_id text,
  client_notes            text,
  provider_notes          text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table bookings enable row level security;
create policy "Clients see own bookings" on bookings for select using (auth.uid() = client_id);
create policy "Providers see their bookings" on bookings for select using (
  auth.uid() = (select user_id from providers where id = provider_id)
);
create policy "Clients create bookings" on bookings for insert with check (auth.uid() = client_id);
create policy "Provider updates booking status" on bookings for update using (
  auth.uid() = (select user_id from providers where id = provider_id)
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
create table reviews (
  id          uuid primary key default uuid_generate_v4(),
  booking_id  uuid references bookings(id),
  client_id   uuid not null references profiles(id),
  provider_id uuid not null references providers(id),
  rating      int not null check (rating between 1 and 5),
  title       text,
  body        text,
  response    text,       -- provider reply
  is_visible  boolean default true,
  created_at  timestamptz default now()
);

alter table reviews enable row level security;
create policy "Anyone can read visible reviews" on reviews for select using (is_visible = true);
create policy "Clients write own reviews" on reviews for insert with check (auth.uid() = client_id);
create policy "Providers can reply" on reviews for update using (
  auth.uid() = (select user_id from providers where id = provider_id)
);

-- Auto-update provider rating after review insert/update
create or replace function update_provider_rating()
returns trigger language plpgsql as $$
begin
  update providers set
    rating = (select avg(rating) from reviews where provider_id = NEW.provider_id and is_visible = true),
    review_count = (select count(*) from reviews where provider_id = NEW.provider_id and is_visible = true)
  where id = NEW.provider_id;
  return NEW;
end;
$$;

create trigger trg_update_provider_rating
after insert or update on reviews
for each row execute procedure update_provider_rating();

-- ─────────────────────────────────────────────
-- POSTS / TIPS (provider content)
-- ─────────────────────────────────────────────
create table posts (
  id          uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references providers(id) on delete cascade,
  title       text not null,
  body        text,
  image_url   text,
  category    text,
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table posts enable row level security;
create policy "Anyone can see published posts" on posts for select using (published = true);
create policy "Providers manage own posts" on posts for all using (
  auth.uid() = (select user_id from providers where id = provider_id)
);

-- ─────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────
create table conversations (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references profiles(id),
  provider_id uuid not null references providers(id),
  created_at  timestamptz default now()
);

create table messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references profiles(id),
  body            text not null,
  read            boolean default false,
  created_at      timestamptz default now()
);

alter table conversations enable row level security;
alter table messages enable row level security;
create policy "Participants see conversations" on conversations for select using (
  auth.uid() = client_id or
  auth.uid() = (select user_id from providers where id = provider_id)
);
create policy "Participants see messages" on messages for select using (
  auth.uid() = (select client_id from conversations where id = conversation_id) or
  auth.uid() = (select p.user_id from providers p join conversations c on c.provider_id = p.id where c.id = conversation_id)
);
create policy "Participants send messages" on messages for insert with check (auth.uid() = sender_id);

-- ─────────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────────
create table favorites (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  provider_id uuid not null references providers(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, provider_id)
);

alter table favorites enable row level security;
create policy "Users manage own favorites" on favorites for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS (run separately or in Supabase UI)
-- ─────────────────────────────────────────────
-- insert into storage.buckets (id, name, public) values ('provider-media', 'provider-media', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- ─────────────────────────────────────────────
-- HANDLE NEW USER SIGNUP (auto-create profile)
-- ─────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_providers_updated_at before update on providers
  for each row execute procedure set_updated_at();
create trigger set_bookings_updated_at before update on bookings
  for each row execute procedure set_updated_at();
create trigger set_posts_updated_at before update on posts
  for each row execute procedure set_updated_at();
