'use strict';

const express = require('express');
const cors = require('cors');

/**
 * Creates and configures the Express application.
 * Lightweight setup for MVP with minimal middleware.
 *
 * @returns {import('express').Application}
 */
function createApp(options = {}) {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN || '*';

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(
    cors({
      origin: corsOrigin,
    })
  );

  // Register routes
  app.use('/api/alerts', require('./routes/alerts'));

  // Health check
  app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

  // Global error handler
  app.use((err, _req, res, _next) => {
    console.error('[HTTP] Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
