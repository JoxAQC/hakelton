-- Migration 00004: MCP (Model Context Protocol) Integrations Schema

CREATE TABLE mcp_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    platform TEXT CHECK (platform IN ('google_workspace', 'google_drive', 'notion', 'onedrive', 'dropbox')) NOT NULL,
    auth_status TEXT CHECK (auth_status IN ('pending', 'connected', 'error', 'disconnected')) DEFAULT 'pending',
    credentials_secret TEXT, -- Idealmente un token cifrado u Oauth refresh token
    sync_frequency TEXT DEFAULT 'daily',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (org_id, platform)
);

ALTER TABLE mcp_integrations ENABLE ROW LEVEL SECURITY;
