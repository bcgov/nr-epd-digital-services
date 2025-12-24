FROM node:16.20.1-alpine

WORKDIR /forms-flow-nav/app

# Install git, bash, rsync, nodemon
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh rsync && \
    npm install -g nodemon

# Clone the repo
# Using the URL and branch from the original Dockerfile
RUN git clone https://github.com/AOT-Technologies/forms-flow-ai-micro-front-ends.git -b epd-micro-ff-ee-5.2.0 /tmp/forms-flow-ai/
RUN cp -r /tmp/forms-flow-ai/forms-flow-nav/. /forms-flow-nav/app

COPY package-lock.json /forms-flow-nav/app/package-lock.json
COPY package.json /forms-flow-nav/app/package.json

RUN npm ci

# Copy local source (initial overlay)
COPY . /forms-flow-nav/app/

# Copy entrypoint
COPY local_entrypoint.sh /local_entrypoint.sh
RUN chmod +x /local_entrypoint.sh

EXPOSE 3005

ENTRYPOINT ["/local_entrypoint.sh"]
