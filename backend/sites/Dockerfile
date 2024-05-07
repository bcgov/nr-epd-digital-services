# RedHat UBI 8 with nodejs 14
FROM node:16.14.0-alpine

# Set npm cache directory
ENV NPM_CONFIG_CACHE=/home/node/.npm

# Install packages, build, and keep only prod packages
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies using npm ci
RUN npm ci

# Bundle app source
COPY . ./

# Build the application
RUN npm run build

# Ensure ownership of .npm folder
RUN mkdir -p /home/node/.npm \
    && chown -R node:node /home/node/.npm

# Expose port
EXPOSE 4007

# Start the API
CMD ["sh", "start.sh"]
