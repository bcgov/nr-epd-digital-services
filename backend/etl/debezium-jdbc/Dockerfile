ARG DEBEZIUM_VERSION

FROM quay.io/debezium/connect:$DEBEZIUM_VERSION

ARG ORACLE_VERSION
ARG KAFKA_JDBC_VERSION

# Fetch and deploy Oracle JDBC driver
RUN cd /kafka/libs && \
    curl -sO https://download.oracle.com/otn-pub/otn_software/jdbc/$ORACLE_VERSION/ojdbc8.jar

# Fetch and deploy Kafka Connect JDBC
ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc
RUN mkdir $KAFKA_CONNECT_JDBC_DIR

RUN cd $KAFKA_CONNECT_JDBC_DIR && \
    curl -sO https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/$KAFKA_JDBC_VERSION/kafka-connect-jdbc-$KAFKA_JDBC_VERSION.jar
