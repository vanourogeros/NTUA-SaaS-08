FROM node:alpine
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
USER node
EXPOSE 3000
ENTRYPOINT ["npx", "next", "start"]
