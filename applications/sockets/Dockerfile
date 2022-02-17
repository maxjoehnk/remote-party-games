FROM node:14

WORKDIR /src

COPY ["package.json", "yarn.lock", "/src/"]
COPY ["applications/sockets/package.json", "/src/applications/sockets/"]

RUN yarn

WORKDIR /src/applications/sockets

COPY applications/sockets/tsconfig.build.json ./
COPY applications/sockets/tsconfig.json ./
COPY applications/sockets/src ./src

RUN yarn build

EXPOSE 8092

ENTRYPOINT ["node", "dist/main.js"]
