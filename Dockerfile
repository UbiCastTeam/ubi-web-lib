FROM node:18-alpine

ENV IN_DOCKER 1

RUN apk upgrade --no-cache --available

RUN apk add make

COPY package.json package.json

RUN npm install

RUN rm package.json

RUN mkdir -p /apps

WORKDIR /apps
