FROM node:16.10
WORKDIR /app/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3027
CMD ["node", "index.js"]
