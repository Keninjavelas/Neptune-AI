'use strict';

const mqtt = require('mqtt');

/**
 * Initialize MQTT client for ESP32 telemetry
 * Subscribes to flow sensor and control response topics
 *
 * @param {string} brokerUrl - MQTT broker URL
 * @returns {mqtt.MqttClient}
 */
function initMqttClient(brokerUrl) {
  const client = mqtt.connect(brokerUrl, { 
    reconnectPeriod: 5000,
    clientId: 'aquaflow-backend-' + Date.now(),
  });

  client.on('connect', () => {
    console.log('[MQTT] Connected to broker');
    // Subscribe to ESP32 telemetry topics
    client.subscribe('aquaflow/esp32/+/flow', (err) => {
      if (err) console.error('[MQTT] Subscribe error:', err.message);
      else console.log('[MQTT] Subscribed to flow sensor data');
    });
  });

  client.on('error', (err) => {
    console.error('[MQTT] Client error:', err.message);
  });

  return client;
}

/**
 * Publish servo control command to ESP32
 *
 * @param {mqtt.MqttClient} client
 * @param {string} deviceId - ESP32 device ID
 * @param {number} angle - Valve angle (0-180)
 */
function sendServoControl(client, deviceId, angle) {
  const topic = `aquaflow/esp32/${deviceId}/servo/command`;
  const message = JSON.stringify({ angle, timestamp: Date.now() });
  client.publish(topic, message, (err) => {
    if (err) console.error('[MQTT] Publish error:', err.message);
    else console.log(`[MQTT] Servo command sent to ${deviceId}: ${angle}°`);
  });
}

module.exports = { initMqttClient, sendServoControl };
