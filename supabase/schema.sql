-- Auth/users
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  tz text default 'Asia/Bangkok',
  lat double precision default 13.8591,
  lon double precision default 100.5217,
  chart_system text default 'tropical',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "public read own" on public.profiles
  for select using (auth.uid() = id);

create policy "public upsert own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "public update own" on public.profiles
  for update using (auth.uid() = id);

-- Charts / readings cache
create table if not exists public.charts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  date date not null,
  time time not null,
  tz_offset_hours numeric not null,
  lat numeric not null,
  lon numeric not null,
  system text not null default 'tropical',
  payload jsonb not null,
  created_at timestamptz default now()
);

alter table public.charts enable row level security;

create policy "users read own charts" on public.charts
  for select using (auth.uid() = user_id);

create policy "users insert own charts" on public.charts
  for insert with check (auth.uid() = user_id);

-- Subscriptions / payments
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  plan text default 'free',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "users read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);
