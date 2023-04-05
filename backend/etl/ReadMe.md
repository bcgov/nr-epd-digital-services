# Create sample data in postgresql

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

# Register postgresql connector
```
curl -H "Content-Type: application/json" -d @register-epd-connector.json http://localhost:8083/connectors/ 


curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" \
localhost:8083/connectors/ -d '{
  "name": "epd-connector",  
  "config": {  
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "etl-postgres-1",  
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "postgres",
    "database.server.id": "184054",      
    "database.server.name": "dbserver1",
    "table.whitelist": "public.*",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false",
    "include.schema.changes": "false"
  }
}'
```

# Register Oracle jdbc sink connector

```
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" \
localhost:8083/connectors/ -d '{
    "name": "jdbc-sink",
    "config": {
        "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
        "tasks.max": "1",   
        "topics": "dbserver1.public.epd_user",
        "connection.url": "jdbc:oracle:thin:@//172.18.215.225:1521/XEPDB1",
        "connection.user": "epduser",
        "connection.password": "epdpass",
        "auto.create": "false",
        "auto.evolve":false,
        "table.name.format" : "epd_user", 
        "delete.enabled": "true",        
        "pk.fields": "user_id",
        "pk.mode": "record_key",
        "insert.mode": "upsert"
    }
}'
```

# Test with a kafka console consumer.
```
docker-compose -f docker-compose-1.7.yaml exec kafka /kafka/bin/kafka-console-consumer.sh \
     --bootstrap-server kafka:9092 \
     --from-beginning \
     --property print.key=true \
     --topic dbserver1.public.epd_user
```


# Delete connectors
```
curl -X DELETE localhost:8083/connectors/<connector-name>
```      


