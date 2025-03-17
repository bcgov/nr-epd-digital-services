# Build Stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy the entire app source
COPY . . 

# Build the application
RUN npm run build

# Debugging: List files in the build directory
RUN ls -la /app/build

# Deploy Stage
FROM nginx:alpine AS deploy

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
