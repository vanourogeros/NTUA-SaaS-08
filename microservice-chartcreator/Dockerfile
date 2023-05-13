# syntax=docker/dockerfile:1

# use a very lighweight version of node
FROM node:alpine

# create app directory
WORKDIR /charter-app

# copy everything to the working directory
COPY . .

# set up our app
RUN apk add chromium
RUN npm ci --omit=dev
EXPOSE 51470
CMD export CHROMIUM_DIR="$(which chromium-browser)" && npm run build:prod