-- Migration script to support One-Route-to-Many-Buses and specific Bus Assignment for Students

-- 1. Add route_id to buses table
ALTER TABLE buses ADD COLUMN IF NOT EXISTS route_id uuid REFERENCES routes(id) ON DELETE SET NULL;

-- 2. Add bus_id to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS bus_id uuid REFERENCES buses(id) ON DELETE SET NULL;

-- 3. (Optional) Drop bus_id from routes table as it's no longer used
ALTER TABLE routes DROP COLUMN IF EXISTS bus_id;
