import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { generateText, generateEmbedding } from "../lib/gemini.js";

export const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
  const { message_id, org_id, sender_id, source, message, conversation_id } =
    req.body;

  if (!org_id || !message) {
    res.status(400).json({
      status: "error",
      reply_message: "Faltan campos obligatorios (org_id, message)",
      reply_type: "text",
    });
    return;
  }

  try {
    let docContext = "";

    try {
      const queryVector = await generateEmbedding(message);

      const { data: matches, error: matchErr } = await supabase.rpc(
        "match_documents",
        {
          query_embedding: JSON.stringify(queryVector),
          target_org_id: org_id,
          match_threshold: 0.5,
          match_count: 5,
        }
      );

      if (!matchErr && matches && matches.length > 0) {
        docContext = "Documentos relevantes encontrados:\n\n";
        for (const match of matches) {
          docContext += `- (similitud: ${(match.similarity as number).toFixed(2)}) ${match.content}\n\n`;
        }
      }
    } catch (embError) {
      console.error("[query] Embedding search failed, falling back to keyword:", embError);

      const { data: docs } = await supabase
        .from("documents")
        .select("id, content_type, original_filename, extracted_text")
        .eq("org_id", org_id)
        .eq("processing_status", "done")
        .not("extracted_text", "is", null);

      if (docs && docs.length > 0) {
        const terms = message
          .toLowerCase()
          .split(/\s+/)
          .filter((t: string) => t.length > 2);
        const relevant = docs
          .filter((d) => {
            const text = (d.extracted_text || "").toLowerCase();
            return terms.some((t: string) => text.includes(t));
          })
          .slice(0, 5);

        if (relevant.length > 0) {
          docContext = "Documentos encontrados:\n\n";
          for (const doc of relevant) {
            const preview = (doc.extracted_text || "").slice(0, 500);
            docContext += `- ${doc.original_filename || doc.content_type}: ${preview}\n\n`;
          }
        }
      }
    }

    const { data: orgs } = await supabase
      .from("organizations")
      .select("*, programs(*)")
      .eq("id", org_id);

    let orgContext = "";
    if (orgs && orgs.length > 0) {
      const org = orgs[0];
      orgContext = `Organización: ${org.name}\n`;
      orgContext += `Descripción: ${org.description}\n`;
      if (org.programs) {
        orgContext += `Programas:\n`;
        for (const p of org.programs) {
          orgContext += `- ${p.name}: ${p.description} (Estado: ${p.status}, Presupuesto: $${p.budget_usd})\n`;
          if (p.impact_summary) orgContext += `  Impacto: ${p.impact_summary}\n`;
        }
      }
    }

    const fullContext = [orgContext, docContext].filter(Boolean).join("\n---\n");

    const systemPrompt = `Eres un asistente de la ONG. Responde basándote en el contexto proporcionado. Si no tienes información suficiente, dilo claramente. Usa formato markdown para estructurar la respuesta.\n\nContexto:\n${fullContext || "No hay contexto disponible."}`;

    const reply = await generateText(
      [{ role: "user", content: message }],
      systemPrompt,
      { temperature: 0.5, maxTokens: 800 }
    );

    res.json({
      status: "ok" as const,
      reply_message: reply,
      reply_type: "text" as const,
    });
  } catch (error) {
    console.error("[query] Error:", error);
    res.json({
      status: "error" as const,
      reply_message:
        "Hubo un error al procesar tu consulta. Por favor intenta de nuevo.",
      reply_type: "text" as const,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
