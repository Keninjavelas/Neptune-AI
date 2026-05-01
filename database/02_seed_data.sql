-- Seed data for AquaFlow AI MVP
-- Baseline device and sample telemetry

INSERT INTO "flow_telemetry" (device_id, flow_rate_lpm, pressure_kpa, temperature_c)
VALUES 
  ('esp32-01', 5.2, 2.5, 22.1),
  ('esp32-01', 5.1, 2.5, 22.2),
  ('esp32-01', 5.3, 2.4, 22.1);

INSERT INTO "anomaly_alerts" (device_id, alert_type, severity, message)
VALUES 
  ('esp32-01', 'INITIALIZATION', 'info', 'System initialized and ready for monitoring');
