FROM node:20-bullseye-slim AS base

RUN apt-get update

WORKDIR /apps
ENV PORT 80
COPY . .

# Building the app
RUN yarn cache clean
RUN yarn add sharp
RUN yarn
RUN yarn build

FROM base AS release

COPY --from=base /apps/package.json /apps/package-lock.json ./
COPY --from=base /apps/node_modules ./node_modules
COPY --from=base /apps/.next ./.next

# Running the app
CMD yarn start
