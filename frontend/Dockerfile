# test
FROM node:14 as build-stage
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build 

FROM nginx:1.23.2 as production-stage
#COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir /app
#COPY --from=build-stage /app/dist /app
# Configure NGINX

COPY ./openshift/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./openshift/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx

EXPOSE 3000:3000
CMD ["nginx", "-g", "daemon off;"]