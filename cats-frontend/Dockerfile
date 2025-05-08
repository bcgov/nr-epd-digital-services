# "build-stage", based on Node.js, to build and compile the frontend
# pull official base image
FROM node:22-alpine AS build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# Switching to `npm ci` from `npm install` for consistent builds
RUN npm ci --silent

# create and set user permissions to app folder

# add app files
COPY . ./
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine AS deploy
RUN mkdir /app
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
