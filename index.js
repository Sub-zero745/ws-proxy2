const http = require('http');
const httpProxy = require('http-proxy');

const target = 'ws://207.174.40.206:80';

const proxy = httpProxy.createProxyServer({
  target,
  ws: true,
  changeOrigin: true,
});

const server = http.createServer((req, res) => {
  proxy.web(req, res, (err) => {
    console.error("Error proxy.web:", err);
    res.writeHead(502);
    res.end("Bad gateway: " + err.message);
  });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, (err) => {
    console.error("Error proxy.ws:", err);
    socket.destroy();
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Proxy WebSocket escuchando en puerto ${PORT}`);
});
