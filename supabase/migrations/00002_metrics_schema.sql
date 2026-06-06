-- Migration 00002: Metrics Configuration and Data Schema

CREATE TABLE category_metric_templates (
    category_id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    metrics_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE metrics_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_type TEXT CHECK (metric_type IN ('count', 'percentage', 'currency', 'boolean')) NOT NULL,
    unit TEXT,
    is_kpi BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE metric_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    metric_config_id UUID NOT NULL REFERENCES metrics_config(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    value FLOAT NOT NULL,
    period_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALTER TABLE metrics_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE metric_values ENABLE ROW LEVEL SECURITY;
