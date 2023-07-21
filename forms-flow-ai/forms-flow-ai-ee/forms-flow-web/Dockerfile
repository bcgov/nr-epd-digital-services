FROM node:14.17.6-alpine as build-stage

WORKDIR /forms-flow-web/app


ARG NODE_ENV
ARG REACT_APP_API_SERVER_URL
ARG REACT_APP_API_PROJECT_URL
ARG REACT_APP_KEYCLOAK_CLIENT
ARG REACT_APP_WEB_BASE_URL
ARG REACT_APP_BPM_URL
ARG REACT_APP_WEBSOCKET_ENCRYPT_KEY
ARG REACT_APP_KEYCLOAK_URL_REALM
ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_APPLICATION_NAME
ARG REACT_APP_USER_ACCESS_PERMISSIONS
ARG REACT_APP_WEB_BASE_CUSTOM_URL
ARG REACT_APP_MULTI_TENANCY_ENABLED
ARG REACT_APP_MT_ADMIN_BASE_URL
ARG REACT_APP_MT_ADMIN_BASE_URL_VERSION
ARG REACT_APP_CUSTOM_SUBMISSION_URL
ARG REACT_APP_CUSTOM_SUBMISSION_ENABLED
ARG REACT_APP_DRAFT_ENABLED
ARG REACT_APP_DRAFT_POLLING_RATE
ARG REACT_APP_EXPORT_PDF_ENABLED
ARG REACT_APP_DOCUMENT_SERVICE_URL
ARG REACT_APP_CUSTOM_LOGOUT_URL
ARG REACT_APP_CUSTOM_MAP_URL
ARG ssh_prv_key
ARG ssh_pub_key

ENV NODE_ENV ${NODE_ENV}
ENV REACT_APP_API_SERVER_URL ${REACT_APP_API_SERVER_URL}
ENV REACT_APP_API_PROJECT_URL ${REACT_APP_API_PROJECT_URL}
ENV REACT_APP_KEYCLOAK_CLIENT ${REACT_APP_KEYCLOAK_CLIENT}
ENV REACT_APP_WEB_BASE_URL ${REACT_APP_WEB_BASE_URL}
ENV REACT_APP_BPM_URL ${REACT_APP_BPM_URL}
ENV REACT_APP_WEBSOCKET_ENCRYPT_KEY ${REACT_APP_WEBSOCKET_ENCRYPT_KEY}
ENV REACT_APP_KEYCLOAK_URL_REALM ${REACT_APP_KEYCLOAK_URL_REALM}
ENV REACT_APP_KEYCLOAK_URL ${REACT_APP_KEYCLOAK_URL}
ENV REACT_APP_APPLICATION_NAME ${REACT_APP_APPLICATION_NAME}
ENV REACT_APP_USER_ACCESS_PERMISSIONS ${REACT_APP_USER_ACCESS_PERMISSIONS}
ENV REACT_APP_WEB_BASE_CUSTOM_URL ${REACT_APP_WEB_BASE_CUSTOM_URL}
ENV REACT_APP_CUSTOM_SUBMISSION_URL ${REACT_APP_CUSTOM_SUBMISSION_URL}
ENV REACT_APP_MULTI_TENANCY_ENABLED ${REACT_APP_MULTI_TENANCY_ENABLED}
ENV REACT_APP_MT_ADMIN_BASE_URL ${REACT_APP_MT_ADMIN_BASE_URL}
ENV REACT_APP_MT_ADMIN_BASE_URL_VERSION ${REACT_APP_MT_ADMIN_BASE_URL_VERSION}
ENV REACT_APP_CUSTOM_SUBMISSION_ENABLED ${REACT_APP_CUSTOM_SUBMISSION_ENABLED}
ENV REACT_APP_DRAFT_ENABLED ${REACT_APP_DRAFT_ENABLED}
ENV REACT_APP_DRAFT_POLLING_RATE ${REACT_APP_DRAFT_POLLING_RATE}
ENV REACT_APP_EXPORT_PDF_ENABLED ${REACT_APP_EXPORT_PDF_ENABLED}
ENV REACT_APP_DOCUMENT_SERVICE_URL ${REACT_APP_DOCUMENT_SERVICE_URL}
ENV REACT_APP_CUSTOM_LOGOUT_URL ${REACT_APP_CUSTOM_LOGOUT_URL}
ENV REACT_APP_CUSTOM_MAP_URL ${REACT_APP_CUSTOM_MAP_URL}

ENV PATH /forms-flow-web/app/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh



   # Authorize SSH Host
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

# Add the keys and set permissions
# RUN echo "$ssh_prv_key" > /root/.ssh/id_rsa && \
#     echo "$ssh_pub_key" > /root/.ssh/id_rsa.pub && \
#     chmod 600 /root/.ssh/id_rsa && \
#     chmod 600 /root/.ssh/id_rsa.pub

RUN echo "$ssh_prv_key" |  sed 's/\\n/\n/g'  > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" |  sed 's/\\n/\n/g' > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub




# Strip any newlines from the ssh file.
# OpenShift does this when converting to string.  
# So this command is only necessary for openshift, but is okay everywhere.
# RUN sed 's/\\n/\n/g' /root/.ssh/id_rsa > /root/.ssh/id_rsa
# RUN sed 's/\\n/\n/g' /root/.ssh/id_rsa.pub > /root/.ssh/id_rsa.pub

RUN echo "Begin debug logging"
RUN cat /root/.ssh/id_rsa
RUN cat /root/.ssh/id_rsa.pub
RUN echo "End debug logging"

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts


RUN git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git /tmp/forms-flow-ai/

RUN cp -r /tmp/forms-flow-ai/forms-flow-web/. /forms-flow-web/app

COPY package-lock.json /forms-flow-web/app/package-lock.json
COPY package.json /forms-flow-web/app/package.json
COPY package.json /forms-flow-web/app/craco.config

RUN npm install
COPY . /forms-flow-web/app/

# Customizations
ARG CUSTOM_SRC_DIR=src
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-web/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}

ARG CUSTOM_SRC_DIR=public
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-web/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}/


WORKDIR /forms-flow-web/app/

RUN npm run build

RUN echo ls

FROM nginx:1.22 as production-stage
RUN mkdir /app
COPY --from=build-stage /forms-flow-web/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]

