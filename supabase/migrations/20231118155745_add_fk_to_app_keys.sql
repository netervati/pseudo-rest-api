alter table app_keys
add constraint fk_app_id
foreign key (app_id)
references apps(id)
on delete cascade;
