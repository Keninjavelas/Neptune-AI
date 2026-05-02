-- Neptune-AI MVP Schema
-- Simple water flow monitoring and leak detection

CREATE TABLE IF NOT EXISTS "flow_telemetry" (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  flow_rate_lpm NUMERIC(8,2) NOT NULL,
  pressure_kpa NUMERIC(8,2),
  temperature_c NUMERIC(5,2),
  sensor_status VARCHAR(32) DEFAULT 'normal'
);

CREATE TABLE IF NOT EXISTS "anomaly_alerts" (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  alert_type VARCHAR(64) NOT NULL,
  severity VARCHAR(16) NOT NULL, -- 'info', 'warning', 'critical'
  flow_rate_lpm NUMERIC(8,2),
  expected_flow_lpm NUMERIC(8,2),
  message TEXT,
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "valve_control" (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  command_type VARCHAR(32) NOT NULL, -- 'open', 'close', 'partial'
  angle_degrees NUMERIC(5,2) NOT NULL,
  response_status VARCHAR(32),
  response_time_ms INTEGER
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_flow_device_ts ON "flow_telemetry" (device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_flow_ts ON "flow_telemetry" (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_device_ts ON "anomaly_alerts" (device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_ts ON "anomaly_alerts" (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_valve_device_ts ON "valve_control" (device_id, timestamp DESC);
