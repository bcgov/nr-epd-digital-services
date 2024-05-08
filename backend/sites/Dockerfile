# RedHat UBI 8 with nodejs 16
FROM node:16.14.0-alpine

# Set npm cache directory
ENV NPM_CONFIG_CACHE=/home/node/.npm

# NPM Permission Fix
RUN mkdir -p /home/node/.npm \
    && chown -R 1001:0 /home/node/.npm

# Install packages, build, and keep only prod packages
WORKDIR /app
#test

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies using npm ci
RUN npm ci

# Bundle app source
COPY . ./

# Change ownership of files to non-root user
RUN chown -R 1001:0 /app \
    && chmod -R g=u /app

# Switch to non-root user
USER 1001
#test

# Build the application
RUN npm run build

# Expose port
EXPOSE 4007

# Start the API
CMD ["sh", "start.sh"]