FROM node:alpine AS builder
WORKDIR /home/node/app
COPY ./ ./
RUN npm install
RUN npx tsc

FROM node:alpine AS base
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

FROM base
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/.env ./
COPY --from=builder /home/node/app/dist ./dist
RUN npm --omit=dev install
USER node
ENTRYPOINT ["node", "./dist/app.js"]
