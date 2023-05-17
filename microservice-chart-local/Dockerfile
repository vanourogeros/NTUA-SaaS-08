FROM node:alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# create app directory
WORKDIR /charter-app

# copy everything to the working directory
COPY . .
RUN npm ci --omit=dev
EXPOSE 6000
CMD node index.mjs