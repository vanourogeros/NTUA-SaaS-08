FROM node:alpine

# Install Chromium
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
USER node
ENTRYPOINT ["node", "src/app.js"]
