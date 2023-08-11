# base image
FROM node:16.20.1-alpine as build-stage

# set working directory
WORKDIR /forms-flow-theme/app
 

# add `/app/node_modules/.bin` to $PATH
ENV PATH /forms-flow-theme/app/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# install and cache app dependencies

RUN git clone https://github.com/AOT-Technologies/forms-flow-ai-micro-front-ends.git /tmp/forms-flow-ai/
RUN cp -r /tmp/forms-flow-ai/forms-flow-theme/. /forms-flow-theme/app 

COPY package-lock.json /forms-flow-theme/app/package-lock.json
COPY package.json /forms-flow-theme/app/package.json

RUN npm ci

COPY . /forms-flow-theme/app/

ARG CUSTOM_SRC_DIR=src
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-theme/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}
RUN ls

RUN npm run build:webpack


FROM nginx:1.15.2-alpine as production-stage

# set label for image
LABEL Name="formsflow"

RUN mkdir /app
COPY --from=build-stage /forms-flow-theme/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3008:8080
WORKDIR /usr/share/nginx/html/config
# COPY .env .
RUN apk add --no-cache bash


CMD ["nginx", "-g", "daemon off;"]