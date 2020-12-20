FROM node:14

WORKDIR /src

COPY ["package.json", "yarn.lock", "/src/"]
COPY ["applications/matchmaking/package.json", "/src/applications/matchmaking/"]

RUN yarn

WORKDIR /src/applications/matchmaking

COPY applications/matchmaking/tsconfig.build.json ./
COPY applications/matchmaking/tsconfig.json ./
COPY applications/matchmaking/src ./src

RUN yarn build

EXPOSE 8090

ENTRYPOINT ["node", "dist/main.js"]
