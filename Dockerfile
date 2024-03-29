# base image
FROM node:16.0.0-alpine

# Set environment variables.

ARG NEXT_PUBLIC_CHAIN_NAME
ENV NEXT_PUBLIC_CHAIN_NAME $NEXT_PUBLIC_CHAIN_NAME


# Create and change to the app directory.
WORKDIR /usr/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running yarn install on every code change.
COPY . .

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'yarn install --frozen-lockfile'.
RUN yarn install --production

# Copy local code to the container image.

RUN yarn build

# Run the web service on container startup.
CMD [ "yarn", "start" ]
