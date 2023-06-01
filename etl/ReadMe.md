# Setup environment using docker

```
cd ~\nr-epd-digital-services\backend\etl
cp sample.env .env
docker-compose build
docker-compose up -d
```
Above step will create a PostGis server with test data, Kafka and Debezium connectors required.

If you don't have a target Oracle database, you can create it using Docker with the below commands.

```
docker run -dt --name oracle21c \
--hostname dockerdb \
-p 172.18.215.225:1532:1532 -p 172.18.215.225:1521:1521 -p 172.18.215.225:5500:5500 \
-e ORACLE_PWD=Admin123 \
-v /home/ubuntu/oradata/dbconfig:/opt/oracle/oradata/dbconfig \
container-registry.oracle.com/database/express:latest
```

Note that the IP address 172.18.215.225 in this command is the local eth0 ip address on the host machine. When the oracle db is up, execute the below commands from the docker's terminal to create SSL wallet using orapki.

```
orapki wallet create -wallet /opt/oracle/wallet -pwd Admin123 -auto_login_local
orapki wallet add -wallet /opt/oracle/wallet  -pwd Admin123  -dn "CN=172.18.215.225.nip.io" -keysize 1024 -self_signed -validity 3650
orapki wallet display -wallet /opt/oracle/wallet -pwd Admin123
orapki wallet export -wallet /opt/oracle/wallet -pwd Admin123 -dn "CN=172.18.215.225.nip.io" -cert /tmp/dockerdb-certificate.crt
```

Restart oracle docker for the changes to take effect. Once the database listener is up, you can access the database using the hostname on SSL port using JDBC as shown below:

```
jdbc:oracle:thin:@(description=(address=(protocol=tcps)(host=172.18.215.225.nip.io)(port=1532))(connect_data=(service_name=XEPDB1)))
```


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
docker-compose -f docker-compose.yaml exec kafka /kafka/bin/kafka-console-consumer.sh \
     --bootstrap-server kafka:9092 \
     --from-beginning \
     --property print.key=true \
     --topic dbserver1.public.sites
```


# Delete connectors
```
curl -X DELETE localhost:8083/connectors/<connector-name>

curl -X DELETE localhost:8083/connectors/oracle-jdbc-sink-connector
curl -X DELETE localhost:8083/connectors/postgres-source-connector
```      


