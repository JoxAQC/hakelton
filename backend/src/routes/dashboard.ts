import { Router } from "express";
import { supabase } from "../lib/supabase.js";

export const dashboardRouter = Router();

dashboardRouter.get("/:org_id", async (req, res) => {
  const { org_id } = req.params;

  if (!org_id) {
    res.status(400).json({ status: "error", message: "Falta org_id" });
    return;
  }

  try {
    const [orgRes, docsRes, activitiesRes, beneficiariesRes] = await Promise.all([
      supabase
        .from("organizations")
        .select("*, programs(*)")
        .eq("id", org_id)
        .single(),
      supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org_id),
      supabase
        .from("activities")
        .select("*")
        .eq("org_id", org_id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("beneficiary_records")
        .select("count")
        .eq("org_id", org_id),
    ]);

    const org = orgRes.data;
    const docsCount = docsRes.count || 0;
    const activities = activitiesRes.data || [];
    const totalBeneficiaries = (beneficiariesRes.data || []).reduce(
      (sum: number, r: any) => sum + (r.count || 0),
      0
    );

    const programs = (org?.programs || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      budget_usd: p.budget_usd || 0,
      impact_summary: p.impact_summary || "",
    }));

    const embeddingsRes = await supabase
      .from("embeddings")
      .select("id", { count: "exact", head: true })
      .eq("org_id", org_id);

    const kpis = {
      impacted: totalBeneficiaries || 0,
      voices: embeddingsRes.count || 0,
      events: activities.length,
      docs: docsCount,
    };

    res.json({
      status: "ok",
      org_name: org?.name || "",
      org_category: org?.category || "",
      kpis,
      programs,
      recent_activities: activities.slice(0, 10).map((a: any) => ({
        id: a.id,
        description: a.description,
        source: a.source,
        created_at: a.created_at,
      })),
    });
  } catch (error) {
    console.error("[dashboard] Error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
