# Base image
FROM node:14.17.6-alpine as build-stage

# Set working directory
WORKDIR /forms-flow-web/app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /forms-flow-web/app/node_modules/.bin:$PATH

# Install and cache app dependencies

COPY package-lock.json /forms-flow-web/app/package-lock.json
COPY package.json /forms-flow-web/app/package.json
RUN npm ci --only=production

# Copy source code
COPY . /forms-flow-web/app/

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir -p /root/.ssh
RUN chmod 0700 /root/.ssh

#RUN echo ${SSH_PRIVATE_KEY} | base64 --decode
#RUN mkdir -p /root/.ssh/id_rsa_ff_ee

#RUN  echo  ${SSH_PRIVATE_KEY} | base64 | tr -d \\n > /root/.ssh/id_rsa_ff_ee

#RUN echo ${SSH_PRIVATE_KEY} > /root/.ssh/id_rsa_ff_ee
#
# RUN mv /root/.ssh/id_rsa_ff_ee.txt /root/.ssh/id_rsa_ff_ee

COPY id_rsa_ff_ee /root/.ssh/id_rsa_ff_ee
COPY id_rsa_ff_ee.pub /root/.ssh/id_rsa_ff_ee.pub

RUN cat /root/.ssh/id_rsa_ff_ee | xargs echo -e

RUN chmod 600 /root/.ssh/id_rsa_ff_ee
RUN chmod 600 /root/.ssh/id_rsa_ff_ee.pub 

RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa_ff_ee -o IdentitiesOnly=yes' git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git -b epd-ff-ee-5.2.0 /tmp/forms-flow-ai/
#RUN git clone git@github.com:AOT-Technologies/forms-flow-ai-ee.git /tmp/forms-flow-ai/ --config core.sshCommand="ssh -i ${SSH_PRIVATE_KEY}"

RUN cp -r /tmp/forms-flow-ai/forms-flow-web/. /forms-flow-web/app


# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25.1-alpine as production-stage

# Copy built files from build stage
COPY --from=build-stage /forms-flow-web/app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]