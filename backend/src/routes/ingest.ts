import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { generateEmbeddings } from "../lib/gemini.js";

export const ingestRouter = Router();

function chunkText(text: string, size = 1000, overlap = 200): string[] {
  if (!text || text.length === 0) return [];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}

ingestRouter.post("/", async (req, res) => {
  const {
    message_id,
    org_id,
    sender_id,
    source,
    timestamp,
    content_type,
    text_content,
    file,
    preprocessed,
    conversation_id,
  } = req.body;

  if (!org_id) {
    res.status(400).json({
      status: "error",
      reply_message: "Falta org_id",
      reply_type: "text",
    });
    return;
  }

  try {
    const textToStore = preprocessed?.extracted_text || text_content || "";

    const { data: doc, error: docErr } = await supabase
      .from("documents")
      .insert({
        org_id,
        uploaded_by: sender_id || null,
        source: source || "whatsapp",
        content_type,
        storage_url: file?.storage_url || null,
        storage_path: file?.storage_path || null,
        original_filename: file?.file_name || null,
        mime_type: file?.mime_type || null,
        file_size: file?.file_size || null,
        extracted_text: textToStore,
        extracted_data: preprocessed?.excel_json
          ? { rows: preprocessed.excel_json }
          : {},
        processing_status: textToStore ? "processing" : "done",
      })
      .select("id")
      .single();

    if (docErr) throw docErr;

    await supabase.from("activities").insert({
      org_id,
      created_by: sender_id || null,
      source: "whatsapp",
      description: `Ingesta: ${content_type} - ${file?.file_name || "texto"}`,
      raw_data: { message_id, conversation_id, content_type, timestamp },
    });

    let chunksCreated = 0;

    if (textToStore.length > 0) {
      const chunks = chunkText(textToStore);

      try {
        const vectors = await generateEmbeddings(chunks);

        const embeddingRows = chunks.map((chunk, i) => ({
          document_id: doc.id,
          org_id,
          content: chunk,
          metadata: {
            chunk_index: i,
            source: "whatsapp",
            content_type,
            filename: file?.file_name || null,
          },
          embedding: vectors[i],
        }));

        const { error: embErr } = await supabase
          .from("embeddings")
          .insert(embeddingRows);

        if (embErr) {
          console.error("[ingest] Embedding insert error:", embErr);
        } else {
          chunksCreated = chunks.length;
        }
      } catch (embError) {
        console.error("[ingest] Embedding generation error:", embError);
      }

      await supabase
        .from("documents")
        .update({ processing_status: "done" })
        .eq("id", doc.id);
    }

    res.json({
      status: "ok" as const,
      reply_message: `Documento recibido (${content_type}). ${chunksCreated} fragmentos indexados con ${textToStore.length} caracteres procesados.`,
      reply_type: "text" as const,
    });
  } catch (error) {
    console.error("[ingest] Error:", error);
    res.json({
      status: "error" as const,
      reply_message:
        "Hubo un error al procesar el documento. Por favor intenta de nuevo.",
      reply_type: "text" as const,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
