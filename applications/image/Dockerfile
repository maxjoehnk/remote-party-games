FROM node:13 as build

WORKDIR /src

COPY ["package.json", "yarn.lock", "/src/"]
COPY ["applications/image/package.json", "/src/applications/image/"]

RUN yarn

WORKDIR /src/applications/image

COPY applications/image ./

EXPOSE 8091

ENV STORAGE_PATH=/etc/party-games/storage

ENTRYPOINT ["node", "src/index.js"]
