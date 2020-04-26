const Parcel = require('parcel');
const express = require('express');
const proxy = require('http-proxy-middleware');

const BACKEND = 'http://localhost:8090';
const IMAGE_BACKEND = 'http://localhost:8091';
const ENTRYPOINT = 'src/index.html';

const bundler = new Parcel(ENTRYPOINT);
const app = express();

app.use('/api/image', proxy.createProxyMiddleware({ target: IMAGE_BACKEND, changeOrigin: true }));
app.use('/api', proxy.createProxyMiddleware({ target: BACKEND, changeOrigin: true, ws: true }));
app.use(bundler.middleware());

app.listen(1234);
