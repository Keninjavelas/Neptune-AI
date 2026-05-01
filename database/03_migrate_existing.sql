-- Migration: Update schema for AquaFlow AI MVP
-- Clean up old enterprise tables and prepare for new schema

DROP TABLE IF EXISTS "Rainfall_Log" CASCADE;
DROP TABLE IF EXISTS "Storage_Tanks" CASCADE;
DROP TABLE IF EXISTS "Quality_Sensors" CASCADE;
DROP TABLE IF EXISTS "Irrigation_Zones" CASCADE;
DROP TABLE IF EXISTS "Overall_Usage" CASCADE;

-- All new tables are created in 01_schema.sql
-- No data migration needed for MVP

