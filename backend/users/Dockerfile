# RedHat UBI 8 with nodejs 14
FROM node:14.5.0-alpine


# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./

RUN set -x \
        && chmod -R 777 /app/

RUN apk add postgresql-client

#RUN ./initDB.sh

# --only=prod
RUN npm ci

 
    # npm run build

# Deployment container
# FROM node:lts-alpine
# WORKDIR /app
# Set node to production
# ENV NODE_ENV production
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist

#ss-20-Error:permission denied, mkdir 'logs/'fix
# RUN mkdir -p /app/logs/
# RUN set -x \
#     && chmod -Rv  777  /app/logs/

# Expose port - mostly a convention, for readability
EXPOSE 3005



# Start up command, with max heap size as 50Megs
#ENTRYPOINT ["sh", "-c","npm i && npm run start"]
ENTRYPOINT [ "sh", "start.sh" ]