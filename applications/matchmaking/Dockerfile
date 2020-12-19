FROM node:14

WORKDIR /src

COPY ["package.json", "yarn.lock", "/src/"]
COPY ["applications/matchmaking/package.json", "/src/applications/matchmaking/"]

RUN yarn

COPY applications/matchmaking /src/applications/matchmaking

WORKDIR /src/applications/matchmaking

RUN yarn build

EXPOSE 8090

ENTRYPOINT ["node", "dist/main.js"]
