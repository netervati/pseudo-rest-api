create table models (
  id uuid primary key default uuid_generate_v4(),
  schema jsonb not null,
  app_id uuid not null,
  user_id uuid not null,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint fk_app_id foreign key (app_id) references apps(id) on delete cascade,
  constraint fk_user_id foreign key (user_id) references auth.users(id) on delete cascade
);

alter table models enable row level security;
