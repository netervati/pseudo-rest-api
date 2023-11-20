create table model_data (
  id uuid primary key default uuid_generate_v4(),
  schema jsonb not null,
  model_id uuid not null,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint fk_model_id foreign key (model_id) references models(id) on delete cascade
);

alter table model_data enable row level security;
