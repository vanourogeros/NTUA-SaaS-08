FROM node:alpine
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
RUN npm run build
USER node
ENTRYPOINT ["npx", "next", "start"]
