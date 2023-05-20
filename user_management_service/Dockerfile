FROM node:alpine AS builder
WORKDIR /home/node/app
COPY ./ ./
RUN npm install
RUN npx tsc

FROM node:alpine
WORKDIR /home/node/app
COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/dist ./dist
COPY ./.env.production ./
RUN npm --omit=dev install
USER node
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["node", "./dist/app.js"]
