const http = require('http');
const httpProxy = require('http-proxy');

const target = 'ws://5.34.178.157:2086';

const proxy = httpProxy.createProxyServer({
  target,
  ws: true,
  changeOrigin: true,
});

const server = http.createServer((req, res) => {
  proxy.web(req, res, (err) => {
    res.writeHead(502);
    res.end("Bad gateway: " + err.message);
  });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Proxy WebSocket escuchando en puerto ${PORT}`);
});
