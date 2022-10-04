process.env.POSTGRESQL_HOST="localhost"
process.env.POSTGRESQL_DATABASE="postgres"
process.env.POSTGRESQL_USER="postgres"
process.env.POSTGRESQL_PORT=5432
process.env.POSTGRESQL_AUTOLOAD_ENTITIES = true
process.env.POSTGRESQL_SYNC = true

process.env.LOGGER_FILE_NAME='local-application-%DATE%.log'
process.env.LOGGER_DIR_NAME='./logs'
process.env.LOGGER_LEVEL='info'
process.env.LOGGER_MAX_SIZE =  '20m'
process.env.LOGGER_MAX_FILES = '14d'
process.env.LOGGER_HANDLE_EXCEPTIONS=true
process.env.LOGGER_JSON=false
process.env.LOGGER_ZIP_ARCHIVE=true
