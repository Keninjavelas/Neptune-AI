'use strict';

const WebSocket = require('ws');
const http = require('http');

const PORT = 8080;

/**
 * Phase 3: The Hardware Bridge
 * 
 * This server acts as a relay between ESP32 hardware (or simulator)
 * and the Next.js frontend dashboard.
 */

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Neptune AI Hardware Bridge Active\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[BRIDGE] New connection established from ${ip}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`[BRIDGE] Received telemetry from node: ${data.nodeId || 'unknown'}`);
      
      // Broadcast to all other connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('[BRIDGE] Failed to parse message:', err.message);
    }
  });

  ws.on('close', () => {
    console.log(`[BRIDGE] Connection closed for ${ip}`);
  });

  ws.on('error', (err) => {
    console.error(`[BRIDGE] Socket error for ${ip}:`, err.message);
  });
});

server.listen(PORT, () => {
  console.log(`[BRIDGE] Neptune AI WebSocket Relay running on ws://localhost:${PORT}`);
});
