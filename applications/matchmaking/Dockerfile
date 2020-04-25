FROM node:13 as build

WORKDIR /src

COPY package.json ./

RUN yarn

COPY ./ ./

EXPOSE 8090

ENTRYPOINT ["node", "src/index.js"]
