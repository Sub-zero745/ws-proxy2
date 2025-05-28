const WebSocket = require('ws');
const http = require('http');
const net = require('net');

const SSH_HOST = '5.34.178.157';
const SSH_PORT = 2086;
const WS_PATH = '/subzero';

const server = http.createServer();

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  const socket = net.connect(SSH_PORT, SSH_HOST, () => {
    ws.on('message', (msg) => socket.write(msg));
    socket.on('data', (data) => ws.send(data));
  });

  socket.on('error', () => ws.close());
  ws.on('close', () => socket.end());
});

server.on('upgrade', (req, socket, head) => {
  if (req.url === WS_PATH) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
  }
});

server.listen(process.env.PORT || 8080);
