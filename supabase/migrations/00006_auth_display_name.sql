-- Migration 00006: Add display_name to users and auth_id for Supabase Auth linking

ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;
