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
curl -H "Content-Type: application/json" -d @register-postgres-connector.json http://localhost:8083/connectors/ 

```

# Register Oracle jdbc sink connector

```
curl -H "Content-Type: application/json" -d @register-oracle-jdbc-sink-connector.json http://localhost:8083/connectors/

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


