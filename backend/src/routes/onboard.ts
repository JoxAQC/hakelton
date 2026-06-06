import { Router } from "express";
import { supabase } from "../lib/supabase.js";

export const onboardRouter = Router();

onboardRouter.post("/", async (req, res) => {
  const { org_name, category, description, admin_name, admin_email, initial_programs } = req.body;

  if (!org_name) {
    res.status(400).json({ status: "error", message: "Falta org_name" });
    return;
  }

  try {
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: org_name,
        category: category || "social",
        description: description || "",
        settings: {},
      })
      .select("id")
      .single();

    if (orgErr) throw orgErr;

    const org_id = org.id;

    if (initial_programs && initial_programs.length > 0) {
      const programRows = initial_programs.map((p: any) => ({
        org_id,
        name: typeof p === "string" ? p : p.name,
        description: typeof p === "string" ? "" : p.description || "",
        status: "active",
        budget_usd: typeof p === "string" ? 0 : p.budget_usd || 0,
      }));

      const { error: progErr } = await supabase
        .from("programs")
        .insert(programRows);

      if (progErr) console.error("[onboard] Programs insert error:", progErr);
    }

    if (admin_email) {
      const { error: userErr } = await supabase.from("users").insert({
        org_id,
        email: admin_email,
        display_name: admin_name || admin_email.split("@")[0],
        role: "admin",
      });

      if (userErr) console.error("[onboard] User insert error:", userErr);
    }

    if (category) {
      const { data: templates } = await supabase
        .from("category_metric_templates")
        .select("*")
        .eq("category", category);

      if (templates && templates.length > 0) {
        const configRows = templates.map((t: any) => ({
          org_id,
          metric_key: t.metric_key,
          label: t.label,
          unit: t.unit || "",
          enabled: true,
        }));

        const { error: metErr } = await supabase
          .from("metrics_config")
          .insert(configRows);

        if (metErr) console.error("[onboard] Metrics config error:", metErr);
      }
    }

    res.json({
      status: "ok",
      org_id,
      message: `Organización "${org_name}" creada exitosamente.`,
    });
  } catch (error) {
    console.error("[onboard] Error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
