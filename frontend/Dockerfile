FROM node:20.2
WORKDIR /home/node/app
RUN apt-get -y update
RUN apt-get -y install libcairo2-dev libjpeg-dev libgif-dev libpango-1.0.0
#ENV PYTHONUNBUFFERED=1
#RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
#RUN python3 -m ensurepip
#RUN pip3 install --no-cache --upgrade pip setuptools
COPY ./package*.json ./
#RUN npm install -g npm
RUN npm --omit=dev install
COPY ./ ./
RUN npm run build
# RUN chown -R node:node /home/node/app
RUN npx next telemetry disable
USER node
ENTRYPOINT ["npx", "next", "start"]
