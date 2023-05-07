FROM node:16.10
WORKDIR /app/
COPY . /app
RUN npm install
RUN npm run build
ENTRYPOINT npm run start