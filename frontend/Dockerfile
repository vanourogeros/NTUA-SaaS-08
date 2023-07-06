FROM --platform=linux/amd64 node:20.2
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
RUN npm run build
RUN npx next telemetry disable
USER node
ENTRYPOINT ["npx", "next", "start"]
