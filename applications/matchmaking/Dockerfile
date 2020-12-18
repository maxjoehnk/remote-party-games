FROM node:13 as build

WORKDIR /src

COPY ["package.json", "applications/matchmaking/package.json", "/src/"]

RUN yarn

COPY applications/matchmaking /src/

WORKDIR /src/applications/matchmaking

RUN yarn build

EXPOSE 8090

ENTRYPOINT ["node", "dist/index.js"]
