'use strict';

require('dotenv/config');

const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  MQTT_BROKER_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1).default('*'),
});

function getEnv(runtimeEnv = process.env) {
  return envSchema.parse(runtimeEnv);
}

module.exports = { getEnv, envSchema };