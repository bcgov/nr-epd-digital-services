# Modified by Yichun Zhao and Walter Moar


# Maven build
FROM maven:3.8.4-openjdk-17-slim AS MAVEN_TOOL_CHAIN
RUN apt-get update \
    && apt-get install -y git

# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_URL
# expect ssh private key
ARG ssh_prv_key
# expect ssh public key
ARG ssh_pub_key
# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_BRANCH
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_BRANCH epd-ff-ee-5.2.0
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_URL git@github.com:AOT-Technologies/forms-flow-ai-ee.git

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

RUN echo "$ssh_prv_key" |  sed 's/\\n/\n/g'  > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" |  sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

# Clone code
RUN git clone ${FORMFLOW_SOURCE_REPO_URL} -b ${FORMFLOW_SOURCE_REPO_BRANCH} /bpm/

RUN cp /bpm/forms-flow-bpm/pom*.xml /tmp/
RUN cp /bpm/forms-flow-bpm/settings-docker.xml /usr/share/maven/ref/
#RUN cp -r /tmp/forms-flow-ai/forms-flow-bpm/. /forms-flow-bpm/
WORKDIR /tmp/
# This allows Docker to cache most of the maven dependencies
RUN mvn -s /usr/share/maven/ref/settings-docker.xml dependency:resolve-plugins dependency:resolve dependency:go-offline -B
RUN cp -r /bpm/forms-flow-bpm/src/ /tmp/src/

#Copy custom files for EPD
COPY ./templates /tmp/src/main/resources/templates
COPY ./processes /tmp/src/main/resources/processes

RUN mvn -s /usr/share/maven/ref/settings-docker.xml package -P default

# Final custom slim java image (for apk command see 17-jdk-alpine-slim)
FROM openjdk:21-ea-jdk

# set label for image
LABEL Name="formsflow"

ENV JAVA_VERSION=21-ea+14
ENV JAVA_HOME=/opt/java/openjdk-21\
    PATH="/opt/java/openjdk-21/bin:$PATH"

EXPOSE 8080
# OpenShift has /app in the image, but it's missing when doing local development - Create it when missing
RUN test ! -d /app && mkdir /app || :
# Add spring boot application
RUN mkdir -p /app
COPY --from=MAVEN_TOOL_CHAIN /tmp/target/forms-flow-bpm.jar ./app
RUN chmod a+rwx -R /app
WORKDIR /app
VOLUME /tmp
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Dpolyglot.js.nashorn-compat=true", "-Dpolyglot.engine.WarnInterpreterOnly=false", "-jar","/app/forms-flow-bpm.jar"]
