FROM node:16.20.1-alpine

WORKDIR /forms-flow-theme/app

# Install git, bash, rsync, nodemon
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh rsync && \
    npm install -g nodemon

# Clone the repo
# Using the URL from the original Dockerfile (no branch specified in original)
RUN git clone https://github.com/AOT-Technologies/forms-flow-ai-micro-front-ends.git /tmp/forms-flow-ai/
RUN cp -r /tmp/forms-flow-ai/forms-flow-theme/. /forms-flow-theme/app

COPY package-lock.json /forms-flow-theme/app/package-lock.json
COPY package.json /forms-flow-theme/app/package.json

RUN npm ci

# Copy local source (initial overlay)
COPY . /forms-flow-theme/app/

# Copy entrypoint
COPY local_entrypoint.sh /local_entrypoint.sh
RUN chmod +x /local_entrypoint.sh

EXPOSE 3008

ENTRYPOINT ["/local_entrypoint.sh"]
