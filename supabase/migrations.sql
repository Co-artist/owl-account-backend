create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  legacy_mongo_id text
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  content text not null,
  contact text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  icon text,
  type text not null,
  color text,
  usage_count int,
  amount_ratio int,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  amount numeric(12,2) not null,
  category text not null,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  category text not null,
  icon text,
  amount numeric(12,2) not null,
  used numeric(12,2) not null,
  usage_percentage int,
  period text,
  type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_username on users(username);
create index if not exists idx_feedback_user on feedback(user_id);
create index if not exists idx_categories_user on categories(user_id);
create index if not exists idx_transactions_user on transactions(user_id);
create index if not exists idx_budgets_user on budgets(user_id);
