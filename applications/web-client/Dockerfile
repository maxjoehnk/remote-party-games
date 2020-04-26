FROM node:13 as build

WORKDIR /src

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY ./tsconfig.json ./
COPY ./src ./src
COPY ./translations ./translations

RUN yarn build

FROM nginx:1-alpine

COPY --from=build /src/dist /usr/share/nginx/html
COPY ["nginx.conf", "/etc/nginx/conf.d/default.conf"]
