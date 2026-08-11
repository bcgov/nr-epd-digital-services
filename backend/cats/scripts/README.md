# Utility Scripts

These scripts currently just bootstrap and migrate the database. I've written
all of them in posix compliant sh because I'm assuming an Alpine Linux image
which ships with ASH instead of BASH. This choice will ensure maximum
portability even if they have less syntactic sugar.

These are expected to be run with `backend/` as the current working directory,
so `src_dir/backend/ $> scripts/migrate_database.sh`.
