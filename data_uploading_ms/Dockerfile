FROM node:alpine
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
ENTRYPOINT ["node", "src/app.js"]
