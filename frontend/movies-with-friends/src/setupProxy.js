const { createProxyMiddleware } = require('http-proxy-middleware');
const { REACT_APP_BASE_URL } = process.env;

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api', {
      target: REACT_APP_BASE_URL,
      changeOrigin: true,
      headers: {
        Connection: "keep-alive"
      }
    })
  );
}