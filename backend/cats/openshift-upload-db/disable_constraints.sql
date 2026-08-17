DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema = 'sites'  -- change schema as needed
          AND table_type = 'BASE TABLE'
    LOOP
        BEGIN
            EXECUTE format(
                'ALTER TABLE %I.%I DISABLE TRIGGER ALL;',
                r.table_schema, r.table_name
            );
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping table %.% due to error: %',
                r.table_schema, r.table_name, SQLERRM;
        END;
    END LOOP;
END$$;
