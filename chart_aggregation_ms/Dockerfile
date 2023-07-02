FROM node:alpine
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
USER node
ENTRYPOINT ["node", "app.js"]
