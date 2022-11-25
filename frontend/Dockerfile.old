# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/ubi as builder
RUN dnf module install -y nodejs:14

# Set the working directory to /app inside the container
WORKDIR /app

COPY ./package*.json ./
RUN npm ci

# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN npm install 
RUN npm ci

RUN npm run build

EXPOSE 3000

# Start the app
CMD [ "npx", "serve", "build" ]