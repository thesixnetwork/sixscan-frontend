# Stage 1: Build
FROM node:18.0.0-alpine AS builder

# Set environment variables.
ARG NEXT_PUBLIC_CHAIN_NAME
ENV NEXT_PUBLIC_CHAIN_NAME=$NEXT_PUBLIC_CHAIN_NAME

# Create and change to the app directory.
WORKDIR /usr/app

# Copy dependency manifests to the container.
COPY package*.json ./

# Install dependencies.
RUN yarn install --production

# Copy the rest of the code and build the application.
COPY . .
RUN yarn build

# Stage 2: Runtime
FROM node:18.0.0-alpine

# Set environment variables.
ARG NEXT_PUBLIC_CHAIN_NAME
ENV NEXT_PUBLIC_CHAIN_NAME=$NEXT_PUBLIC_CHAIN_NAME

# Copy only the necessary files from the builder stage.
WORKDIR /usr/app
COPY --from=builder /usr/app .

# Run the web service on container startup.
CMD [ "yarn", "start" ]
