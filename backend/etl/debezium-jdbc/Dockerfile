ARG DEBEZIUM_VERSION

#FROM quay.io/debezium/connect:$DEBEZIUM_VERSION
FROM debezium/connect:$DEBEZIUM_VERSION

ARG ORACLE_JDBC_VERSION
ARG ORACLE_JDBC_MD5
ARG KAFKA_JDBC_VERSION

# Fetch and deploy Oracle JDBC driver
# These should point to the driver version to be used
ENV MAVEN_DEP_DESTINATION=$KAFKA_HOME/libs \
    ORACLE_JDBC_REPO="com/oracle/database/jdbc" \
    ORACLE_JDBC_GROUP="ojdbc8" 
    #\
    #ORACLE_JDBC_VERSION=$ORACLE_JDBC_VERSION \
    #ORACLE_JDBC_MD5=$ORACLE_JDBC_MD5

RUN docker-maven-download central "$ORACLE_JDBC_REPO" "$ORACLE_JDBC_GROUP" "$ORACLE_JDBC_VERSION" "$ORACLE_JDBC_MD5"    

# Fetch and deploy Kafka Connect JDBC
ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc
RUN mkdir $KAFKA_CONNECT_JDBC_DIR

RUN cd $KAFKA_CONNECT_JDBC_DIR && \
    curl -sO https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/$KAFKA_JDBC_VERSION/kafka-connect-jdbc-$KAFKA_JDBC_VERSION.jar

USER kafka    
