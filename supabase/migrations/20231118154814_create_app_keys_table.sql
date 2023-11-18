create table app_keys (
  id uuid primary key,
  app_key varchar not null,
  secret_key varchar not null,
  app_id uuid not null,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table app_keys enable row level security;
