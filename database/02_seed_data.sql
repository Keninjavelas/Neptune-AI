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


-- Rolling site-wide water usage snapshots for the last 24 reporting periods.
INSERT INTO "Overall_Usage" (timestamp, municipal_liters, harvested_liters, total_liters) VALUES
  (NOW() - INTERVAL '5 hours 45 minutes', 420.00, 980.00, 1400.00),
  (NOW() - INTERVAL '5 hours 30 minutes', 390.00, 1010.00, 1400.00),
  (NOW() - INTERVAL '5 hours 15 minutes', 410.00, 1055.00, 1465.00),
  (NOW() - INTERVAL '5 hours', 445.00, 1090.00, 1535.00),
  (NOW() - INTERVAL '4 hours 45 minutes', 470.00, 1120.00, 1590.00),
  (NOW() - INTERVAL '4 hours 30 minutes', 520.00, 1105.00, 1625.00),
  (NOW() - INTERVAL '4 hours 15 minutes', 560.00, 1080.00, 1640.00),
  (NOW() - INTERVAL '4 hours', 610.00, 1045.00, 1655.00),
  (NOW() - INTERVAL '3 hours 45 minutes', 680.00, 1010.00, 1690.00),
  (NOW() - INTERVAL '3 hours 30 minutes', 720.00, 995.00, 1715.00),
  (NOW() - INTERVAL '3 hours 15 minutes', 760.00, 980.00, 1740.00),
  (NOW() - INTERVAL '3 hours', 810.00, 955.00, 1765.00),
  (NOW() - INTERVAL '2 hours 45 minutes', 860.00, 940.00, 1800.00),
  (NOW() - INTERVAL '2 hours 30 minutes', 905.00, 935.00, 1840.00),
  (NOW() - INTERVAL '2 hours 15 minutes', 930.00, 960.00, 1890.00),
  (NOW() - INTERVAL '2 hours', 910.00, 1015.00, 1925.00),
  (NOW() - INTERVAL '1 hour 45 minutes', 870.00, 1085.00, 1955.00),
  (NOW() - INTERVAL '1 hour 30 minutes', 820.00, 1160.00, 1980.00),
  (NOW() - INTERVAL '1 hour 15 minutes', 760.00, 1235.00, 1995.00),
  (NOW() - INTERVAL '1 hour', 710.00, 1290.00, 2000.00),
  (NOW() - INTERVAL '45 minutes', 660.00, 1350.00, 2010.00),
  (NOW() - INTERVAL '30 minutes', 615.00, 1415.00, 2030.00),
  (NOW() - INTERVAL '15 minutes', 570.00, 1480.00, 2050.00),
  (NOW() - INTERVAL '5 minutes', 540.00, 1525.00, 2065.00);

-- Recent anomaly history from deployed optical monitoring nodes.
INSERT INTO "Anomaly_Alerts" (timestamp, node_id, alert_type, confidence_score, payload_json) VALUES
  (NOW() - INTERVAL '7 hours', 'node-hq-inlet-01', 'Foreign Object', 0.812, '{"frame": 1180, "label": "leaf_cluster", "severity": "medium", "site": "HQ Campus", "workflow": "manual-review"}'),
  (NOW() - INTERVAL '6 hours 20 minutes', 'node-plant-line-02', 'Severe Discoloration', 0.846, '{"frame": 1544, "label": "sediment_plume", "severity": "high", "site": "Processing Plant", "workflow": "flush-line"}'),
  (NOW() - INTERVAL '5 hours 50 minutes', 'node-east-feed-01', 'Pipe Blockage', 0.891, '{"frame": 1887, "label": "debris_cluster", "severity": "high", "site": "Distribution East", "workflow": "dispatch-maintenance"}'),
  (NOW() - INTERVAL '5 hours 5 minutes', 'node-hq-inlet-01', 'Contaminant Detected', 0.774, '{"frame": 2311, "label": "surface_residue", "severity": "medium", "site": "HQ Campus", "workflow": "sample-collection"}'),
  (NOW() - INTERVAL '4 hours 25 minutes', 'node-west-yard-03', 'Foreign Object', 0.834, '{"frame": 2760, "label": "plastic_fragment", "severity": "medium", "site": "Warehouse West", "workflow": "line-inspection"}'),
  (NOW() - INTERVAL '3 hours 40 minutes', 'node-plant-line-02', 'Pipe Blockage', 0.927, '{"frame": 3199, "label": "silt_accumulation", "severity": "critical", "site": "Processing Plant", "workflow": "maintenance-escalation"}'),
  (NOW() - INTERVAL '2 hours 55 minutes', 'node-east-feed-01', 'Severe Discoloration', 0.803, '{"frame": 3624, "label": "rust_stain", "severity": "medium", "site": "Distribution East", "workflow": "line-flush"}'),
  (NOW() - INTERVAL '2 hours 10 minutes', 'node-campus-loop-04', 'Foreign Object', 0.758, '{"frame": 4018, "label": "organic_debris", "severity": "medium", "site": "South Campus", "workflow": "inspect-chamber"}'),
  (NOW() - INTERVAL '1 hour 25 minutes', 'node-hq-inlet-01', 'Contaminant Detected', 0.881, '{"frame": 4470, "label": "chemical_sheen", "severity": "high", "site": "HQ Campus", "workflow": "quality-team-notified"}'),
  (NOW() - INTERVAL '52 minutes', 'node-west-yard-03', 'Severe Discoloration', 0.792, '{"frame": 4832, "label": "turbid_stream", "severity": "medium", "site": "Warehouse West", "workflow": "sample-collection"}'),
  (NOW() - INTERVAL '21 minutes', 'node-plant-line-02', 'Pipe Blockage', 0.943, '{"frame": 5211, "label": "screen_obstruction", "severity": "critical", "site": "Processing Plant", "workflow": "crew-en-route"}'),
  (NOW() - INTERVAL '6 minutes', 'node-east-feed-01', 'Contaminant Detected', 0.867, '{"frame": 5598, "label": "oil_sheen", "severity": "high", "site": "Distribution East", "workflow": "automatic-isolation"}');
