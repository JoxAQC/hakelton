"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabase/client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

interface AuthPageProps {
  onAuth: (user: any) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) throw authErr;

      try {
        const resp = await fetch(`${BACKEND_URL}/api/auth/me/${encodeURIComponent(email)}`);
        if (resp.ok) {
          const profile = await resp.json();
          if (profile.status === "ok") {
            onAuth({ ...data.user, profile: profile.user });
            return;
          }
        }
      } catch (_) { /* backend may be unavailable */ }
      onAuth(data.user);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            phone,
          },
        },
      });

      if (authErr) throw authErr;

      let profile: any = null;
      try {
        const resp = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            display_name: displayName,
            phone,
          }),
        });
        if (resp.ok) {
          profile = await resp.json();
        }
      } catch (_) { /* backend may be unavailable */ }

      if (data.user) {
        onAuth({ ...data.user, profile: profile?.user });
      }
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f0ff 100%)",
      fontFamily: "var(--sans, system-ui, -apple-system, sans-serif)",
      padding: 20,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(37,99,235,.12), 0 2px 12px rgba(0,0,0,.06)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "#2563EB",
          padding: "32px 36px 28px",
          textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(255,255,255,.2)",
            display: "grid", placeItems: "center",
            margin: "0 auto 14px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-.02em" }}>
            Eco
          </h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, margin: "6px 0 0" }}>
            Convierte voces en informes de impacto
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "14px", border: "none",
                background: mode === m ? "#fff" : "#f9fafb",
                fontWeight: mode === m ? 700 : 500,
                fontSize: 14,
                color: mode === m ? "#2563EB" : "#6b7280",
                borderBottom: mode === m ? "2px solid #2563EB" : "2px solid transparent",
                cursor: "pointer", fontFamily: "inherit",
                transition: "all .15s",
              }}>
              {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={mode === "login" ? handleLogin : handleSignup}
          style={{ padding: "28px 36px 36px", display: "flex", flexDirection: "column", gap: 16 }}>

          {mode === "signup" && (
            <>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Nombre completo
                </label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="Ej: Carla Vega"
                  required
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "inherit",
                    outline: "none", transition: "border-color .15s",
                    boxSizing: "border-box",
                  }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Teléfono (WhatsApp)
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+51 999 888 777"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "inherit",
                    outline: "none", transition: "border-color .15s",
                    boxSizing: "border-box",
                  }} />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@organizacion.org"
              required
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "inherit",
                outline: "none", transition: "border-color .15s",
                boxSizing: "border-box",
              }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Contraseña
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "Tu contraseña"}
              required
              minLength={6}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid #d1d5db", fontSize: 14, fontFamily: "inherit",
                outline: "none", transition: "border-color .15s",
                boxSizing: "border-box",
              }} />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", fontSize: 13, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "12px",
              background: loading ? "#93c5fd" : "#2563EB",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background .15s",
              marginTop: 4,
            }}>
            {loading
              ? "Procesando..."
              : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>

          {mode === "signup" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px", borderRadius: 10,
              background: "#f0f9ff", fontSize: 12.5, color: "#1e40af",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Con tu número de WhatsApp podrás enviar documentos directamente desde la app</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
