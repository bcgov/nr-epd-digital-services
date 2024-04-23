# RedHat UBI 8 with nodejs 14
FROM node:16.14.0-alpine
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

# Ensure ownership of .npm folder
RUN mkdir -p /home/node/.npm \
    && chown -R node:node /home/node/.npm


# Expose port - mostly a convention, for readability
EXPOSE 4006

# Start up command

ENTRYPOINT [ "sh", "start.sh" ]