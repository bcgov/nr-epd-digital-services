ARG DEBEZIUM_VERSION

FROM maven:3.8.6-jdk-11 AS builder
WORKDIR /app/
COPY ./ ./
RUN mvn clean install

RUN echo "DEBEZIUM_VERSION is " ${DEBEZIUM_VERSION}

FROM debezium/connect:${DEBEZIUM_VERSION}

ARG ORACLE_JDBC_VERSION
ARG ORACLE_JDBC_MD5
ARG KAFKA_JDBC_VERSION
ARG ORACLE_DB_HOST
ARG ORACLE_DB_PORT

# Fetch and deploy Oracle JDBC driver
# These should point to the driver version to be used
ENV MAVEN_DEP_DESTINATION=$KAFKA_HOME/libs \
    ORACLE_JDBC_REPO="com/oracle/database/jdbc" \
    ORACLE_JDBC_GROUP="ojdbc8"

RUN docker-maven-download central "$ORACLE_JDBC_REPO" "$ORACLE_JDBC_GROUP" "$ORACLE_JDBC_VERSION" "$ORACLE_JDBC_MD5"    

# Fetch and deploy Kafka Connect JDBC
ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc
ENV KAFKA_OPTS="-Djava.security.auth.login.config=/kafka/config/connect_jaas.conf" 
RUN mkdir $KAFKA_CONNECT_JDBC_DIR

#RUN cd $KAFKA_CONNECT_JDBC_DIR && \
    #curl -sO https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/$KAFKA_JDBC_VERSION/kafka-connect-jdbc-$KAFKA_JDBC_VERSION.jar

COPY --from=builder /app/target/*.jar $KAFKA_CONNECT_JDBC_DIR/
COPY --from=builder /app/lib/*.jar $KAFKA_CONNECT_JDBC_DIR/
COPY InstallCert.class .
COPY "InstallCert\$SavingTrustManager.class" .
COPY connect-log4j.properties /kafka/config/
COPY log4j.properties /kafka/config/
COPY connect_jaas.conf /kafka/config/
COPY connect.password /kafka/config/
#COPY connect-distributed.properties /kafka/config/

RUN java InstallCert --quiet "${ORACLE_DB_HOST}:${ORACLE_DB_PORT}"
RUN keytool -exportcert -alias "$ORACLE_DB_HOST-1" -keystore jssecacerts -storepass changeit -file oracle.cer

USER root

RUN keytool -importcert -alias orakey -noprompt -keystore /etc/pki/java/cacerts -storepass changeit -file oracle.cer

USER kafka    
