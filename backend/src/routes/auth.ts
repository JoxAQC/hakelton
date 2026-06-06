import { Router } from "express";
import { supabase } from "../lib/supabase.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password, display_name, phone, org_name } = req.body;

  if (!email || !password) {
    res.status(400).json({ status: "error", message: "Faltan email y password" });
    return;
  }

  try {
    let org_id: string;

    if (org_name) {
      const { data: existingOrg } = await supabase
        .from("organizations")
        .select("id")
        .eq("name", org_name)
        .single();

      if (existingOrg) {
        org_id = existingOrg.id;
      } else {
        const { data: newOrg, error: orgErr } = await supabase
          .from("organizations")
          .insert({ name: org_name, category: "social" })
          .select("id")
          .single();
        if (orgErr) throw orgErr;
        org_id = newOrg.id;
      }
    } else {
      const { data: defaultOrg } = await supabase
        .from("organizations")
        .select("id")
        .eq("name", "Fundación Raíces")
        .single();
      org_id = defaultOrg?.id;
      if (!org_id) {
        res.status(400).json({ status: "error", message: "No se encontró organización por defecto" });
        return;
      }
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      res.status(409).json({ status: "error", message: "El email ya está registrado" });
      return;
    }

    const { data: user, error: userErr } = await supabase
      .from("users")
      .insert({
        org_id,
        email,
        phone: phone || null,
        display_name: display_name || email.split("@")[0],
        role: "operator",
      })
      .select("id, org_id, email, display_name, role")
      .single();

    if (userErr) throw userErr;

    res.json({
      status: "ok",
      user,
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.error("[auth] Register error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ status: "error", message: "Falta email" });
    return;
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, org_id, email, display_name, phone, role")
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(404).json({ status: "error", message: "Usuario no encontrado" });
      return;
    }

    res.json({ status: "ok", user });
  } catch (error) {
    console.error("[auth] Login error:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

authRouter.get("/me/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, org_id, email, display_name, phone, role, organizations(name, category)")
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(404).json({ status: "error", message: "Usuario no encontrado" });
      return;
    }

    res.json({ status: "ok", user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
