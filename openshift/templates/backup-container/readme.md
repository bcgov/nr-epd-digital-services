# To deploy the template files
oc -n e38158-test process -f backup_build_keycloak_db.yml -p NAME=database-backup OUTPUT_IMAGE_TAG=v1 -p BASE_IMAGE_FOR_BUILD=quay.io/fedora/postgresql-14:14 | oc -n e38158-test apply -f -
		
oc -n e38158-test create configmap keycloak-backup.conf --from-file=keycloak-backup.conf


oc -n e38158-test process -f backup_deploy.yml -p NAME=keycloak-db-backup -p IMAGE_NAMESPACE=e38158-test -p SOURCE_IMAGE_NAME=database-backup -p TAG_NAME=v1 -p FTP_SECRET_KEY=epd-database-backup-ftp-secret -p BACKUP_VOLUME_NAME=keycloak-db-backup-pvc -p BACKUP_VOLUME_SIZE=1Gi -p VERIFICATION_VOLUME_SIZE=1Gi -p ENVIRONMENT_NAME=e38158-test -p CONFIG_MAP_NAME=keycloak-backup.conf -p CUSTOM_CONFIG_FILE_NAME=keycloak-backup.conf -p VERIFICATION_VOLUME_NAME=keycloak-db-backup-verification-pvc -p DATABASE_DEPLOYMENT_NAME=keycloak-db -p DATABASE_USER_KEY_NAME=database-user -p DATABASE_PASSWORD_KEY_NAME=database-password -p ENVIRONMENT_FRIENDLY_NAME="Keycloak Database e38158-test POSTGRESQL DB Backups" -p TABLE_SCHEMA="public" | oc -n e38158-test apply -f -