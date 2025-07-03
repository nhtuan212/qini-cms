FROM node:20-alpine

WORKDIR /src
COPY . /src

# Building the app
RUN yarn cache clean
RUN yarn add sharp
RUN yarn
RUN yarn build
