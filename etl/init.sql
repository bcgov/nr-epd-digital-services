CREATE TABLE public.PROTECTION_CATEGORY_CD (	
     CODE VARCHAR(40),
     primary key(CODE)
);
ALTER TABLE public.PROTECTION_CATEGORY_CD replica identity FULL;
insert into public.PROTECTION_CATEGORY_CD values ('METAL');

CREATE TABLE public.ACTIVITY_CD (	
     CODE VARCHAR(6), 
	 PROTCAT_CODE VARCHAR(40), 
	 DESCRIPTION VARCHAR(80),
     primary key(CODE)
);
ALTER TABLE public.ACTIVITY_CD replica identity FULL;
insert into public.ACTIVITY_CD values ('SS', 'METAL','SMALL SITE, SIMPLE CONTAMINATION');
insert into public.ACTIVITY_CD values ('MS', 'METAL','MEDIUM SITE, SIMPLE CONTAMINATION');
insert into public.ACTIVITY_CD values ('LS', 'METAL','LARGE SITE, SIMPLE CONTAMINATION');




CREATE TABLE public.sites
(
  id serial NOT NULL,
  bcer_code character varying(6) NOT NULL,
  sst_code character varying(6) NOT NULL,
  common_name character varying(40) NOT NULL,
  addr_type character varying(7) NOT NULL,
  addr_line_1 character varying(50) NOT NULL,
  addr_line_2 character varying(50),
  addr_line_3 character varying(50),
  addr_line_4 character varying(50),
  city character varying(30) NOT NULL,
  prov_state character varying(2) NOT NULL,
  postal_code character varying(10),
  latdeg numeric(9, 6),
  longdeg numeric(9, 6),
  victoria_file_no character varying(40),
  regional_file_no character varying(40),
  class_code character varying(6),
  general_description character varying(255),
  who_created character varying(30) NOT NULL,
  who_updated character varying(30),
  when_created timestamp without time zone NOT NULL,
  when_updated timestamp without time zone,
  rwm_flag numeric(2, 0) NOT NULL,
  rwm_general_desc_flag numeric(2, 0) NOT NULL,
  consultant_submitted character(1),
  long_degrees numeric(3, 0),
  long_minutes numeric(2, 0),
  long_seconds numeric(4, 2),
  lat_degrees numeric(3, 0),
  lat_minutes numeric(2, 0),
  lat_seconds numeric(4, 2),
  sr_status character varying(1) DEFAULT 'Y' NOT NULL,
  latlong_reliability_flag character varying(12) NOT NULL,
  site_risk_code character varying(6) DEFAULT 'UNC' NOT NULL,
  geometry public.geometry,
  CONSTRAINT sites_pkey PRIMARY KEY (id)
);

INSERT INTO public.sites (
  id, bcer_code, sst_code, common_name, addr_type, addr_line_1, addr_line_2, addr_line_3, addr_line_4, city, prov_state, postal_code, latdeg, longdeg, victoria_file_no, regional_file_no, class_code, general_description, who_created, who_updated, when_created, when_updated, rwm_flag, rwm_general_desc_flag, consultant_submitted, long_degrees, long_minutes, long_seconds, lat_degrees, lat_minutes, lat_seconds, sr_status, latlong_reliability_flag, site_risk_code, geometry
) VALUES (
  8000, 'VIC', 'NA', 'PACIFIC RIM - GENERAL/PC', 'CIVIC', 'PACIFIC RIM - GENERAL', NULL, NULL, NULL, 'TOFINO', 'BC', NULL, 49.066667, 125.666667, NULL, '9316-75/P7', 'N/A', 'W COAST OF VANCOUVER ISLAND, 10 KM S OF TOFINO', 'SISDATA4', 'JCBELL', '1996-03-07'::date, '2000-09-07'::date, 0, 20, NULL, 125, 40, 0, 49, 4, 0, 'N', 'UNCONFIRMED', 'UNC',
  ST_SetSRID(ST_MakePoint(1024386.96888567, 450096.232502132), 3005)
); 