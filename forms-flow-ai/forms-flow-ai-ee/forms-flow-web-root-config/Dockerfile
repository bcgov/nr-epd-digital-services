# Base image
FROM node:14.17.6-alpine as build-stage

# Set working directory
WORKDIR /forms-flow-web-root-config/app

# Set build arguments
ARG NODE_ENV
ARG MF_FORMSFLOW_WEB_URL
ARG MF_FORMSFLOW_NAV_URL
ARG MF_FORMSFLOW_SERVICE_URL
ARG MF_FORMSFLOW_ADMIN_URL
ARG MF_FORMSFLOW_THEME_URL

# Set environment variables
ENV MF_FORMSFLOW_WEB_URL ${MF_FORMSFLOW_WEB_URL}
ENV MF_FORMSFLOW_NAV_URL ${MF_FORMSFLOW_NAV_URL}
ENV MF_FORMSFLOW_SERVICE_URL ${MF_FORMSFLOW_SERVICE_URL}
ENV MF_FORMSFLOW_ADMIN_URL ${MF_FORMSFLOW_ADMIN_URL}
ENV MF_FORMSFLOW_THEME_URL ${MF_FORMSFLOW_THEME_URL}
ENV NODE_ENV ${NODE_ENV}

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /forms-flow-web-root-config/app/node_modules/.bin:$PATH

# Install necessary packages
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Install and cache app dependencies
COPY package-lock.json /forms-flow-web-root-config/app/package-lock.json
COPY package.json /forms-flow-web-root-config/app/package.json
COPY env.sh /forms-flow-web-root-config/app/env.sh
RUN npm ci --only=production

# Copy source code
# COPY . /forms-flow-web-root-config/app/


COPY id_rsa_ff_ee /root/.ssh/id_rsa_ff_ee
COPY id_rsa_ff_ee.pub /root/.ssh/id_rsa_ff_ee.pub

RUN cat /root/.ssh/id_rsa_ff_ee | xargs echo -e

RUN chmod 600 /root/.ssh/id_rsa_ff_ee
RUN chmod 600 /root/.ssh/id_rsa_ff_ee.pub 

RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa_ff_ee -o IdentitiesOnly=yes' git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git /tmp/forms-flow-ai/
#RUN git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git /tmp/forms-flow-ai/ --config core.sshCommand="ssh -i ${SSH_PRIVATE_KEY}"

RUN cp -r /tmp/forms-flow-ai/forms-flow-web-root-config/. /forms-flow-web-root-config/app


# Customizations
ARG CUSTOM_SRC_DIR=src
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-web-root-config/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}

ARG CUSTOM_SRC_DIR=public
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-web-root-config/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}/

# Build the application
RUN if [ $NODE_ENV == "development" ]; then \
        npm run build-dev:webpack; \
    else \
        npm run build:webpack; \
    fi


# Production stage
FROM nginx:1.25.1-alpine as production-stage

# Set label for image
LABEL Name="formsflow"

# Create directories
RUN mkdir /app
WORKDIR /usr/share/nginx/html/config

# Copy built files from build stage
COPY --from=build-stage /forms-flow-web-root-config/app/dist /usr/share/nginx/html
COPY --from=build-stage /forms-flow-web-root-config/app/env.sh /usr/share/nginx/html/config

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 8080

# Install necessary packages
RUN apk add --no-cache bash

# Set execute permission for env.sh
RUN chmod +x /usr/share/nginx/html/config/env.sh

# Start Nginx server with environment setup
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
# CMD ["/bin/bash", "-c", "/usr/share/nginx/html/config/env.sh && nginx -g \"daemon off;\""]
