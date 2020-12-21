const proxy = require('http-proxy-middleware');

const BACKEND = 'http://localhost:8090';
const IMAGE_BACKEND = 'http://localhost:8091';

module.exports = (app) => {
  app.use('/api/image', proxy.createProxyMiddleware({ target: IMAGE_BACKEND, changeOrigin: true }));
  app.use('/api', proxy.createProxyMiddleware({ target: BACKEND, changeOrigin: true, ws: true }));
}
