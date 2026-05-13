-- Finance mobile: run in Supabase SQL editor
-- Adjust policies for production (this is permissive for demos).

create extension if not exists "pgcrypto";

create table if not exists public.finance_entries (
  id uuid primary key,
  person text not null,
  amount numeric not null check (amount >= 0),
  paid_amount numeric not null default 0 check (paid_amount >= 0),
  settled boolean not null default false,
  notes text not null default '',
  occurred_on date not null,
  kind text not null check (kind in ('income', 'expense', 'saving')),
  category text not null default 'General',
  created_at timestamptz not null default now()
);

alter table public.finance_entries enable row level security;

-- Demo policy: replace with auth.uid() checks for real apps.
drop policy if exists "finance_entries_demo_all" on public.finance_entries;
create policy "finance_entries_demo_all"
on public.finance_entries
for all
using (true)
with check (true);

-- If this errors because the table is already published, you can ignore it.
alter publication supabase_realtime add table public.finance_entries;

create index if not exists finance_entries_occurred_on_idx
  on public.finance_entries (occurred_on desc);
