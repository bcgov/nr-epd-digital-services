CREATE TABLE public.epd_user (
    user_id int,
    first_name varchar(20),
    last_name varchar(20),
    email varchar(50),
    dept_id int,
    datetime_created timestamp,
    datetime_updated timestamp,
    primary key(user_id)
);

ALTER TABLE public.epd_user replica identity FULL;

insert into public.epd_user values (1, 'Scott', 'Tiger', 'scott.tiger@xyz.com', 1, now(), now());
insert into public.epd_user values (2, 'Micheal', 'Angello', 'micheal.angello@xyz.com', 1, now(), now());
insert into public.epd_user values (3, 'Angel', 'DiMaria', 'angel.maria@xyz.com', 1, now(), now());