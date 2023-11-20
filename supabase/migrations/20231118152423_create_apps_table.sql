create table apps (
  id uuid primary key,
  title varchar not null,
  description text,
  user_id uuid not null,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
