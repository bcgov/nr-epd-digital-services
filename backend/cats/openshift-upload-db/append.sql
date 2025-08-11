-- BELOW IS CUSTOM EPD TWEAKS
-- CUSTOM APPEND FILE


-- Custom types so that submissions over API for all form types will work.
INSERT INTO cats.app_type VALUES (4, 'SDS', 'Site Disclosure Statement', 16777215, 10053120, true, 100, 0, 'sysadmin', '2019-01-08 11:58:00', 'sysadmin', '2019-01-08 11:58:00', '\x0000000000001c07');
INSERT INTO cats.app_type VALUES (5, 'NOM', 'Notification of Likely or Actual Migration', 16777215, 39321, true, 101, 0, 'sysadmin', '2019-01-08 11:58:00', 'sysadmin', '2019-01-08 11:58:00', '\x0000000000001c08');
INSERT INTO cats.app_type VALUES (6, 'NIR', 'Notification of Independent Remediation', 16777215, 3368703, true, 102, 0, 'sysadmin', '2019-01-08 11:58:00', 'sysadmin', '2019-01-08 11:58:00', '\x0000000000001c09');
INSERT INTO cats.app_type VALUES (7, 'DERA', 'Detailed Ecological Risk Assessment', 16777215, 16711808, true, 4, 0, 'sysadmin', '2020-07-24 15:14:00', 'sysadmin', '2020-07-24 15:14:00', '\x000000000006426a');
INSERT INTO cats.app_type VALUES (8, 'SRCR', 'Site Risk Classification Report', 16777215, 16711808, true, 4, 0, 'sysadmin', '2020-07-24 15:14:00', 'sysadmin', '2020-07-24 15:14:00', '\x000000000006426a');
INSERT INTO cats.app_type VALUES (9, 'SOSC', 'Summary of Site Condition', 16777215, 16711808, true, 4, 0, 'sysadmin', '2020-07-24 15:14:00', 'sysadmin', '2020-07-24 15:14:00', '\x000000000006426a');


INSERT INTO cats.status_type VALUES (38, 'New', 'New', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (39, 'Accepted', 'Accepted', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (40, 'Resubmit', 'Additional Information Requested', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (41, 'Rejected', 'Rejected', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (42, 'Resubmitted', 'Resubmitted', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (43, 'Returned', 'Returned', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (44, 'Additional Information Requested', 'Additional Information Requested', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (45, 'Queued', 'Queued', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (46, 'Outcome Decision Made - Satisfactory', 'Outcome Decision Made - Satisfactory', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');
INSERT INTO cats.status_type VALUES (47, 'Outcome Decision Made - Unsatisfactory', 'Outcome Decision Made - Unsatisfactory', true, 25, 0, 'system', '2025-06-26 14:46:00', 'system', '2025-06-26 14:46:00', '\x0000000000064255');


-- Set "STAFF" role for some, matching earlier migration
UPDATE cats.participant_role
SET role_type = 'STAFF'
WHERE abbrev IN ('SDM', 'CSWKR','MENT');

-- Custom script so that it resets the indexes and sequences in our tables.
-- Necessary, because wtihout it new inserts will go for conflicting ids.
DO $$
DECLARE
    rec RECORD;
    seq_name TEXT;
    tbl_name TEXT;
    col_name TEXT;
    max_val BIGINT;
BEGIN
    FOR rec IN
        SELECT 
            ns.nspname AS schema_name,
            cls.relname AS seq_name,
            tab.relname AS table_name,
            att.attname AS column_name
        FROM 
            pg_class cls
        JOIN pg_namespace ns ON ns.oid = cls.relnamespace
        JOIN pg_depend dep ON dep.objid = cls.oid
        JOIN pg_class tab ON tab.oid = dep.refobjid
        JOIN pg_attribute att ON att.attrelid = tab.oid AND att.attnum = dep.refobjsubid
        WHERE cls.relkind = 'S'  -- sequence
            AND ns.nspname NOT IN ('pg_catalog', 'information_schema')
    LOOP
        EXECUTE format(
            'SELECT MAX(%I) FROM %I.%I',
            rec.column_name, rec.schema_name, rec.table_name
        ) INTO max_val;

        IF max_val IS NULL THEN
            max_val := 0;
        END IF;

        EXECUTE format(
            'SELECT setval(%L, %s, false)',
            rec.schema_name || '.' || rec.seq_name, max_val + 1
        );
        
        RAISE NOTICE 'Sequence % set to %', rec.seq_name, max_val + 1;
    END LOOP;
END $$;


