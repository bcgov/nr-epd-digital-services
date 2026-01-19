FROM node:14.17.6-alpine

WORKDIR /forms-flow-web/app

# Install git, bash, rsync, nodemon
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh rsync && \
    npm install -g nodemon

ARG FORMFLOW_SOURCE_REPO_URL
ARG FORMFLOW_SOURCE_REPO_BRANCH
ARG ssh_prv_key
ARG ssh_pub_key

ENV FORMFLOW_SOURCE_REPO_BRANCH=${FORMFLOW_SOURCE_REPO_BRANCH:-epd-ff-ee-5.2.0}
ENV FORMFLOW_SOURCE_REPO_URL=${FORMFLOW_SOURCE_REPO_URL:-git@github.com:AOT-Technologies/forms-flow-ai-ee.git}

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

RUN echo "$ssh_prv_key" | sed 's/\\n/\n/g' > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" | sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Clone upstream (AOT) then overlay local (EPD) sources
RUN git clone ${FORMFLOW_SOURCE_REPO_URL} -b ${FORMFLOW_SOURCE_REPO_BRANCH} /tmp/forms-flow-ai/
RUN cp -r /tmp/forms-flow-ai/forms-flow-web/. /forms-flow-web/app

COPY package-lock.json /forms-flow-web/app/package-lock.json
COPY package.json /forms-flow-web/app/package.json
RUN npm ci

# Copy local overlay (initial merge)
COPY . /forms-flow-web/app/

COPY local_entrypoint.sh /local_entrypoint.sh
RUN chmod +x /local_entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["/local_entrypoint.sh"]
