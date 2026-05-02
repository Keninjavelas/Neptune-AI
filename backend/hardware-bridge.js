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
  
  // Default role is unknown until they send a message
  ws.role = 'unknown';

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // 1. Identify Client Role
      if (data.type === 'dashboard') {
        ws.role = 'dashboard';
        console.log(`[BACKEND] Client at ${ip} identified as DASHBOARD`);
        return;
      }
      if (data.type === 'esp32' || data.flowRate !== undefined) {
        ws.role = 'esp32';
        if (data.type === 'esp32') {
          console.log(`[BACKEND] Client at ${ip} identified as ESP32`);
          return;
        }
      }

      // 2. Handle Commands (Dashboard -> ESP32)
      if (data.command) {
        console.log(`[DASHBOARD] Command received: ${data.command}`);
        console.log(`[BACKEND] Forwarding to ESP32 clients...`);
        
        let forwardCount = 0;
        wss.clients.forEach((client) => {
          // Forward only to ESP32 clients
          if (client.readyState === WebSocket.OPEN && client.role === 'esp32') {
            client.send(JSON.stringify(data));
            forwardCount++;
          }
        });
        console.log(`[BACKEND] Command routed to ${forwardCount} nodes`);
        return;
      }

      // 3. Handle Telemetry (ESP32 -> Dashboard)
      if (data.flowRate !== undefined || data.nodeId) {
        // Ensure role is marked as esp32 if telemetry is coming through
        ws.role = 'esp32';
        
        // Broadcast telemetry to all DASHBOARD clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.role === 'dashboard') {
            client.send(JSON.stringify(data));
          }
        });
        return;
      }

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
