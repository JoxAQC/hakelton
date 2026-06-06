-- Migration 00003: Knowledge Base, Embeddings, and RAG Schema

-- Activar pgvector para búsquedas de similitud
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    source TEXT CHECK (source IN ('whatsapp', 'web')),
    content_type TEXT CHECK (content_type IN ('audio', 'image', 'pdf', 'excel', 'docx', 'text')),
    storage_path TEXT,
    storage_url TEXT,
    original_filename TEXT,
    mime_type TEXT,
    file_size INT,
    extracted_text TEXT,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'done', 'error')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de embeddings multimodal (Gemini Embedding 2 @ 768 dims)
CREATE TABLE embeddings (
    id BIGSERIAL PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(768) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice HNSW para búsqueda rápida por similitud coseno
CREATE INDEX ON embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    report_type TEXT CHECK (report_type IN ('monthly', 'annual', 'donor', 'custom')),
    format TEXT CHECK (format IN ('pdf', 'docx', 'json')),
    storage_path TEXT,
    parameters JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Política base sugerida en contexto (luego adaptar auth.jwt)
-- CREATE POLICY "org_isolation" ON embeddings FOR ALL USING (org_id = auth.jwt() ->> 'org_id');

-- Función RPC de búsqueda semántica
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  target_org_id UUID,
  match_threshold FLOAT DEFAULT 0.65,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  document_id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    embeddings.id,
    embeddings.document_id,
    embeddings.content,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE
    embeddings.org_id = target_org_id
    AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
