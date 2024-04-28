FROM node:20-alpine

WORKDIR /src
COPY . /src

# Building the app
RUN npm cache verify
RUN npm install
RUN npm run build
