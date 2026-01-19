# Node.js 18 LTS
FROM node:18-alpine
#FROM artifacts.developer.gov.bc.ca/docker-remote/node:14.17.1-alpine

# Install packages, build and keep only prod packages
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Set NODE_ENV environment variable
#ENV NODE_ENV production

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY . ./

RUN npm run build

RUN set -x \
        && chmod -R 777 /app/

RUN apk add postgresql-client

# Expose port - mostly a convention, for readability
EXPOSE 4005

# Start up command

ENTRYPOINT [ "sh", "local_start.sh" ]