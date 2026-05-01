'use strict';

const http = require('http');
const createApp = require('../app');
const { createWsServer } = require('./wsServer');
const { initMqttClient } = require('./mqttClient');
const { initDb, query } = require('./db');

async function startApiService(env) {
  // Initialize database
  await initDb(env.DATABASE_URL);

  // Create Express app
  const app = createApp();
  const server = http.createServer(app);

  // Create WebSocket server for real-time updates
  const wsServer = createWsServer(server);

  // Initialize MQTT client to receive telemetry from ESP32
  const mqttClient = initMqttClient(env.MQTT_BROKER_URL);

  // When MQTT publishes telemetry, broadcast to WebSocket clients
  mqttClient.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      wsServer.broadcast('telemetry', { topic, data, timestamp: Date.now() });
    } catch (e) {
      console.error('Failed to parse MQTT message:', e.message);
    }
  });

  const port = env.PORT || 3000;
  server.listen(port, () => {
    console.log(`[INFO] AquaFlow AI server listening on port ${port}`);
  });

  async function shutdown() {
    console.log('[INFO] Shutting down...');
    mqttClient.end();
    await new Promise((resolve) => server.close(resolve));
  }

  process.once('SIGINT', () => shutdown().finally(() => process.exit(0)));
  process.once('SIGTERM', () => shutdown().finally(() => process.exit(0)));

  return { server, wsServer, mqttClient, query, shutdown };
}

module.exports = { startApiService };