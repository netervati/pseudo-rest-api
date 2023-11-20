alter table apps
add constraint fk_user_id
foreign key (user_id)
references auth.users(id)
on delete cascade;
