# base image
FROM node:16.20.1-alpine as build-stage

# set working directory
WORKDIR /forms-flow-nav/app


# add `/app/node_modules/.bin` to $PATH
ENV PATH /forms-flow-nav/app/node_modules/.bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# install and cache app dependencies


RUN git clone https://github.com/AOT-Technologies/forms-flow-ai-micro-front-ends.git -b epd-micro-ff-ee-5.2.0 /tmp/forms-flow-ai/
RUN cp -r /tmp/forms-flow-ai/forms-flow-nav/. /forms-flow-nav/app 

COPY package-lock.json /forms-flow-nav/app/package-lock.json
COPY package.json /forms-flow-nav/app/package.json

RUN npm ci


COPY . /forms-flow-nav/app/


ARG CUSTOM_SRC_DIR=src
COPY ./  /tmp/${CUSTOM_SRC_DIR}/
RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-nav/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}
RUN ls


# ARG CUSTOM_SRC_DIR=src
# COPY ./  /tmp/${CUSTOM_SRC_DIR}/
# RUN cp -R /tmp/${CUSTOM_SRC_DIR}/* /forms-flow-nav/app/ && rm -Rf /tmp/${CUSTOM_SRC_DIR}
# RUN ls



RUN ls


RUN npm run build:webpack


FROM nginx:1.15.2-alpine as production-stage

# set label for image
LABEL Name="formsflow"

RUN mkdir /app
COPY --from=build-stage /forms-flow-nav/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3005:8080
WORKDIR /usr/share/nginx/html/config
# COPY .env .
RUN apk add --no-cache bash


CMD ["nginx", "-g", "daemon off;"]