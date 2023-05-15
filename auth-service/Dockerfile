# Compile TypeScript into JavaScript
# Dev dependencies are required
FROM node:20-alpine AS builder
WORKDIR /home/node/app
COPY ./ ./
RUN npm install
RUN npx tsc

# Copy JavaScript files and start app
# Dev dependencies are not required
FROM node:20-alpine
WORKDIR /home/node/app
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/dist ./dist
RUN npm --omit=dev install
USER node
EXPOSE 3000
ENV NODE_ENV=production
ENV APP_HOST=localhost
ENV APP_PORT=3000
ENV GOOGLE_CLIENT_ID=1052495587846-i3c0q2ij2clbd7j1j7v9r3knmqks8iod.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENTRYPOINT ["node", "./dist/app.mjs"]
