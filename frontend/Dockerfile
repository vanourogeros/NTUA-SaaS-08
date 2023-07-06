FROM --platform=linux/amd64 node:20.2
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm --omit=dev install
COPY ./ ./
ENV PORT="3000"
ENV GOOGLE_CLIENT_ID="303659298491-1khljhlgg9i80v4fcj7qtalgj4c9pcpj.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="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"
ENV NEXTAUTH_SECRET="sdfncunqwegfjwnagfcjgabsjvagjffbJFJFUOU"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_CHART_UPLOAD_URL="http://localhost/api/chart/:chartType/create"
ENV NEXT_PUBLIC_CHART_FETCH_URL="http://localhost/api/charts/:userId"
ENV NEXT_PUBLIC_USER_CREATION_URL="http://localhost/api/user/new"
ENV NEXT_PUBLIC_UPDATE_LAST_LOGIN_URL="http://localhost/api/user/updateLastLogIn/:userId"
ENV NEXT_PUBLIC_ADD_TOKENS_URL="http://localhost/api/user/tokens/:userId/:newTokens"
ENV NEXT_PUBLIC_GET_USER_INFO_URL="http://localhost/api/user/:userId"
RUN npm run build
RUN npx next telemetry disable
RUN chown -R node:node /home/node/app
USER node
ENTRYPOINT ["npx", "next", "start"]
