ARG APP_ROOT=/opt/app-root/src
ARG BASE_IMAGE=docker.io/node:20.9.0-alpine

#
# Build the frontend
#
FROM ${BASE_IMAGE} AS frontend

ARG APP_ROOT
ENV NO_UPDATE_NOTIFIER=true

# NPM Permission Fix
RUN mkdir -p /.npm
RUN chown -R 1001:0 /.npm

# Build Frontend
COPY --chown=1001:0 frontend ${APP_ROOT}
USER 1001
WORKDIR ${APP_ROOT}
RUN npm ci && npm run build

#
# Create the final container image
#
FROM ${BASE_IMAGE}

ARG APP_ROOT
ENV APP_PORT=8080 \
    NO_UPDATE_NOTIFIER=true \
    NPM_CONFIG_CACHE=/tmp/.npm

# NPM Permission Fix
RUN mkdir -p /tmp/.npm
RUN chown -R 1001:0 /tmp/.npm
RUN chmod -R g+rwX /tmp/.npm

# Install File Structure
COPY --from=frontend --chown=1001:0 ${APP_ROOT}/dist ${APP_ROOT}/dist
# COPY .git ${APP_ROOT}/.git # Temporarily commented out line due to OCP build failure. Unsure why it is necessary in the first place.
COPY --chown=1001:0 app ${APP_ROOT}
WORKDIR ${APP_ROOT}

# Install Application
USER 1001
WORKDIR ${APP_ROOT}/app
RUN npm ci --omit=dev

EXPOSE ${APP_PORT}
CMD ["npm", "run", "start"]
