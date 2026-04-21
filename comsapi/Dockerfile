FROM docker.io/node:18.18.2-alpine

ARG APP_ROOT=/opt/app-root/src
ENV APP_PORT=8080 \
    NO_UPDATE_NOTIFIER=true \
    NPM_CONFIG_CACHE=/tmp/.npm
WORKDIR ${APP_ROOT}

# NPM Permission Fix
RUN mkdir -p /.npm /tmp/.npm
RUN chown -R 1001:0 /.npm /tmp/.npm
RUN chmod -R g+rwX /.npm /tmp/.npm

# Install Application
COPY . ${APP_ROOT}
RUN chown -R 1001:0 ${APP_ROOT}
USER 1001
WORKDIR ${APP_ROOT}/app
RUN npm ci --omit=dev

EXPOSE ${APP_PORT}
CMD ["node", "./bin/www"]
