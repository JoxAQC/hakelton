import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { generateText } from "../lib/gemini.js";

export const reportsRouter = Router();

reportsRouter.post("/generate", async (req, res) => {
  const { org_id, program_ids, title } = req.body;

  if (!org_id) {
    res.status(400).json({ status: "error", message: "Falta org_id" });
    return;
  }

  try {
    const [orgRes, docsRes, activitiesRes] = await Promise.all([
      supabase
        .from("organizations")
        .select("*, programs(*)")
        .eq("id", org_id)
        .single(),
      supabase
        .from("documents")
        .select("id, original_filename, content_type, extracted_text")
        .eq("org_id", org_id)
        .eq("processing_status", "done")
        .not("extracted_text", "is", null)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("activities")
        .select("*")
        .eq("org_id", org_id)
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

    const org = orgRes.data;
    const docs = docsRes.data || [];
    const activities = activitiesRes.data || [];

    let contextParts: string[] = [];

    if (org) {
      contextParts.push(`Organización: ${org.name}\nDescripción: ${org.description || ""}\nCategoría: ${org.category || ""}`);
      if (org.programs?.length) {
        const progsText = org.programs
          .filter((p: any) => !program_ids || program_ids.includes(p.id))
          .map((p: any) => `- ${p.name}: ${p.description || ""} (Estado: ${p.status}, Presupuesto: $${p.budget_usd || 0})\n  Impacto: ${p.impact_summary || "Sin datos"}`)
          .join("\n");
        contextParts.push(`Programas:\n${progsText}`);
      }
    }

    if (docs.length > 0) {
      const docsText = docs
        .map((d: any) => `[${d.original_filename || d.content_type}]: ${(d.extracted_text || "").slice(0, 800)}`)
        .join("\n---\n");
      contextParts.push(`Documentos recientes:\n${docsText}`);
    }

    if (activities.length > 0) {
      const actsText = activities
        .map((a: any) => `- ${a.description} (${a.source || "sistema"})`)
        .join("\n");
      contextParts.push(`Actividades recientes:\n${actsText}`);
    }

    const context = contextParts.join("\n\n===\n\n");

    const prompt = `Eres un redactor de informes de impacto social para ONGs latinoamericanas.
Genera un informe estructurado basado en el siguiente contexto. El informe debe tener entre 3-5 secciones.

Contexto:
${context}

Responde ÚNICAMENTE con JSON válido con esta estructura:
{
  "title": "Título del informe",
  "blocks": [
    {
      "id": "b1",
      "heading": "Título de la sección",
      "kindTag": "testimonio|reporte|ia",
      "ai": "Texto redactado por la IA para esta sección",
      "sources": [{"who": "nombre", "quote": "cita textual del contexto"}],
      "include": true
    }
  ],
  "metrics": [
    {
      "id": "m1",
      "label": "Nombre de la métrica",
      "value": "valor numérico o texto",
      "unit": "",
      "kind": "counted|estimated",
      "include": true,
      "note": "Nota opcional sobre la métrica"
    }
  ]
}`;

    const aiResponse = await generateText(
      [{ role: "user", content: "Genera el informe de impacto." }],
      prompt,
      { temperature: 0.4, maxTokens: 3000, jsonMode: true }
    );

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      parsed = {
        title: title || "Informe de Impacto",
        blocks: [
          {
            id: "b1",
            heading: "Resumen general",
            kindTag: "ia",
            ai: aiResponse,
            sources: [],
            include: true,
          },
        ],
        metrics: [],
      };
    }

    const reportTitle = parsed.title || title || "Informe de Impacto";

    const { data: report, error: reportErr } = await supabase
      .from("reports")
      .insert({
        org_id,
        title: reportTitle,
        report_type: "custom",
        format: "json",
        parameters: {
          blocks: parsed.blocks,
          metrics: parsed.metrics,
          status: "draft",
        },
      })
      .select("id")
      .single();

    if (reportErr) {
      console.error("[reports] Insert error:", reportErr);
    }

    res.json({
      status: "ok",
      report_id: report?.id || null,
      title: reportTitle,
      blocks: parsed.blocks || [],
      metrics: parsed.metrics || [],
    });
  } catch (error) {
    console.error("[reports] Error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

reportsRouter.get("/:org_id", async (req, res) => {
  const { org_id } = req.params;

  try {
    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("org_id", org_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      status: "ok",
      reports: (reports || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        status: r.parameters?.status || "draft",
        report_type: r.report_type,
        content: r.parameters || {},
        created_at: r.created_at,
      })),
    });
  } catch (error) {
    console.error("[reports] List error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
