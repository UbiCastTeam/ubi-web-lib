FROM node:18-alpine

ENV IN_DOCKER 1

RUN apk upgrade --no-cache --available

RUN apk add make

RUN mkdir -p /apps

WORKDIR /apps
