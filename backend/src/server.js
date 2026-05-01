'use strict';

const { getEnv } = require('./config/env');

const REQUIRED_ENV_VARS = ['DATABASE_URL', 'MQTT_BROKER_URL'];

function validateEnv(env = process.env) {
  const missing = REQUIRED_ENV_VARS.filter((name) => !env[name]);
  for (const name of missing) {
    console.error(`[FATAL] Missing required environment variable: ${name}`);
  }
  if (missing.length > 0) {
    process.exit(1);
  }
}

function startServer() {
  validateEnv();
  const env = getEnv();
  const { startApiService } = require('./services/apiService');

  return startApiService(env);
}

// Only start when run directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('[FATAL] Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = { validateEnv, startServer };
