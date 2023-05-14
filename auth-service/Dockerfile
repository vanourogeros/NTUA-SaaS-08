# Compile TypeScript into JavaScript
# Dev dependencies are required
FROM node:20 AS builder
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run clean
RUN npm run build

# Copy JavaScript files and start app
# Dev dependencies are not required
FROM node:20
WORKDIR /app
COPY --from=builder /app/dist ./
COPY package*.json ./
RUN npm install --omit=dev
ENV APP_HOST=localhost
ENV APP_PORT=4000
EXPOSE 4000
ENTRYPOINT ["npm", "run", "start"]
