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

EXPOSE 3000:3000
CMD ["nginx", "-g", "daemon off;"]