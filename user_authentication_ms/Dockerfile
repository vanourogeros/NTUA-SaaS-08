# Compile TypeScript into JavaScript
# Dev dependencies are required
FROM node:alpine AS builder
WORKDIR /home/node/app
COPY ./ ./
RUN npm install
RUN npx tsc

# Copy JavaScript files and start app
# Dev dependencies are not required
FROM node:alpine
WORKDIR /home/node/app
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/dist ./dist
RUN npm --omit=dev install
USER node
ENTRYPOINT ["node", "./dist/app.js"]
