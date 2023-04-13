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

CREATE TABLE public.address (
    addr_id int,
    building_number int,
    street_name varchar(50),
    street_type varchar(20),
    direction varchar(20),
    city varchar(20),
    province varchar(20),
    postal_code varchar(20),
    datetime_created timestamp,
    datetime_updated timestamp,
    primary key(addr_id)
);

ALTER TABLE public.epd_user replica identity FULL;
ALTER TABLE public.address replica identity FULL;

insert into public.epd_user values (1, 'Scott', 'Tiger', 'scott.tiger@xyz.com', 1, now(), now());
insert into public.epd_user values (2, 'Micheal', 'Angello', 'micheal.angello@xyz.com', 1, now(), now());
insert into public.epd_user values (3, 'Angel', 'DiMaria', 'angel.maria@xyz.com', 1, now(), now());

insert into public.address values (1, '2255', 'Pandora', 'Ave', 'S', 'Victoria','B.C','V9B 2X4',now(), now());