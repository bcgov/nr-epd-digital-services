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
ARG REACT_APP_CUSTOM_LOGOUT_URL
ARG REACT_APP_CUSTOM_MAP_URL
ARG ssh_prv_key
ARG ssh_pub_key

# Set environment variables
ENV MF_FORMSFLOW_WEB_URL ${MF_FORMSFLOW_WEB_URL}
ENV MF_FORMSFLOW_NAV_URL ${MF_FORMSFLOW_NAV_URL}
ENV MF_FORMSFLOW_SERVICE_URL ${MF_FORMSFLOW_SERVICE_URL}
ENV MF_FORMSFLOW_ADMIN_URL ${MF_FORMSFLOW_ADMIN_URL}
ENV MF_FORMSFLOW_THEME_URL ${MF_FORMSFLOW_THEME_URL}
ENV NODE_ENV ${NODE_ENV}
ENV REACT_APP_CUSTOM_LOGOUT_URL ${REACT_APP_CUSTOM_LOGOUT_URL}
ENV REACT_APP_CUSTOM_MAP_URL ${REACT_APP_CUSTOM_MAP_URL}

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

# Authorize SSH Host
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

RUN echo "$ssh_prv_key" |  sed 's/\\n/\n/g'  > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" |  sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git -b epd-ff-ee-5.2.0 /tmp/forms-flow-ai/

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
