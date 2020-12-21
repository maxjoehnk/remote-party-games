FROM node:14 as build

WORKDIR /src

COPY ["package.json", "yarn.lock", "/src/"]
COPY ["applications/web-client/package.json", "/src/applications/web-client/"]

RUN yarn

WORKDIR /src/applications/web-client

COPY applications/web-client/tsconfig.json ./
COPY applications/web-client/src ./src
COPY applications/web-client/translations ./translations

RUN yarn build

FROM nginx:1-alpine

COPY --from=build /src/applications/web-client/dist /usr/share/nginx/html
COPY ["applications/web-client/nginx.conf", "/etc/nginx/conf.d/default.conf"]
