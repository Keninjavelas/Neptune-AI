'use strict';

require('dotenv/config');
const { Pool } = require('pg');

let pool = null;

/**
 * Initialize database connection
 * @param {string} connectionString - PostgreSQL connection string
 */
async function initDb(connectionString) {
  pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    application_name: 'aquaflow-api',
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('[DB] Connected to PostgreSQL');
    return res;
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    throw err;
  }
}

/**
 * Execute a SQL query against the PostgreSQL pool.
 *
 * @param {string} sql - The SQL query string.
 * @param {Array} [params] - Optional query parameters.
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(sql, params) {
  if (!pool) throw new Error('Database not initialized');
  try {
    return await pool.query(sql, params);
  } catch (err) {
    console.error('[DB] Query error:', err.message);
    throw err;
  }
}

module.exports = { initDb, pool, query };
