# Base image
FROM node:14.17.6-alpine as build-stage

# Set working directory
WORKDIR /forms-flow-web/app

ARG ssh_prv_key
ARG ssh_pub_key

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /forms-flow-web/app/node_modules/.bin:$PATH

# Install and cache app dependencies

COPY package-lock.json /forms-flow-web/app/package-lock.json
COPY package.json /forms-flow-web/app/package.json
RUN npm ci --only=production

# Copy source code
COPY . /forms-flow-web/app/

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh


RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

RUN echo "$ssh_prv_key" |  sed 's/\\n/\n/g'  > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" |  sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git -b epd-ff-ee-5.2.0 /tmp/forms-flow-ai/

RUN cp -r /tmp/forms-flow-ai/forms-flow-web/. /forms-flow-web/app

# Customizations
ARG CUSTOM_SRC_DIR=src
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-web/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}

ARG CUSTOM_SRC_DIR=public
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-web/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}/


# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25.1-alpine as production-stage

# Copy built files from build stage
COPY --from=build-stage /forms-flow-web/app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]