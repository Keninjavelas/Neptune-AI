-- AquaFlow AI MVP Schema
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
  count(*) AS alert_count,
  avg(confidence_score) AS avg_confidence
FROM "Anomaly_Alerts"
GROUP BY 1, 2;

SELECT add_continuous_aggregate_policy('rainfall_daily_summary',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
SELECT add_continuous_aggregate_policy('harvesting_daily_summary',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
SELECT add_continuous_aggregate_policy('quality_hourly_summary',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '15 minutes',
  schedule_interval => INTERVAL '15 minutes');
SELECT add_continuous_aggregate_policy('agriculture_hourly_summary',
  start_offset => INTERVAL '30 days',
  end_offset => INTERVAL '15 minutes',
  schedule_interval => INTERVAL '15 minutes');
SELECT add_continuous_aggregate_policy('usage_daily_summary',
  start_offset => INTERVAL '90 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
SELECT add_continuous_aggregate_policy('alerts_hourly_summary',
  start_offset => INTERVAL '90 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');

SELECT add_retention_policy('"Rainfall_Log"', INTERVAL '180 days');
SELECT add_retention_policy('"Storage_Tanks"', INTERVAL '180 days');
SELECT add_retention_policy('"Quality_Sensors"', INTERVAL '180 days');
SELECT add_retention_policy('"Irrigation_Zones"', INTERVAL '180 days');
SELECT add_retention_policy('"Overall_Usage"', INTERVAL '365 days');
SELECT add_retention_policy('"Anomaly_Alerts"', INTERVAL '365 days');
