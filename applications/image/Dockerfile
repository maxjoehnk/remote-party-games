FROM node:13 as build

WORKDIR /src

COPY package.json ./

RUN yarn

COPY ./ ./

EXPOSE 8091

ENV STORAGE_PATH=/etc/party-games/storage

ENTRYPOINT ["node", "src/index.js"]
