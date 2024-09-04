# Backup notes and scripts to help

## How to clone backup locally
```sh
# Get backup from OpenShift to local
oc rsync epd-database-backup-8-vxkx8:/backups/ /Users/adamcoard/Dev/nr-epd-digital-services/backups/prod4 -n *****-prod


# Get backup from local to OpenShift, useful when restoring a db pod.  Note: The `aot-tmp` folder must be created before, instructions are lower down.
oc rsync /Users/adamcoard/Dev/nr-epd-digital-services/backups/dev/daily/2023-11-06/ postgresql-mk2-1-68jqc:/var/lib/pgsql/data/aot-tmp -n *****-dev
```



How to restore backup:


```sh
## How to Restore Backup

#### Working through test

# get latest backup from openshift to local
oc rsync epd-database-backup-5-bk5vv:/backups/ /Users/adamcoard/Dev/nr-epd-digital-services/backups/test -n *****-test
gunzip ...
# Login to terminal of destination db, then mkdir
# This is the folder we are going to upload the backup to
# VERIFY THIS PATH EXISTS IN THE PVC ON OPENSHIFT! For most cases this path should be okay, as `/home/postgres/pgdata` is in pvc
mkdir /home/postgres/pgdata/aot-temp


# From your desktop, update path to where backup is
# oc rsync /Users/adamcoard/Dev/nr-epd-digital-services/backups/prod/cust patroni-coms-0:/home/postgres/pgdata/aot-temp -n *****-test
oc rsync /Users/adamcoard/Dev/nr-epd-digital-services/backups/prod/cust coms-patroni-mk2-0:/home/postgres/pgdata/aot-temp -n *****-prod

# BACK to DB POD: Verify backup exists on pod
cd /home/postgres/pgdata/aot-temp/cust # Subpath might vary a bit depending on your local folder structure, i.e. I had a 'cust' / custom one.
ls

psql
CREATE DATABASE "epd_dev";
# first create roles, they may be missing
# get passwords from the epd-database secret, and copy those.
CREATE ROLE epdapplications LOGIN PASSWORD '[PW HERE]';
CREATE ROLE epdusers LOGIN PASSWORD '[PW HERE]';

\q # Quit psql, now load file into newly created db.

psql -U postgres -d epd_dev < epd-database-epd_dev_2023-10-15_01-00-00.sql

# load in postgres from mk2 pod
# psql -U postgres -d epd_dev < epd-fixed-nobinary.sql

# AT THIS POINT SHOULD BE DONE, FURTHER COMMANDS TO HELP DEBUG OR VERIFY


psql
\c epd_dev
# optional, if permission issues
GRANT ALL ON SCHEMA epd_applications to epdapplications;
GRANT ALL ON SCHEMA epd_users to epdusers;
GRANT ALL ON ALL TABLES IN SCHEMA epd_applications TO "epdapplications";
GRANT ALL ON ALL TABLES IN SCHEMA epd_users TO "epdusers";
# verify with
\du

# Optional, set root postgress pw
ALTER USER postgres WITH PASSWORD '[PW HERE]';

```