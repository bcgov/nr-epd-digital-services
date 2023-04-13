# Create sample data in postgresql using init.sql


# Register postgresql connector
```
curl -H "Content-Type: application/json" -d @register-postgres-source-connector.json http://localhost:8083/connectors/ 

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


