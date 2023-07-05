FROM node:alpine
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
RUN npm run build
# RUN chown -R node:node /home/node/app
RUN npx next telemetry disable
USER node
ENTRYPOINT ["npx", "next", "start"]
