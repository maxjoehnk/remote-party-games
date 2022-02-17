const proxy = require('http-proxy-middleware');

const BACKEND = 'http://localhost:8090';
const IMAGE_BACKEND = 'http://localhost:8091';
const SOCKETS_BACKEND = 'http://localhost:8092';

module.exports = app => {
  app.use('/api/image', proxy.createProxyMiddleware({ target: IMAGE_BACKEND, changeOrigin: true }));
  app.use(
    '/api/socket',
    proxy.createProxyMiddleware({ target: SOCKETS_BACKEND, changeOrigin: true, ws: true })
  );
  app.use('/api', proxy.createProxyMiddleware({ target: BACKEND, changeOrigin: true }));
};
