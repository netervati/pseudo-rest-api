create extension if not exists "uuid-ossp";

alter table apps
alter column id set data type uuid using id::uuid,
alter column id set default uuid_generate_v4();

alter table app_keys
alter column id set data type uuid using id::uuid,
alter column id set default uuid_generate_v4();
