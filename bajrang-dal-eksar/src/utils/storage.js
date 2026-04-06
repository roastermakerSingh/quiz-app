// ─── Storage Keys (localStorage — only for session + quiz state) ──
export const KEYS = {
  ADMIN_SESSION:    'bde_admin_session',
  QUIZ_STATE:       'bde_quiz_state',
  RESULTS_PUBLISHED:'bde_results_published',
};

// ─── localStorage helpers ─────────────────────────────────────────
export const db = {
  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : def;
    } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
};

// ─── SQL schema for Supabase setup ────────────────────────────────
export const SUPABASE_SCHEMA = `
-- Run this in Supabase → SQL Editor

create table if not exists images (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  public_id   text,
  caption     text default '',
  year        text default '',
  created_at  timestamptz default now()
);

create table if not exists questions (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  options     jsonb not null,
  correct     int  not null,
  created_at  timestamptz default now()
);

create table if not exists participants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  mobile      text not null unique,
  score       int  default 0,
  total       int  default 0,
  created_at  timestamptz default now()
);

create table if not exists members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  age         int,
  address     text,
  mobile      text not null unique,
  email       text,
  photo_url   text,
  photo_public_id text,
  status      text default 'pending',  -- pending | approved | rejected
  created_at  timestamptz default now()
);

create table if not exists donations (
  id              uuid primary key default gen_random_uuid(),
  donor_name      text,
  donor_email     text,
  donor_mobile    text,
  amount          int  not null,
  payment_id      text,
  payment_status  text default 'pending',
  message         text,
  created_at      timestamptz default now()
);

create table if not exists settings (
  key    text primary key,
  value  text
);

-- Enable Row Level Security
alter table images       enable row level security;
alter table questions    enable row level security;
alter table participants enable row level security;
alter table members      enable row level security;
alter table donations    enable row level security;
alter table settings     enable row level security;

-- Allow all reads (public)
create policy "Public read images"       on images       for select using (true);
create policy "Public read questions"    on questions    for select using (true);
create policy "Public read participants" on participants for select using (true);
create policy "Public read members"      on members      for select using (status = 'approved');
create policy "Public read donations"    on donations    for select using (true);
create policy "Public read settings"     on settings     for select using (true);

-- Allow all inserts from anon (members, donations, participants)
create policy "Public insert members"      on members      for insert with check (true);
create policy "Public insert donations"    on donations    for insert with check (true);
create policy "Public insert participants" on participants for insert with check (true);

-- Allow all operations (for admin via anon key — acceptable for this app)
create policy "Admin all images"    on images    for all using (true) with check (true);
create policy "Admin all questions" on questions for all using (true) with check (true);
create policy "Admin all members"   on members   for all using (true) with check (true);
create policy "Admin all settings"  on settings  for all using (true) with check (true);
create policy "Admin all donations" on donations for all using (true) with check (true);
`;
