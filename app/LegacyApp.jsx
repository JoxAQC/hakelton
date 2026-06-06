"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";


/* --- data.js --- */
/* Datos mock → DATA
   Dos tipos de voz: "testimonio" (comunidad) y "reporte" (equipo / voluntariado). */
const DATA = (function () {
  const people = {
    // Comunidad
    maria:   { id: "maria",   name: "María Elena Quispe",   role: "Vecina · Programa de salud", color: "#6B8875",  initials: "MQ" },
    roberto: { id: "roberto", name: "Don Roberto Mamani",   role: "Dirigente comunal",          color: "#5D7A66", initials: "RM" },
    luz:     { id: "luz",     name: "Luz Carrasco",          role: "Madre · Comedor popular",    color: "#7A9480", initials: "LC" },
    jowel:   { id: "jowel",   name: "Jowel Andrade",         role: "Joven · Taller ambiental",   color: "#4A6352", initials: "JA" },
    // Equipo / voluntariado
    carlosH: { id: "carlosH", name: "Carlos Huamán",         role: "Voluntario · Equipo de campo", color: "#8B7355", initials: "CH", team: true },
    anaR:    { id: "anaR",    name: "Ana Rivas",             role: "Coordinadora de jornada",      color: "#3D5244", initials: "AR", team: true },
  };

  // Conversaciones de WhatsApp conectadas
  const conversations = [
    {
      id: "equipo", name: "Equipo de campo · Voluntariado", kind: "Grupo", role: "team",
      members: 8, color: "#5D7A66", initials: "EC",
      lastAt: "hace 30 min", unread: 2, voiceNotes: 6,
      summary: "Reportes de los voluntarios: qué se hizo, qué se desplegó y qué quedó pendiente.",
    },
    {
      id: "salud", name: "Salud Comunitaria — Villa El Sol", kind: "Grupo", role: "community",
      members: 14, color: "#6B8875", initials: "SC",
      lastAt: "hace 12 min", unread: 3, voiceNotes: 8,
      summary: "Testimonios sobre la nueva posta médica y acceso a medicinas.",
    },
    {
      id: "ambiente", name: "Jóvenes por el río", kind: "Grupo", role: "community",
      members: 21, color: "#4A6352", initials: "JR",
      lastAt: "ayer", unread: 0, voiceNotes: 11,
      summary: "Jornada de limpieza y voces sobre la contaminación del río.",
    },
    {
      id: "roberto", name: "Don Roberto Mamani", kind: "Directo", role: "community",
      members: 1, color: "#7A9480", initials: "RM",
      lastAt: "hace 3 h", unread: 1, voiceNotes: 2,
      summary: "Seguimiento al acuerdo con el municipio.",
    },
  ];

  // Testimonios de la comunidad (grupo salud)
  const transcript = [
    {
      who: "maria", at: "09:14", dur: "0:48", lang: "es", kind: "testimonio",
      text: "Buenos días señorita. Le quería contar que desde que abrieron la posta, ya no tengo que viajar dos horas hasta el hospital. Mi hija pudo vacunarse aquí mismo. Pero todavía faltan medicinas, a veces vamos y no hay nada.",
      tags: ["acceso a salud", "vacunación", "falta de insumos"],
    },
    {
      who: "roberto", at: "09:31", dur: "1:12", lang: "es", kind: "testimonio",
      text: "Como dirigente le digo: la comunidad está agradecida pero necesitamos que el puesto tenga atención los fines de semana. La gente se enferma cualquier día, no solo de lunes a viernes.",
      tags: ["horario de atención", "demanda comunal"],
    },
    {
      who: "luz", at: "10:02", dur: "0:35", lang: "es", kind: "testimonio",
      text: "Yo soy mamá de tres. Antes gastaba en pasajes lo que no tenía. Ahora camino diez minutos. Eso para nosotras es muchísimo, de verdad.",
      tags: ["impacto económico", "cercanía"],
    },
  ];

  // Reportes del equipo / voluntariado (grupo equipo de campo)
  const teamReports = [
    {
      who: "carlosH", at: "08:50", dur: "1:05", lang: "es", kind: "reporte",
      text: "Listo compañeros, cerramos la jornada de salud en Villa El Sol. Atendimos a unas 80 personas y desplegamos dos carpas de triaje, con apoyo de una enfermera de la posta. Lo que no pudimos hacer fue la toma de presión: no llegó el tensiómetro, lo dejamos pendiente para la próxima.",
      tags: ["jornada de salud", "80 atendidos", "pendiente: tensiómetro"],
    },
    {
      who: "anaR", at: "ayer", dur: "0:52", lang: "es", kind: "reporte",
      text: "El taller ambiental salió bien, vinieron 25 jóvenes y recogimos como 12 sacos de basura del río. Faltaron guantes para todos, anótenlo para la próxima compra.",
      tags: ["taller ambiental", "25 participantes", "faltaron guantes"],
    },
  ];

  // Informes existentes
  const reports = [
    { id: "r1", title: "Impacto de la posta médica — Marzo 2026", program: "Salud Comunitaria", status: "Borrador en revisión", voices: 8, updated: "hoy", color: "#6B8875", impact: 120, impactLabel: "personas impactadas" },
    { id: "r2", title: "Resultados jornada de limpieza del río", program: "Medio Ambiente", status: "Aprobado", voices: 11, updated: "hace 4 días", color: "#4A6352", impact: 340, impactLabel: "kg de residuos retirados" },
    { id: "r3", title: "Comedor Las Manitos — Reporte trimestral", program: "Seguridad alimentaria", status: "Aprobado", voices: 6, updated: "hace 2 sem", color: "#7A9480", impact: 85, impactLabel: "familias atendidas" },
  ];

  // Bloques que la IA propone — mezcla testimonios de comunidad + reportes del equipo
  const draftBlocks = [
    {
      id: "b1", heading: "Acceso a la salud más cerca de casa", kindTag: "testimonio",
      ai: "La cercanía de la nueva posta médica redujo de forma notable las barreras de acceso. Varias vecinas reportan haber dejado de viajar largas distancias para atención básica y vacunación.",
      sources: [
        { who: "maria", quote: "Desde que abrieron la posta, ya no tengo que viajar dos horas hasta el hospital." },
        { who: "luz",   quote: "Antes gastaba en pasajes lo que no tenía. Ahora camino diez minutos." },
      ],
      include: true,
    },
    {
      id: "bt", heading: "Qué desplegó el equipo en terreno", kindTag: "reporte",
      ai: "El equipo de voluntariado realizó una jornada de salud en Villa El Sol: atendió a cerca de 80 personas y desplegó dos carpas de triaje, con apoyo de una enfermera de la posta.",
      sources: [
        { who: "carlosH", quote: "Atendimos a unas 80 personas y desplegamos dos carpas de triaje." },
      ],
      include: true,
    },
    {
      id: "bp", heading: "Quedó pendiente para la próxima", kindTag: "reporte",
      ai: "Una actividad no pudo completarse por falta de equipamiento: la toma de presión arterial quedó pendiente porque no llegó el tensiómetro.",
      sources: [
        { who: "carlosH", quote: "No pudimos hacer la toma de presión: no llegó el tensiómetro." },
      ],
      include: true,
    },
    {
      id: "b2", heading: "Lo que aún falta: insumos y horarios", kindTag: "testimonio",
      ai: "Pese al avance, la comunidad identifica dos brechas concretas: el desabastecimiento intermitente de medicinas y la falta de atención durante los fines de semana.",
      sources: [
        { who: "maria",   quote: "A veces vamos y no hay nada [medicinas]." },
        { who: "roberto", quote: "Necesitamos que el puesto tenga atención los fines de semana." },
      ],
      include: true,
    },
    {
      id: "b3", heading: "Recomendación sugerida", kindTag: "ia",
      ai: "Se sugiere gestionar con el municipio un stock mínimo garantizado de medicamentos esenciales y evaluar un turno de fin de semana.",
      sources: [],
      include: false,
      flagged: true,
    },
  ];

  // ---- Panel de datos: indicadores fusionados de todos los eventos ----
  const analytics = {
    scopes: [
      { id: "mes", label: "Marzo 2026", mult: 1 },
      { id: "tri", label: "Ene–Mar 2026", mult: 2.7 },
      { id: "anio", label: "2026 (al día)", mult: 8.4 },
    ],
    base: { impacted: 1240, events: 8, voices: 142, docs: 11 },
    gender: [
      { label: "Femenino", value: 58, color: "#5D7A66" },
      { label: "Masculino", value: 39, color: "#6B8875" },
      { label: "Otro / NS", value: 3, color: "#999999" },
    ],
    age: [
      { label: "0–12", value: 14 }, { label: "13–17", value: 12 }, { label: "18–29", value: 26 },
      { label: "30–44", value: 23 }, { label: "45–64", value: 17 }, { label: "65+", value: 8 },
    ],
    programs: [
      { name: "Salud comunitaria", value: 480, color: "#5D7A66" },
      { name: "Medio ambiente", value: 340, color: "#4A6352" },
      { name: "Educación", value: 260, color: "#6B8875" },
      { name: "Seguridad alimentaria", value: 160, color: "#7A9480" },
    ],
    trend: [
      { m: "Oct", v: 520 }, { m: "Nov", v: 640 }, { m: "Dic", v: 710 },
      { m: "Ene", v: 880 }, { m: "Feb", v: 1020 }, { m: "Mar", v: 1240 },
    ],
  };

  // ---- Importar: documentos subidos (mock inicial) ----
  const documents = [
    { id: "d1", name: "Lista_asistencia_marzo.xlsx", type: "xls", size: "48 KB", status: "done", note: "85 registros", detected: ["Nombre", "Edad", "Género", "Distrito", "Asistencia"] },
    { id: "d2", name: "Acta_reunion_comunal.pdf", type: "pdf", size: "0.3 MB", status: "done", note: "3 páginas · 6 acuerdos", detected: ["Acuerdos", "Fechas", "Participantes"] },
    { id: "d3", name: "Encuesta_satisfaccion.xlsx", type: "xls", size: "77 KB", status: "done", note: "120 respuestas", detected: ["Edad", "Género", "Valoración 1–5"] },
  ];

  return { people, conversations, transcript, teamReports, reports, draftBlocks, analytics, documents };
})();

/* --- tweaks-panel.jsx --- */
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

if (typeof window !== "undefined") Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});

/* --- ui.jsx --- */
/* Componentes UI compartidos → window */


/* ---- Iconos (línea simple, estilo coherente) ---------------------- */
const ICONS = {
  home:   "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
  chat:   "M21 11.5a7.5 7.5 0 0 1-10.9 6.7L4 20l1.8-4.1A7.5 7.5 0 1 1 21 11.5Z",
  doc:    "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v5h5M9 13h7M9 17h5",
  spark:  "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z",
  gear:   "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 3a8 8 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2-1.2L13 1h-2l-.5 2.6a8 8 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 4 12a8 8 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 2 1.2L11 23h2l.5-2.6a8 8 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6A8 8 0 0 0 20 12Z",
  mic:    "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3",
  play:   "M8 5v14l11-7z",
  check:  "M5 13l4 4L19 7",
  plus:   "M12 5v14M5 12h14",
  arrow:  "M5 12h14M13 6l6 6-6 6",
  back:   "M19 12H5M11 18l-6-6 6-6",
  users:  "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 8v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  down:   "M12 3v12m0 0 4-4m-4 4-4-4M5 21h14",
  edit:   "M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM14 7l3 3",
  x:      "M6 6l12 12M18 6 6 18",
  shield: "M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3ZM9 12l2 2 4-4",
  bell:   "M18 9a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7M10.3 20a2 2 0 0 0 3.4 0",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  qr:     "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h3m3 0v3m-6 0h3m0-6h3v3",
  heart:  "M12 20s-7-4.4-9.3-8.3A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5.7C19 15.6 12 20 12 20Z",
  pause:  "M8 5v14M16 5v14",
  wand:   "M15 4V2m0 14v-2m-5-7H8m14 0h-2M6 18 18 6m-1.5-1.5 1 1M4 20l2-2",
  folder: "M3 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z",
  eye:    "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  link:   "M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1",
  chart:  "M4 20h16M7 20v-7M12 20V7M17 20v-10",
  menu:   "M4 7h16M4 12h16M4 17h16",
  upload: "M12 14V4m0 0 4 4m-4-4-4 4M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3",
  table:  "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 5h18M9 5v14",
  trash:  "M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-7 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13",
};
function Icon({ name, size = 20, stroke = 2, fill = false, style }) {
  const d = ICONS[name] || "";
  const solid = name === "play";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"}
         stroke={solid ? "none" : "currentColor"} strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---- Avatar ------------------------------------------------------- */
function Avatar({ p, size = 40 }) {
  return (
    <div className="av" style={{ width: size, height: size, background: p.color, fontSize: size * 0.36 }}>
      {p.initials}
    </div>
  );
}

/* ---- Onda de voz (animable) -------------------------------------- */
function Wave({ playing = false, bars = 28, color }) {
  const heights = useRef(Array.from({ length: bars }, (_, i) =>
    6 + Math.round(Math.abs(Math.sin(i * 1.7) * 14) + (i % 3) * 2))).current;
  return (
    <div className="wave" style={color ? { color } : undefined}>
      {heights.map((h, i) => (
        <span key={i} style={{
          height: h,
          background: color || "var(--blue)",
          opacity: playing ? 0.55 + 0.45 * Math.abs(Math.sin(i)) : 0.8,
          animation: playing ? `vp 0.9s ${i * 0.045}s ease-in-out infinite alternate` : "none",
        }} />
      ))}
    </div>
  );
}

/* ---- Reproductor de nota de voz ---------------------------------- */
function VoicePlayer({ dur = "0:48", color, compact = false }) {
  const [on, setOn] = useState(false);
  useEffect(() => { if (!on) return; const t = setTimeout(() => setOn(false), 2600); return () => clearTimeout(t); }, [on]);
  const tint = color ? `color-mix(in srgb, ${color} 14%, white)` : "var(--warm-tint)";
  const durColor = color ? `color-mix(in srgb, ${color} 72%, black)` : "var(--warm-deep)";
  return (
    <div className={"voice-player" + (compact ? " voice-player-compact" : "")} style={{ background: tint }}>
      <button type="button" onClick={() => setOn(v => !v)} className="voice-player-btn" style={{ background: color || "var(--warm)" }}>
        <Icon name={on ? "pause" : "play"} size={compact ? 13 : 15} />
      </button>
      <Wave playing={on} bars={compact ? 16 : 22} color={color} />
      <span className="voice-player-dur" style={{ color: durColor }}>{dur}</span>
    </div>
  );
}

/* ---- Switch ------------------------------------------------------- */
function Switch({ on, onClick, warm }) {
  return <button className={"sw" + (on ? " on" : "") + (warm ? " warm" : "")} onClick={onClick} aria-pressed={on} />;
}

/* ---- Chip --------------------------------------------------------- */
function Chip({ children, tone = "", dot }) {
  return <span className={"chip " + tone}>{dot && <span className="dot" />}{children}</span>;
}

/* ---- Banda de "la IA hizo esto" ---------------------------------- */
function AINote({ children }) {
  return (
    <div className="ai-note">
      <span className="ai-ico"><Icon name="spark" size={18} /></span>
      <div>{children}</div>
    </div>
  );
}

if (typeof window !== "undefined") Object.assign(window, { Icon, Avatar, Wave, VoicePlayer, Switch, Chip, AINote });

/* animación de barras */
let __vp; if (typeof document !== "undefined") { __vp = document.createElement("style");
__vp.textContent = "@keyframes vp{from{transform:scaleY(.5)}to{transform:scaleY(1.25)}}";
document.head.appendChild(__vp); }

/* --- onboarding.jsx --- */
/* Onboarding — 3 variaciones comparables → window.Onboarding */
const oUse = useState;

/* QR falso (cuadritos — placeholder) */
function FakeQR({ size = 168 }) {
  const cells = 11;
  const seed = [0,1,0,1,1,0,1,0,1,0,1, 1,0,0,1,0,1,1,0,0,1,0, 0,1,1,0,1,0,0,1,1,0,1,
    1,1,0,1,0,1,1,0,1,1,0, 0,0,1,0,1,1,0,1,0,0,1, 1,0,1,1,0,0,1,0,1,1,0,
    0,1,0,0,1,1,0,1,1,0,1, 1,1,0,1,0,0,1,0,0,1,0, 0,0,1,0,1,1,0,1,1,0,1,
    1,0,1,1,0,1,0,0,1,0,1, 0,1,0,0,1,0,1,1,0,1,0];
  const c = size / cells;
  return (
    <div style={{ width: size, height: size, background: "#fff", borderRadius: 14, padding: 10, boxShadow: "var(--sh)", position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells},1fr)`, width: "100%", height: "100%" }}>
        {seed.slice(0, cells * cells).map((v, i) => (
          <div key={i} style={{ background: v ? "var(--ink)" : "transparent", borderRadius: 1.5 }} />
        ))}
      </div>
      {[[8,8,"tl"],[8,8,"tr"],[8,8,"bl"]].map(([w,h,k],i) => (
        <div key={k} style={{
          position: "absolute", width: 34, height: 34, border: "5px solid var(--ink)", borderRadius: 9,
          top: k[0] === "b" ? "auto" : 10, bottom: k[0] === "b" ? 10 : "auto",
          left: k[1] === "r" ? "auto" : 10, right: k[1] === "r" ? 10 : "auto", background: "#fff",
        }}><div style={{ position: "absolute", inset: 6, background: "var(--ink)", borderRadius: 3 }} /></div>
      ))}
    </div>
  );
}

/* Placeholder de ilustración rayado */
function Illu({ label, h = 220, tone = "blue" }) {
  const bg = tone === "warm" ? "var(--warm-tint)" : "var(--blue-tint)";
  const stripe = tone === "warm" ? "#E5DDD2" : "#D5E0D8";
  return (
    <div style={{
      height: h, borderRadius: "var(--r-lg)", background: bg,
      backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, ${stripe} 14px 15px)`,
      display: "grid", placeItems: "center", border: "1px solid var(--line)",
    }}>
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--muted)", background: "var(--surface)", padding: "5px 11px", borderRadius: 999, border: "1px solid var(--line)" }}>{label}</span>
    </div>
  );
}

/* ============ VARIACIÓN A — Asistente guiado paso a paso ============ */
function VariantWizard({ onFinish }) {
  const [step, setStep] = oUse(0);
  const [progs, setProgs] = oUse(["salud"]);
  const steps = ["Hola", "Conectar", "Temas", "Integraciones", "Listo"];
  const toggle = (id) => setProgs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const programs = [
    { id: "salud", icon: "heart", t: "Salud comunitaria", d: "Postas, campañas, acceso" },
    { id: "amb", icon: "spark", t: "Medio ambiente", d: "Jornadas, agua, residuos" },
    { id: "edu", icon: "doc", t: "Educación", d: "Talleres, escuelas, becas" },
    { id: "der", icon: "shield", t: "Derechos", d: "Acompañamiento, denuncias" },
  ];

  return (
    <div style={{ maxWidth: 940, margin: "0 auto", width: "100%" }}>
      <div className="row" style={{ justifyContent: "center", gap: 8, marginBottom: 30 }}>
        {steps.map((s, i) => (
          <div key={s} className="row" style={{ gap: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: 999, background: i <= step ? "var(--blue)" : "var(--line)", transition: "background .2s" }} />
            {i < steps.length - 1 && <div style={{ width: 30, height: 2, background: i < step ? "var(--blue)" : "var(--line)" }} />}
          </div>
        ))}
      </div>

      <div className="card float-in" key={step} style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 420, boxShadow: "var(--sh-lg)" }}>
        {/* izquierda: copy */}
        <div style={{ padding: "44px 42px", display: "flex", flexDirection: "column" }}>
          {step === 0 && <>
            <div><Chip tone="warm" dot>Bienvenida</Chip></div>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.025em", margin: "16px 0 0", lineHeight: 1.12 }}>Hola, soy <span style={{ color: "var(--blue)" }}>Voz</span>.<br />Convierto lo que tu gente dice en informes.</h2>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 14 }}>Conecto tu WhatsApp, transcribo las notas de voz y mensajes de las personas con las que trabajas, y te ayudo a armar reportes. <b>Sin que pierdas tu voz ni la de ellas.</b></p>
            <div style={{ marginTop: "auto", paddingTop: 24, display: "flex", gap: 8, alignItems: "center", color: "var(--muted)", fontSize: 13 }}>
              <Icon name="shield" size={17} /> Toma 3 minutos. Nada se envía sin tu permiso.
            </div>
          </>}
          {step === 1 && <>
            <div><Chip tone="blue" dot>Paso 1 de 4</Chip></div>
            <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", margin: "16px 0 0", lineHeight: 1.15 }}>Conecta tu WhatsApp</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 12 }}>En tu teléfono abre WhatsApp → <b>Dispositivos vinculados</b> → <b>Vincular dispositivo</b>, y apunta a este código.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "flex", flexDirection: "column", gap: 11 }}>
              {["Usa el número de la organización, no el personal", "Tu equipo verá las mismas conversaciones", "Puedes desconectarlo cuando quieras"].map((t, i) => (
                <li key={i} className="row" style={{ gap: 10, fontSize: 14, color: "var(--ink-soft)" }}>
                  <span style={{ color: "var(--green)", flex: "none" }}><Icon name="check" size={18} /></span>{t}
                </li>
              ))}
            </ul>
          </>}
          {step === 2 && <>
            <div><Chip tone="blue" dot>Paso 2 de 4</Chip></div>
            <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", margin: "16px 0 0", lineHeight: 1.15 }}>¿Qué temas quieres recoger?</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 12 }}>Solo para sugerirte mejor. <b>Tú siempre decides</b> qué entra en cada informe. Puedes cambiarlo después.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
              {programs.map(p => {
                const on = progs.includes(p.id);
                return (
                  <button key={p.id} onClick={() => toggle(p.id)} style={{
                    textAlign: "left", padding: "13px 14px", borderRadius: "var(--r-sm)", background: on ? "var(--blue-tint)" : "var(--surface)",
                    border: "1.5px solid " + (on ? "var(--blue)" : "var(--line)"), transition: "all .15s", display: "flex", gap: 11, alignItems: "flex-start",
                  }}>
                    <span style={{ color: on ? "var(--blue)" : "var(--muted)" }}><Icon name={p.icon} size={19} /></span>
                    <span><div style={{ fontWeight: 700, fontSize: 14 }}>{p.t}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{p.d}</div></span>
                  </button>
                );
              })}
            </div>
          </>}
          {step === 3 && <>
            <div><Chip tone="blue" dot>Paso 3 de 4 (Opcional)</Chip></div>
            <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", margin: "16px 0 0", lineHeight: 1.15 }}>Vincula tus herramientas</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 12 }}>¿Tu ONG usa Drive o Notion? Conéctalos para que la IA extraiga contexto histórico de forma segura.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              {["Google Workspace / Drive", "Notion", "OneDrive"].map(plat => (
                <div key={plat} style={{ padding: "12px 14px", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "var(--muted)" }}><Icon name="doc" size={18} /></span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{plat}</span>
                  </div>
                  <button className="btn btn-soft btn-sm" disabled>Próximamente</button>
                </div>
              ))}
            </div>
          </>}
          {step === 4 && <>
            <div><Chip tone="green" dot>¡Todo listo!</Chip></div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", margin: "16px 0 0", lineHeight: 1.15 }}>Ya puedes empezar a escuchar.</h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 12 }}>Cuando lleguen notas de voz, las verás transcritas aquí. Cuando tengas suficientes, te ayudo a armar tu primer informe — y tú lo revisas antes de compartir.</p>
            <div style={{ margintop: 18, marginTop: 18, padding: 14, background: "var(--warm-tint)", borderRadius: "var(--r-sm)", display: "flex", gap: 11, fontSize: 13.5, color: "var(--warm-deep)", lineHeight: 1.5 }}>
              <Icon name="heart" size={18} /><span><b>Recuerda:</b> Voz nunca responde por ti ni envía mensajes sin que tú lo apruebes.</span>
            </div>
          </>}

          <div className="row" style={{ marginTop: "auto", paddingTop: 26, gap: 10 }}>
            {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}><Icon name="back" size={17} /> Atrás</button>}
            <div className="grow" />
            {step < 4
              ? <button className="btn btn-primary btn-lg" onClick={() => setStep(s => s + 1)}>{step === 0 ? "Empezar" : step === 3 ? "Omitir por ahora" : "Continuar"} <Icon name="arrow" size={17} /></button>
              : <button className="btn btn-primary btn-lg" onClick={onFinish}>Entrar a Voz <Icon name="arrow" size={17} /></button>}
          </div>
        </div>

        {/* derecha: visual */}
        <div style={{ background: "linear-gradient(160deg, var(--blue-tint), var(--green-tint))", display: "grid", placeItems: "center", padding: 36, borderLeft: "1px solid var(--line)" }}>
          {step === 0 && <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 230 }}>
              {DATA.transcript.slice(0, 2).map((t, i) => {
                const p = DATA.people[t.who];
                return <div key={i} className="card" style={{ padding: 13, marginBottom: 12, transform: `rotate(${i ? 2 : -2}deg)`, boxShadow: "var(--sh)" }}>
                  <div className="row" style={{ gap: 9, marginBottom: 7 }}><Avatar p={p} size={28} /><span style={{ fontWeight: 700, fontSize: 13 }}>{p.name.split(" ")[0]}</span></div>
                  <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>"{t.text.slice(0, 64)}…"</div>
                </div>;
              })}
            </div>
          </div>}
          {step === 1 && <FakeQR />}
          {step === 2 && <Illu label="ilustración · temas de tu ONG" h={240} />}
          {step === 3 && <Illu label="MCP Integrations" h={240} tone="blue" />}
          {step === 4 && <div style={{ textAlign: "center" }}>
            <div style={{ width: 92, height: 92, borderRadius: 999, background: "var(--green-tint)", display: "grid", placeItems: "center", margin: "0 auto 16px", color: "var(--green)" }}><Icon name="check" size={46} /></div>
            <div style={{ fontWeight: 700, color: "var(--ink-soft)" }}>WhatsApp conectado</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ============ VARIACIÓN B — Tablero de primeros pasos ============ */
function VariantChecklist({ onFinish }) {
  const [done, setDone] = oUse({ connect: true });
  const items = [
    { id: "connect", icon: "qr", t: "Conecta tu WhatsApp", d: "Vincula el número de tu organización para empezar a recibir voces.", cta: "Conectar", time: "1 min" },
    { id: "team", icon: "users", t: "Invita a tu equipo", d: "Coordinadores, gente de campo y dirección. Cada quien con su rol.", cta: "Invitar", time: "2 min" },
    { id: "first", icon: "doc", t: "Crea tu primer informe", d: "Te acompaño con las voces que ya llegaron. Tú lo revisas todo.", cta: "Probar", time: "3 min" },
  ];
  const count = Object.values(done).filter(Boolean).length;
  const mark = (id) => setDone(d => ({ ...d, [id]: true }));

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", width: "100%" }} className="float-in">
      <div className="row" style={{ gap: 14, marginBottom: 6 }}>
        <div className="brand-mark" style={{ width: 46, height: 46, borderRadius: 14 }}><Icon name="mic" size={24} /></div>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>Bienvenida a Voz, Fundación Raíces 👋</h2>
          <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: 14.5 }}>Tres pasos para empezar a escuchar a tu comunidad.</p>
        </div>
      </div>

      <div className="row" style={{ gap: 12, margin: "22px 0 18px" }}>
        <div style={{ flex: 1, height: 8, background: "var(--line)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${(count / 3) * 100}%`, height: "100%", background: "linear-gradient(90deg,var(--blue),var(--blue-deep))", borderRadius: 999, transition: "width .4s" }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--blue-deep)" }}>{count} de 3</span>
      </div>

      <div className="col" style={{ gap: 12 }}>
        {items.map(it => {
          const ok = done[it.id];
          return (
            <div key={it.id} className="card" style={{ padding: 18, display: "flex", gap: 15, alignItems: "center", borderColor: ok ? "var(--green-tint)" : "var(--line)", background: ok ? "var(--green-tint)" : "var(--surface)" }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flex: "none", display: "grid", placeItems: "center", background: ok ? "var(--green)" : "var(--blue-tint)", color: ok ? "#fff" : "var(--blue)" }}>
                <Icon name={ok ? "check" : it.icon} size={23} />
              </div>
              <div className="grow">
                <div className="row" style={{ gap: 9 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, textDecoration: ok ? "none" : "none" }}>{it.t}</span>
                  {!ok && <span className="chip" style={{ padding: "1px 8px", fontSize: 11 }}>{it.time}</span>}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.45 }}>{it.d}</div>
              </div>
              {ok
                ? <span style={{ fontWeight: 700, color: "var(--green)", fontSize: 13.5 }} className="row"><Icon name="check" size={17} /> Hecho</span>
                : <button className="btn btn-primary" onClick={() => mark(it.id)}>{it.cta}</button>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18, padding: 15, borderRadius: "var(--r)", background: "var(--warm-tint)", display: "flex", gap: 11, alignItems: "center" }}>
        <span style={{ color: "var(--warm-deep)" }}><Icon name="heart" size={20} /></span>
        <span style={{ fontSize: 13.5, color: "var(--warm-deep)", lineHeight: 1.5 }}><b>El toque humano es tuyo.</b> Voz transcribe y organiza, pero cada palabra que sale en un informe la apruebas tú.</span>
      </div>

      <div className="row" style={{ justifyContent: "flex-end", marginTop: 22, gap: 12 }}>
        <button className="btn btn-ghost" onClick={onFinish}>Explorar por mi cuenta</button>
        <button className="btn btn-primary btn-lg" onClick={onFinish} disabled={count < 1}>Ir al tablero <Icon name="arrow" size={17} /></button>
      </div>
    </div>
  );
}

/* ============ VARIACIÓN C — Recorrido con ejemplo real ============ */
function VariantTour({ onFinish }) {
  const [i, setI] = oUse(0);
  const marks = [
    { t: "Esto es una voz real, ya transcrita", d: "Cada nota de voz que llega de WhatsApp aparece aquí en texto, con el nombre de quien la dijo. Nada se pierde.", pos: { top: 64, left: 24 }, tone: "warm" },
    { t: "La IA propone, tú decides", d: "Voz agrupa los testimonios y sugiere un borrador. Pero verás siempre las palabras originales al lado — y editas lo que quieras.", pos: { top: 188, left: 24 }, tone: "blue" },
    { t: "Tú apruebas antes de compartir", d: "Ningún informe sale sin tu visto bueno. Así el reporte sigue sonando como tu organización, no como un robot.", pos: { top: 312, left: 24 }, tone: "blue" },
  ];
  const m = marks[i];

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", width: "100%", position: "relative" }} className="float-in">
      <div className="row" style={{ marginBottom: 16, gap: 11 }}>
        <Chip tone="warm" dot>Modo aprendizaje</Chip>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>Estás viendo un <b>ejemplo de práctica</b> — datos de muestra, nada real.</span>
      </div>

      <div style={{ position: "relative" }}>
        {/* mockup atenuado de la app */}
        <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--sh-lg)" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)", display: "flex", gap: 11, alignItems: "center", background: "var(--surface-2)" }}>
            <Avatar p={{ color: "#6B8875", initials: "SC" }} size={34} />
            <div><div style={{ fontWeight: 800, fontSize: 15 }}>Salud Comunitaria — Villa El Sol</div><div style={{ fontSize: 12, color: "var(--muted)" }}>3 voces nuevas · hoy</div></div>
          </div>
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            {DATA.transcript.map((t, idx) => {
              const p = DATA.people[t.who];
              const hot = (idx === 0 && i === 0) || (idx === 1 && i === 1);
              return (
                <div key={idx} style={{ display: "flex", gap: 13, opacity: i < 2 ? (hot ? 1 : .4) : 1, transition: "opacity .3s", outline: hot ? "2px solid var(--warm)" : "none", outlineOffset: 6, borderRadius: 10 }}>
                  <Avatar p={p} size={38} />
                  <div className="grow">
                    <div className="row" style={{ gap: 8 }}><span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span><span style={{ fontSize: 12, color: "var(--muted)" }}>{t.at}</span></div>
                    <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--ink)", lineHeight: 1.5, marginTop: 4 }}>"{t.text}"</div>
                  </div>
                </div>
              );
            })}
            <div style={{ outline: i === 2 ? "2px solid var(--blue)" : "none", outlineOffset: 6, borderRadius: 12 }}>
              <AINote><b>Borrador sugerido por Voz.</b> 2 secciones a partir de estas 3 voces. <u>Tú lo revisas antes de compartir.</u></AINote>
            </div>
          </div>
        </div>

        {/* coach mark */}
        <div className="card float-in" key={i} style={{ position: "absolute", width: 320, padding: 18, boxShadow: "var(--sh-pop)", border: "1.5px solid " + (m.tone === "warm" ? "var(--warm)" : "var(--blue)"), right: -28, top: m.pos.top }}>
          <div className="row" style={{ gap: 9, marginBottom: 7 }}>
            <span style={{ color: m.tone === "warm" ? "var(--warm)" : "var(--blue)" }}><Icon name={m.tone === "warm" ? "mic" : "spark"} size={18} /></span>
            <span style={{ fontWeight: 800, fontSize: 14.5 }}>{m.t}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{m.d}</p>
          <div className="row" style={{ marginTop: 14, gap: 6 }}>
            {marks.map((_, k) => <div key={k} style={{ width: 7, height: 7, borderRadius: 999, background: k === i ? "var(--ink)" : "var(--line)" }} />)}
            <div className="grow" />
            {i < marks.length - 1
              ? <button className="btn btn-primary btn-sm" onClick={() => setI(i + 1)}>Siguiente</button>
              : <button className="btn btn-primary btn-sm" onClick={onFinish}>¡Entendido!</button>}
          </div>
        </div>
      </div>

      <div className="row" style={{ justifyContent: "center", marginTop: 22 }}>
        <button className="btn btn-ghost" onClick={onFinish}>Saltar recorrido</button>
      </div>
    </div>
  );
}

/* ============ Wrapper con switcher de variación ============ */
function Onboarding({ variant, setVariant, onFinish }) {
  const tabs = [
    { id: "wizard", label: "A · Asistente guiado", sub: "Paso a paso, conversacional" },
    { id: "checklist", label: "B · Primeros pasos", sub: "Lista de tareas, no lineal" },
    { id: "tour", label: "C · Recorrido real", sub: "Aprende viendo un ejemplo" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(1200px 600px at 70% -10%, var(--blue-tint), transparent), var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* barra comparadora */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, padding: "13px 22px", display: "flex", alignItems: "center", gap: 14, background: "rgba(235,234,230,.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line-soft)" }}>
        <div className="row" style={{ gap: 9 }}>
          <span className="chip warm" style={{ fontWeight: 800 }}><Icon name="eye" size={14} /> Comparando onboarding</span>
        </div>
        <div className="grow" />
        <div className="row" style={{ gap: 5, background: "var(--surface-2)", padding: 4, borderRadius: 999, border: "1px solid var(--line)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setVariant(t.id)} title={t.sub} style={{
              border: "none", padding: "8px 15px", borderRadius: 999, fontWeight: 700, fontSize: 13,
              background: variant === t.id ? "var(--surface)" : "transparent",
              color: variant === t.id ? "var(--blue-deep)" : "var(--muted)",
              boxShadow: variant === t.id ? "var(--sh-sm)" : "none",
            }}>{t.label}</button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onFinish}>Saltar →</button>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "42px 24px 56px" }}>
        {variant === "wizard" && <VariantWizard onFinish={onFinish} />}
        {variant === "checklist" && <VariantChecklist onFinish={onFinish} />}
        {variant === "tour" && <VariantTour onFinish={onFinish} />}
      </div>
    </div>
  );
}

if (typeof window !== "undefined") window.Onboarding = Onboarding;

/* --- reports.jsx --- */
/* Flujo de generación de informes (pieza central) → window.ReportFlow */
const rUse = useState;
const rEff = useEffect;

function StepBar({ step }) {
  const names = ["Elegir voces", "Borrador IA", "Revisar y editar", "Compartir"];
  return (
    <div className="steps">
      {names.map((n, i) => (
        <div key={n} className={"step " + (i < step ? "done " : "") + (i === step ? "cur" : "")}>
          {i > 0 && <div className="step-bar" />}
          <div className="step-dot">{i < step ? <Icon name="check" size={15} /> : i + 1}</div>
          <span className="step-name">{n}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Paso 0: elegir fuentes ---------- */
function PickSources({ picked, setPicked, tone }) {
  const toggle = (id) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const totalVoices = DATA.conversations.filter(c => picked.includes(c.id)).reduce((a, c) => a + c.voiceNotes, 0);
  return (
    <div className="float-in">
      <div style={{ maxWidth: 720 }}>
        <h2 style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 6px" }}>¿De qué voces quieres partir?</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, margin: 0, lineHeight: 1.55 }}>Elige las conversaciones. Voz reunirá las notas de voz y mensajes ya transcritos — y siempre te mostrará quién dijo qué.</p>
      </div>
      <div className="col" style={{ gap: 11, marginTop: 22, maxWidth: 760 }}>
        {DATA.conversations.map(c => {
          const on = picked.includes(c.id);
          return (
            <button key={c.id} onClick={() => toggle(c.id)} className="card" style={{
              padding: 16, display: "flex", gap: 14, alignItems: "center", textAlign: "left",
              border: "1.5px solid " + (on ? "var(--blue)" : "var(--line)"), background: on ? "var(--blue-tint)" : "var(--surface)", transition: "all .15s",
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, border: "2px solid " + (on ? "var(--blue)" : "var(--line)"), background: on ? "var(--blue)" : "transparent", display: "grid", placeItems: "center", flex: "none", color: "#fff" }}>
                {on && <Icon name="check" size={15} />}
              </div>
              <Avatar p={{ color: c.color, initials: c.initials }} size={42} />
              <div className="grow">
                <div className="row" style={{ gap: 8 }}><span style={{ fontWeight: 800, fontSize: 15.5 }}>{c.name}</span><Chip>{c.kind}</Chip></div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{c.summary}</div>
              </div>
              <div style={{ textAlign: "right", flex: "none" }}>
                <div className="row" style={{ gap: 6, color: "var(--warm-deep)", fontWeight: 700, fontSize: 13.5 }}><Icon name="mic" size={15} /> {c.voiceNotes} voces</div>
                <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 2 }}>{c.lastAt}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 16, gap: 10, color: "var(--ink-soft)", fontSize: 14 }}>
        <Icon name="mic" size={17} style={{ color: "var(--warm)" }} />
        <span><b style={{ color: "var(--ink)" }}>{totalVoices} voces</b> de {picked.length} conversación{picked.length !== 1 ? "es" : ""} entrarán como materia prima.</span>
      </div>
    </div>
  );
}

/* ---------- Paso 1: la IA arma el borrador (con espera honesta) ---------- */
function Drafting({ done }) {
  const [phase, setPhase] = rUse(0);
  const phases = [
    "Reuniendo las notas de voz…",
    "Transcribiendo y ordenando por tema…",
    "Contando voces, personas y temas…",
    "Redactando un borrador (revisable)…",
  ];
  rEff(() => {
    if (phase >= phases.length) { const t = setTimeout(done, 350); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase(p => p + 1), 720);
    return () => clearTimeout(t);
  }, [phase]);
  return (
    <div className="float-in" style={{ maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
      <div style={{ width: 76, height: 76, borderRadius: 22, background: "var(--blue-tint)", display: "grid", placeItems: "center", margin: "0 auto 22px", color: "var(--blue)" }}>
        <Icon name="spark" size={38} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 22px" }}>Voz está preparando un borrador…</h2>
      <div className="col" style={{ gap: 10, textAlign: "left" }}>
        {phases.map((p, i) => (
          <div key={i} className="row" style={{ gap: 12, opacity: i <= phase ? 1 : .4, transition: "opacity .3s" }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, flex: "none", display: "grid", placeItems: "center", background: i < phase ? "var(--green)" : i === phase ? "var(--blue)" : "var(--line)", color: "#fff" }}>
              {i < phase ? <Icon name="check" size={14} /> : i === phase ? <span className="spin" style={{ width: 11, height: 11, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: 999, display: "block" }} /> : <span style={{ width: 7, height: 7, borderRadius: 999, background: "#fff", opacity: .6 }} />}
            </div>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: i <= phase ? "var(--ink)" : "var(--muted)" }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26, padding: 13, background: "var(--warm-tint)", borderRadius: "var(--r-sm)", fontSize: 13, color: "var(--warm-deep)", display: "flex", gap: 9, alignItems: "center", justifyContent: "center" }}>
        <Icon name="shield" size={16} /> Esto es solo un punto de partida. Nada se publica todavía.
      </div>
    </div>
  );
}

/* ---------- Paso 2: revisar bloques (humano en control) ---------- */
/* ---------- Indicadores: lo que se cuenta vs. lo que se estima ---------- */
function MetricBadge({ kind }) {
  return kind === "counted"
    ? <Chip tone="green"><Icon name="check" size={13} /> Contado por Voz</Chip>
    : <Chip tone="amber" dot>Estimado · confírmalo</Chip>;
}

function MetricsPanel({ metrics, setMetrics }) {
  const setVal = (id, v) => setMetrics(m => m.map(x => x.id === id ? { ...x, value: v.replace(/[^0-9.]/g, "") } : x));
  const setInc = (id, v) => setMetrics(m => m.map(x => x.id === id ? { ...x, include: v } : x));
  const inc = metrics.filter(m => m.include).length;
  return (
    <div className="card" style={{ marginBottom: 22, overflow: "hidden" }}>
      <div className="row" style={{ padding: "15px 18px", borderBottom: "1px solid var(--line-soft)", gap: 11 }}>
        <span style={{ color: "var(--blue)" }}><Icon name="spark" size={18} /></span>
        <span style={{ fontWeight: 800, fontSize: 16.5 }}>Indicadores del informe</span>
        <div className="grow" />
        <Chip>{inc} incluidos</Chip>
      </div>
      <div style={{ padding: "14px 18px" }}>
        <AINote>Voz <b>cuenta</b> lo que puede verificar (voces, personas, temas) y <b>marca como estimado</b> lo demás. Las cifras estimadas las ajustas tú — <b>nunca inventamos un número</b> para tu informe.</AINote>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(212px,1fr))", gap: 12, marginTop: 14 }}>
          {metrics.map(mt => {
            const est = mt.kind === "estimated";
            return (
              <div key={mt.id} style={{ padding: 14, borderRadius: "var(--r-sm)", border: "1px solid " + (mt.include && est ? "var(--amber)" : "var(--line)"), background: mt.include ? "var(--surface)" : "var(--surface-2)", opacity: mt.include ? 1 : .55, transition: "all .2s" }}>
                <div className="row" style={{ marginBottom: 9 }}>
                  <MetricBadge kind={mt.kind} />
                  <div className="grow" />
                  <Switch on={mt.include} warm={est} onClick={() => setInc(mt.id, !mt.include)} />
                </div>
                <div className="row" style={{ gap: 4, alignItems: "baseline" }}>
                  {est
                    ? <input value={mt.value} onChange={e => setVal(mt.id, e.target.value)} inputMode="numeric"
                        style={{ width: `${Math.max(2, String(mt.value).length)}ch`, fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", border: "none", borderBottom: "2px dashed var(--amber)", background: "transparent", color: "var(--warm-deep)", fontFamily: "inherit", padding: "0 1px", outline: "none" }} />
                    : <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em" }}>{mt.value}</span>}
                  {mt.unit && <span style={{ fontSize: 18, fontWeight: 800, color: est ? "var(--warm-deep)" : "var(--muted)" }}>{mt.unit}</span>}
                  {est && <span style={{ color: "var(--amber)", marginLeft: 2 }} title="Editable"><Icon name="edit" size={13} /></span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)", marginTop: 3 }}>{mt.label}</div>
                {mt.note && <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>{mt.note}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReviewDraft({ blocks, setBlocks, metrics, setMetrics, tone }) {
  const [editing, setEditing] = rUse(null);
  const setInc = (id, v) => setBlocks(b => b.map(x => x.id === id ? { ...x, include: v } : x));
  const setText = (id, txt) => setBlocks(b => b.map(x => x.id === id ? { ...x, ai: txt } : x));
  const incCount = blocks.filter(b => b.include).length;

  return (
    <div className="float-in">
      <div className="row" style={{ alignItems: "flex-start", gap: 20, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 6px" }}>Tu borrador, palabra por palabra</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 15, margin: 0, lineHeight: 1.55 }}>Cada sección muestra <b>lo que redactó la IA</b> y, al lado, <b>las voces reales</b> que la sustentan. Edita, quita o conserva lo que quieras.</p>
        </div>
        <div className="grow" />
        <div className="chip blue" style={{ padding: "7px 13px", fontSize: 13 }}><Icon name="check" size={15} /> {incCount} de {blocks.length} secciones incluidas</div>
      </div>

      <MetricsPanel metrics={metrics} setMetrics={setMetrics} />

      <div className="col" style={{ gap: 16 }}>
        {blocks.map(b => { const isTeam = b.kindTag === "reporte"; return (
          <div key={b.id} className="card" style={{ opacity: b.include ? 1 : .58, transition: "opacity .2s", border: b.flagged ? "1.5px solid var(--amber)" : "1px solid var(--line)" }}>
            <div className="row" style={{ padding: "15px 18px", borderBottom: b.include ? "1px solid var(--line-soft)" : "none", gap: 12 }}>
              <span style={{ fontWeight: 800, fontSize: 16.5 }}>{b.heading}</span>
              {b.kindTag === "reporte" && <Chip tone="blue"><Icon name="users" size={13} /> Reporte del equipo</Chip>}
              {b.kindTag === "testimonio" && <Chip tone="warm" dot>Testimonio de comunidad</Chip>}
              {b.flagged && <Chip tone="amber" dot>Sugerencia de la IA — revísala bien</Chip>}
              <div className="grow" />
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{b.include ? "Incluida" : "Omitida"}</span>
              <Switch on={b.include} onClick={() => setInc(b.id, !b.include)} />
            </div>
            {b.include && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px" }}>
                {/* texto IA editable */}
                <div style={{ padding: 18, borderRight: "1px solid var(--line-soft)" }}>
                  <div className="row" style={{ gap: 7, marginBottom: 9, color: "var(--blue)" }}>
                    <Icon name="spark" size={15} /><span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>Redactado por la IA · editable</span>
                  </div>
                  {editing === b.id
                    ? <textarea autoFocus value={b.ai} onChange={e => setText(b.id, e.target.value)} onBlur={() => setEditing(null)}
                        style={{ width: "100%", minHeight: 96, border: "1.5px solid var(--blue)", borderRadius: 10, padding: 11, fontFamily: "inherit", fontSize: 15, lineHeight: 1.55, color: "var(--ink)", resize: "vertical", outline: "none" }} />
                    : <p onClick={() => setEditing(b.id)} style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink)", cursor: "text", borderRadius: 8, padding: 4, marginLeft: -4 }}>
                        {b.ai} <span className="row" style={{ display: "inline-flex", gap: 4, color: "var(--blue)", fontSize: 12.5, fontWeight: 700, verticalAlign: "middle", marginLeft: 4 }}><Icon name="edit" size={13} /> editar</span>
                      </p>}
                </div>
                {/* fuentes reales */}
                <div style={{ padding: 18, background: isTeam ? "var(--blue-tint)" : "var(--warm-tint)" }}>
                  <div className="row" style={{ gap: 7, marginBottom: 11, color: isTeam ? "var(--blue-deep)" : "var(--warm-deep)" }}>
                    <Icon name={isTeam ? "users" : "mic"} size={15} /><span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>{isTeam ? "Reporte del equipo" : "Voces de la comunidad"}</span>
                  </div>
                  {b.sources.length === 0
                    ? <div style={{ fontSize: 13.5, color: "var(--warm-deep)", lineHeight: 1.5, fontStyle: "italic" }}>⚠ Esta sección no cita ninguna voz directa. Es una interpretación de la IA — decide si va.</div>
                    : <div className="col" style={{ gap: 13 }}>
                        {b.sources.map((s, i) => {
                          const p = DATA.people[s.who];
                          return (
                            <div key={i}>
                              <div className="row" style={{ gap: 8, marginBottom: 4 }}><Avatar p={p} size={26} /><span style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</span></div>
                              <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14.5, color: "var(--ink)", lineHeight: 1.45, paddingLeft: 4, borderLeft: "2px solid " + (isTeam ? "var(--blue)" : "var(--warm)") }}>&nbsp;&nbsp;"{s.quote}"</div>
                            </div>
                          );
                        })}
                      </div>}
                </div>
              </div>
            )}
          </div>
        ); })}
      </div>

      <div className="row" style={{ gap: 10, marginTop: 16 }}>
        <button className="btn btn-ghost"><Icon name="plus" size={16} /> Añadir sección a mano</button>
        <button className="btn btn-soft"><Icon name="spark" size={16} /> Pedir otra redacción</button>
      </div>
    </div>
  );
}

/* ---------- Paso 3: aprobar y compartir ---------- */
function Share({ blocks, metrics, onClose }) {
  const [approved, setApproved] = rUse(false);
  const included = blocks.filter(b => b.include);
  const mInc = (metrics || []).filter(m => m.include);
  const hasEst = mInc.some(m => m.kind === "estimated");
  const totalVoices = new Set(included.flatMap(b => b.sources.map(s => s.who))).size;

  return (
    <div className="float-in" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 26, alignItems: "start" }}>
      {/* vista previa del informe */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ height: 8, background: "linear-gradient(90deg, var(--blue), var(--warm))" }} />
        <div style={{ padding: "30px 34px" }}>
          <div className="row" style={{ gap: 9, marginBottom: 14 }}>
            <Chip tone="blue" dot>Salud Comunitaria</Chip>
            <Chip>Marzo 2026</Chip>
          </div>
          <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.025em", margin: "0 0 8px", lineHeight: 1.15 }}>Impacto de la posta médica en Villa El Sol</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 22px" }}>Basado en {totalVoices} testimonios recogidos por WhatsApp · Fundación Raíces</p>
          {mInc.length > 0 && <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid var(--line)", borderRadius: "var(--r)", overflow: "hidden" }}>
              {mInc.map((m, i) => (
                <div key={m.id} style={{ flex: "1 1 110px", padding: "15px 18px", borderLeft: i ? "1px solid var(--line)" : "none", background: "var(--surface)" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1, color: m.kind === "estimated" ? "var(--warm-deep)" : "var(--ink)" }}>{m.value}{m.unit || ""}{m.kind === "estimated" && <span style={{ fontSize: 14 }}>*</span>}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 5 }}>{m.label}</div>
                </div>
              ))}
            </div>
            {hasEst && <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 7 }}>* Cifra estimada y revisada por el equipo de Fundación Raíces.</div>}
          </div>}
          {included.map(b => (
            <div key={b.id} style={{ marginBottom: 22 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 7px" }}>{b.heading}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink)", margin: "0 0 10px" }}>{b.ai}</p>
              {b.sources.map((s, i) => {
                const p = DATA.people[s.who];
                return <div key={i} className="quote" style={{ paddingLeft: 14, borderLeft: "3px solid " + (p.team ? "var(--blue)" : "var(--warm)"), margin: "8px 0", fontSize: 16 }}>
                  "{s.quote}"<div style={{ fontFamily: "var(--sans)", fontStyle: "normal", fontSize: 12.5, color: "var(--muted)", fontWeight: 700, marginTop: 4 }}>— {p.name}, {p.role}</div>
                </div>;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* panel de aprobar / compartir */}
      <div className="col" style={{ gap: 16, position: "sticky", top: 90 }}>
        <div className="card card-pad">
          <div className="row" style={{ gap: 10, marginBottom: 12 }}><span style={{ color: "var(--warm)" }}><Icon name="shield" size={20} /></span><span style={{ fontWeight: 800, fontSize: 16 }}>El último paso es tuyo</span></div>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55, margin: "0 0 14px" }}>Revisa que el informe suene como tu organización. Voz no comparte nada hasta que tú lo apruebes.</p>
          <label className="row" style={{ gap: 11, padding: 12, borderRadius: "var(--r-sm)", background: approved ? "var(--green-tint)" : "var(--surface-2)", border: "1px solid " + (approved ? "var(--green)" : "var(--line)"), cursor: "pointer", transition: "all .15s" }}>
            <Switch on={approved} warm onClick={() => setApproved(a => !a)} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: approved ? "var(--green-deep)" : "var(--ink)" }}>{approved ? "Revisado y aprobado por mí" : "Confirmo que lo revisé"}</span>
          </label>
        </div>

        <div className="card card-pad">
          <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 12 }}>Compartir</div>
          <div className="col" style={{ gap: 9 }}>
            <button className="btn btn-primary" disabled={!approved}><Icon name="down" size={17} /> Descargar PDF</button>
            <button className="btn btn-ghost" disabled={!approved}><Icon name="link" size={17} /> Copiar enlace para dirección</button>
            <button className="btn btn-ghost" disabled={!approved}><Icon name="chat" size={17} /> Enviar resumen por WhatsApp</button>
          </div>
          {!approved && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 11, textAlign: "center" }}>Activa la aprobación para habilitar</div>}
        </div>

        {approved && <div className="card card-pad float-in" style={{ background: "var(--green-tint)", border: "1px solid var(--green)" }}>
          <div className="row" style={{ gap: 9, color: "var(--green-deep)", fontWeight: 700, fontSize: 14 }}><Icon name="check" size={18} /> Informe listo para compartir 🎉</div>
        </div>}
      </div>
    </div>
  );
}

/* ---------- Wrapper del flujo ---------- */
function ReportFlow({ onClose, tone }) {
  const [step, setStep] = rUse(0);
  const [picked, setPicked] = rUse(["salud"]);
  const [blocks, setBlocks] = rUse(() => DATA.draftBlocks.map(b => ({ ...b })));
  const [metrics, setMetrics] = rUse(() => ([
    { id: "voces", label: "Voces recogidas", value: "8", kind: "counted", include: true },
    { id: "personas", label: "Personas escuchadas", value: "6", kind: "counted", include: true },
    { id: "temas", label: "Temas recurrentes", value: "3", kind: "counted", include: true },
    { id: "impacto", label: "Personas impactadas", value: "120", kind: "estimated", include: true, note: "Estimado por el tamaño del grupo. Pon tu dato real si lo tienes." },
    { id: "mejora", label: "Reportan mejor acceso", value: "75", unit: "%", kind: "estimated", include: false, note: "6 de 8 voces lo mencionan. Revísalo antes de publicar." },
  ]));
  const canNext = step === 0 ? picked.length > 0 : true;

  return (
    <div style={{ minHeight: "100%" }}>
      {/* cabecera del flujo */}
      <div className="topbar" style={{ justifyContent: "space-between" }}>
        <div className="row" style={{ gap: 14 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="back" size={16} /> Salir</button>
          <div><h1 style={{ fontSize: 18 }}>Nuevo informe</h1></div>
        </div>
        <StepBar step={step} />
        <div style={{ width: 90 }} />
      </div>

      <div className="page" style={{ maxWidth: step === 3 ? 1180 : 900 }}>
        {step === 0 && <PickSources picked={picked} setPicked={setPicked} tone={tone} />}
        {step === 1 && <Drafting done={() => setStep(2)} />}
        {step === 2 && <ReviewDraft blocks={blocks} setBlocks={setBlocks} metrics={metrics} setMetrics={setMetrics} tone={tone} />}
        {step === 3 && <Share blocks={blocks} metrics={metrics} onClose={onClose} />}

        {step !== 1 && (
          <div className="row" style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid var(--line)", gap: 12 }}>
            {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(s => s === 2 ? 0 : s - 1)}><Icon name="back" size={16} /> Atrás</button>}
            <div className="grow" />
            {step === 0 && <button className="btn btn-primary btn-lg" disabled={!canNext} onClick={() => setStep(1)}>Preparar borrador con Voz <Icon name="spark" size={16} /></button>}
            {step === 2 && <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Revisar versión final <Icon name="arrow" size={16} /></button>}
            {step === 3 && <button className="btn btn-ghost" onClick={onClose}>Guardar y cerrar</button>}
          </div>
        )}
      </div>
    </div>
  );
}

if (typeof window !== "undefined") window.ReportFlow = ReportFlow;

let __sp; if (typeof document !== "undefined") { __sp = document.createElement("style");
__sp.textContent = "@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .7s linear infinite}";
document.head.appendChild(__sp); }

/* --- analytics.jsx --- */
/* Panel de datos — indicadores demográficos fusionados → window.Analytics */
const dUse = useState;

function fmt(n) { return Math.round(n).toLocaleString("es-PE"); }

/* Donut con segmentos SVG (círculos = formas simples, fiables) */
function Donut({ data, size = 150, thickness = 22 }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-soft)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const len = c * d.value / 100;
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color}
              strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off}
              transform={`rotate(-90 ${size / 2} ${size / 2})`} />
          );
          off += len; return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{data[0].value}%</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{data[0].label.toLowerCase()}</div>
        </div>
      </div>
    </div>
  );
}

function AgeBars({ data }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 12, height: 168 }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-soft)" }}>{d.value}%</div>
          <div style={{ width: "100%", maxWidth: 46, height: `${d.value / max * 118}px`, background: "linear-gradient(180deg, var(--blue), var(--blue-deep))", borderRadius: "7px 7px 3px 3px" }} />
          <div style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function ProgBars({ data, mult }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="col" style={{ gap: 13 }}>
      {data.map(d => (
        <div key={d.name}>
          <div className="row" style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{d.name}</span>
            <div className="grow" />
            <span style={{ fontSize: 13, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(d.value * mult)}</span>
          </div>
          <div style={{ height: 11, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${d.value / max * 100}%`, height: "100%", background: d.color, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Trend({ data, mult }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 9, height: 150 }}>
      {data.map((d, i) => {
        const last = i === data.length - 1;
        return (
          <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 7 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: last ? "var(--warm-deep)" : "var(--faint)", whiteSpace: "nowrap" }}>{last ? fmt(d.v * mult) : ""}</div>
            <div style={{ width: "100%", maxWidth: 34, height: `${d.v / max * 100}px`, background: last ? "var(--warm)" : "var(--blue-tint2)", borderRadius: "6px 6px 3px 3px" }} />
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{d.m}</div>
          </div>
        );
      })}
    </div>
  );
}

function StatBig({ value, label, sub, tone, note }) {
  return (
    <div className="card card-pad" style={{ flex: 1 }}>
      <div className="row" style={{ gap: 8, marginBottom: 9 }}>
        <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, color: tone === "warm" ? "var(--warm-deep)" : "var(--ink)" }}>{value}{note && <span style={{ fontSize: 17 }}>*</span>}</span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink-soft)" }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function HeroStat({ value, label, sub, period }) {
  return (
    <div className="bento-hero card">
      <div className="bento-hero-top">
        <span className="bento-hero-tag">Impacto · {period}</span>
        <Icon name="arrow" size={15} style={{ opacity: .75 }} />
      </div>
      <div className="bento-hero-value">{value}<span>*</span></div>
      <div className="bento-hero-label">{label}</div>
      {sub && <div className="bento-hero-sub">{sub}</div>}
    </div>
  );
}

function StatMini({ value, label }) {
  return (
    <div className="bento-mini card">
      <div className="bento-mini-val">{value}</div>
      <div className="bento-mini-lbl">{label}</div>
    </div>
  );
}

function StatAccent({ value, label, sub }) {
  return (
    <div className="bento-accent card">
      <div className="bento-accent-top">
        <span className="bento-accent-lbl">{label}</span>
        <Icon name="mic" size={16} style={{ color: "var(--blue)" }} />
      </div>
      <div className="bento-accent-val">{value}</div>
      {sub && <div className="bento-accent-sub">{sub}</div>}
    </div>
  );
}

function Panel({ title, sub, children, foot }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ padding: "4px 20px 20px" }}>{children}</div>
      {foot && <div style={{ padding: "11px 20px", borderTop: "1px solid var(--line-soft)", fontSize: 12, color: "var(--muted)" }}>{foot}</div>}
    </div>
  );
}

function Analytics({ setPage, onNew, copy }) {
  const a = DATA.analytics;
  const [scope, setScope] = dUse("mes");
  const sc = a.scopes.find(s => s.id === scope);
  const mult = sc.mult;
  const recentVoices = [DATA.teamReports[0], ...DATA.transcript].slice(0, 2);

  return (
    <div className="page float-in">
      <div className="inicio-header">
        <div className="inicio-header-main">
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.025em", margin: 0 }}>{copy?.greet ?? "Buenos días"}, Carla 👋</h2>
          <p style={{ color: "var(--muted)", fontSize: 14.5, margin: "4px 0 0" }}>Datos fusionados de tus eventos, voces y documentos · <b style={{ color: "var(--ink-soft)" }}>{sc.label}</b></p>
        </div>
        <div className="inicio-header-actions">
          <div className="scope-toggle">
            {a.scopes.map(s => (
              <button key={s.id} onClick={() => setScope(s.id)} style={{
                border: "none", padding: "7px 14px", borderRadius: 999, fontWeight: 700, fontSize: 13,
                background: scope === s.id ? "var(--surface)" : "transparent",
                color: scope === s.id ? "var(--blue-deep)" : "var(--muted)",
                boxShadow: scope === s.id ? "var(--sh-sm)" : "none",
              }}>{s.id === "mes" ? "Mes" : s.id === "tri" ? "Trimestre" : "Año"}</button>
            ))}
          </div>
          <button className="btn btn-ghost"><Icon name="down" size={16} /> Exportar</button>
          {onNew && <button className="btn btn-primary btn-lg" onClick={onNew}><Icon name="plus" size={18} /> Nuevo informe</button>}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <AINote>Estos indicadores <b>fusionan</b> tus eventos, los testimonios de la comunidad, los reportes del equipo y los documentos que subiste. Los datos demográficos son <b>auto-declarados</b> por las personas — trátalos como aproximados, no como censo.</AINote>
      </div>

      <div className="inicio-bento">
        {/* Col 1 — caja destacada + mini stats */}
        <HeroStat
          value={fmt(a.base.impacted * mult)}
          label="Personas impactadas"
          sub="Suma de todos los eventos"
          period={sc.label.toLowerCase()}
        />
        <div className="bento-minis">
          <StatMini value={fmt(a.base.events * mult)} label="Eventos / jornadas" />
          <StatMini value={fmt(a.base.docs * mult)} label="Documentos" />
        </div>

        {/* Col 2 — gráfico principal + demografía */}
        <div className="bento-trend">
          <Panel title="Tendencia de impacto" sub="Personas alcanzadas por mes">
            <Trend data={a.trend} mult={mult} />
          </Panel>
        </div>
        <div className="bento-demo">
          <Panel title="Género" sub="Distribución" foot="Auto-declarado · 3% sin dato">
            <div className="donut-row">
              <Donut data={a.gender} size={120} thickness={18} />
              <div className="col" style={{ gap: 8, flex: 1, minWidth: 100 }}>
                {a.gender.map(g => (
                  <div key={g.label} className="row" style={{ gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: g.color, flex: "none" }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)" }}>{g.label}</span>
                    <div className="grow" />
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{g.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel title="Rango de edad" sub="% alcanzadas">
            <AgeBars data={a.age} />
          </Panel>
        </div>

        {/* Fila ancha — programas (como Payment History) */}
        <div className="bento-wide">
          <Panel title="Personas por programa" sub={`Total: ${fmt(a.base.impacted * mult)} · ${sc.label}`}>
            <ProgBars data={a.programs} mult={mult} />
          </Panel>
        </div>

        {/* Col 3 — voces + CTA */}
        <StatAccent
          value={fmt(a.base.voices * mult)}
          label="Voces recogidas"
          sub="Testimonios + reportes"
        />
        <div className="bento-voices card voices-card">
          <div className="voices-card-head">
            <h3>Voces recientes</h3>
            <div className="grow" />
            {setPage && <button className="btn btn-soft btn-sm" onClick={() => setPage("convos")}>Ver todas <Icon name="arrow" size={14} /></button>}
          </div>
          {recentVoices.map((t, i) => {
            const p = DATA.people[t.who];
            return (
              <div key={i} className="voice-item">
                <div className="voice-item-head">
                  <Avatar p={p} size={34} />
                  <div className="voice-item-meta">
                    <span className="voice-item-name">{p.name}</span>
                    <span className="voice-item-time">{t.at}</span>
                  </div>
                </div>
                <p className="voice-item-text">{t.text}</p>
                <VoicePlayer dur={t.dur} color={p.color} compact />
              </div>
            );
          })}
        </div>
        {onNew && (
          <div className="bento-cta card card-pad">
            <div style={{ color: "var(--blue)", marginBottom: 8 }}><Icon name="spark" size={22} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 6px" }}>8 voces sobre salud</h3>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5, margin: "0 0 12px" }}>Listas para un informe sólido.</p>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={onNew}>Crear informe</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>* Cifra que combina conteos exactos y estimaciones revisadas por el equipo.</div>
    </div>
  );
}

if (typeof window !== "undefined") window.Analytics = Analytics;

/* --- importar.jsx --- */
/* Importar documentos → generar informe → window.Importar */
const iUse = useState;
const iRef = useRef;

const TYPE_META = {
  pdf: { label: "PDF", color: "#B85C5C", tint: "#FDECEA", detected: ["Testimonios", "Acuerdos", "Fechas"], note: (n) => `${n} páginas` },
  xls: { label: "XLS", color: "#5D7A66", tint: "#E8F5E9", detected: ["Tabla", "Edad", "Género", "Distrito"], note: (n) => `${n} registros` },
  doc: { label: "DOC", color: "#4A6352", tint: "#E8EDE9", detected: ["Texto", "Secciones"], note: () => "documento de texto" },
};
function extType(name) {
  const e = (name.split(".").pop() || "").toLowerCase();
  if (["xls", "xlsx", "csv"].includes(e)) return "xls";
  if (["doc", "docx", "txt", "rtf"].includes(e)) return "doc";
  return "pdf";
}

function FileRow({ f, onRemove }) {
  const meta = TYPE_META[f.type];
  return (
    <div className="card" style={{ padding: 14, display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 11, flex: "none", display: "grid", placeItems: "center", background: meta.tint, color: meta.color, fontWeight: 800, fontSize: 12.5, letterSpacing: ".02em" }}>
        {meta.label}
      </div>
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 9 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
          <span style={{ fontSize: 12, color: "var(--faint)", flex: "none" }}>{f.size}</span>
        </div>
        {f.status === "proc"
          ? <div className="row" style={{ gap: 9, marginTop: 6, color: "var(--blue)" }}>
              <span className="spin" style={{ width: 13, height: 13, border: "2px solid var(--blue)", borderTopColor: "transparent", borderRadius: 999, display: "block" }} />
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Leyendo y extrayendo datos…</span>
            </div>
          : <div className="row" style={{ gap: 6, marginTop: 7, flexWrap: "wrap" }}>
              <Chip tone="green"><Icon name="check" size={12} /> {f.note}</Chip>
              {f.detected.map(d => <Chip key={d} tone="blue">{d}</Chip>)}
            </div>}
      </div>
      {f.status === "done" && <button onClick={() => onRemove(f.id)} className="btn btn-ghost btn-sm" style={{ flex: "none" }} title="Quitar"><Icon name="trash" size={15} /></button>}
    </div>
  );
}

function Importar({ onGenerate, goDatos }) {
  const [files, setFiles] = iUse(() => DATA.documents.map(d => ({ ...d })));
  const [drag, setDrag] = iUse(false);
  const inputRef = iRef(null);

  const addFiles = (list) => {
    const incoming = Array.from(list).map((file, i) => {
      const type = extType(file.name);
      const meta = TYPE_META[type];
      const n = type === "xls" ? 40 + Math.floor(Math.random() * 110) : 2 + Math.floor(Math.random() * 8);
      return {
        id: "u" + Date.now() + i, name: file.name, type, status: "proc",
        size: file.size ? (file.size > 1e6 ? (file.size / 1e6).toFixed(1) + " MB" : Math.round(file.size / 1024) + " KB") : "—",
        note: meta.note(n), detected: meta.detected,
      };
    });
    if (!incoming.length) return;
    setFiles(f => [...incoming, ...f]);
    incoming.forEach((doc, k) => {
      setTimeout(() => setFiles(f => f.map(x => x.id === doc.id ? { ...x, status: "done" } : x)), 1400 + k * 500);
    });
  };

  const onDrop = (e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); };
  const remove = (id) => setFiles(f => f.filter(x => x.id !== id));

  const done = files.filter(f => f.status === "done");
  const processing = files.some(f => f.status === "proc");
  const tables = done.filter(f => f.type === "xls").length;
  const docsTxt = done.filter(f => f.type !== "xls").length;

  return (
    <div className="page float-in" style={{ maxWidth: 920 }}>
      <h2 style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.025em", margin: 0 }}>Importar documentos</h2>
      <p style={{ color: "var(--ink-soft)", fontSize: 15, margin: "5px 0 0", lineHeight: 1.55, maxWidth: 620 }}>Sube actas, listas de asistencia o encuestas en <b>PDF, Excel o Word</b>. Voz los lee, extrae los datos y prepara un borrador de informe — que <b>tú revisas</b> antes de compartir.</p>

      {/* dropzone */}
      <div
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          marginTop: 20, padding: "34px 24px", borderRadius: "var(--r-lg)", cursor: "pointer", textAlign: "center",
          border: "2px dashed " + (drag ? "var(--blue)" : "var(--line)"),
          background: drag ? "var(--blue-tint)" : "var(--surface)", transition: "all .15s",
        }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--blue-tint)", color: "var(--blue)", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><Icon name="upload" size={28} /></div>
        <div style={{ fontWeight: 800, fontSize: 16.5 }}>Arrastra tus archivos aquí o haz clic para elegir</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>PDF, Excel (.xlsx, .csv) o Word · hasta 25 MB</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.txt" style={{ display: "none" }}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </div>

      {/* lista */}
      <div className="row" style={{ margin: "24px 0 12px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Documentos ({files.length})</h3>
        {processing && <span className="chip blue" style={{ marginLeft: 10 }}>Procesando…</span>}
      </div>
      <div className="col" style={{ gap: 11 }}>
        {files.map(f => <FileRow key={f.id} f={f} onRemove={remove} />)}
      </div>

      {/* resumen + generar */}
      <div className="card" style={{ marginTop: 20, padding: 0, overflow: "hidden", border: "1px solid var(--blue-tint2)" }}>
        <div style={{ padding: 20, background: "linear-gradient(165deg, var(--blue-tint), var(--green-tint))" }}>
          <div className="row" style={{ gap: 11, marginBottom: 10 }}>
            <span style={{ color: "var(--blue)" }}><Icon name="spark" size={22} /></span>
            <span style={{ fontWeight: 800, fontSize: 17 }}>Voz leyó {done.length} documento{done.length !== 1 ? "s" : ""}</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--blue-ink)", lineHeight: 1.55, margin: "0 0 4px" }}>
            Detecté {tables > 0 && <b>{tables} tabla{tables !== 1 ? "s" : ""} con datos demográficos</b>}{tables > 0 && docsTxt > 0 ? " y " : ""}{docsTxt > 0 && <b>{docsTxt} documento{docsTxt !== 1 ? "s" : ""} de texto</b>}. Puedo cruzarlos con las voces de WhatsApp y armar un borrador.
          </p>
          <div className="row" style={{ gap: 8, marginTop: 8 }}><Icon name="shield" size={15} style={{ color: "var(--blue)" }} /><span style={{ fontSize: 12.5, color: "var(--blue-ink)" }}>Nada se publica solo — el borrador pasa por tu revisión.</span></div>
        </div>
        <div className="row" style={{ padding: 16, gap: 10 }}>
          <button className="btn btn-primary btn-lg" disabled={!done.length || processing} onClick={onGenerate}><Icon name="doc" size={17} /> Generar informe</button>
          <button className="btn btn-ghost" onClick={goDatos}><Icon name="chart" size={16} /> Ver datos en el Panel</button>
          <div className="grow" />
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{tables > 0 ? "Los datos demográficos alimentan tu Panel de datos" : ""}</span>
        </div>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") window.Importar = Importar;

/* --- app.jsx --- */
/* App shell + páginas + root → monta en #root */
const aUse = useState;

/* ---------------- Sidebar ---------------- */
function Sidebar({ page, setPage, open, onNavigate }) {
  const go = (id) => { setPage(id); onNavigate?.(); };
  const mainNav = [
    { id: "inicio", icon: "home", label: "Inicio" },
    { id: "convos", icon: "chat", label: "Conversaciones", badge: "5" },
    { id: "importar", icon: "upload", label: "Importar" },
    { id: "informes", icon: "doc", label: "Informes" },
  ];
  const orgNav = [
    { id: "equipo", icon: "users", label: "Equipo" },
    { id: "autom", icon: "wand", label: "Automatizaciones" },
  ];

  const NavIcon = ({ item }) => (
    <button
      type="button"
      className={"nav-icon" + (page === item.id ? " active" : "")}
      onClick={() => go(item.id)}
      title={item.label}
      aria-label={item.label}
      aria-current={page === item.id ? "page" : undefined}
    >
      <Icon name={item.icon} size={22} />
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </button>
  );

  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <nav className="nav-island" aria-label="Trabajo">
        {mainNav.map(n => <NavIcon key={n.id} item={n} />)}
      </nav>
      <nav className="nav-island" aria-label="Organización">
        {orgNav.map(n => <NavIcon key={n.id} item={n} />)}
      </nav>
      <nav className="nav-island nav-island-foot" aria-label="Sistema">
        <button type="button" className="nav-icon" title="Configuración" aria-label="Configuración">
          <Icon name="gear" size={22} />
        </button>
      </nav>
    </aside>
  );
}

/* ---------------- Inicio (panel de datos + voces recientes) ---------------- */
function Inicio({ onNew, setPage, copy }) {
  return <Analytics setPage={setPage} onNew={onNew} copy={copy} />;
}

/* ---------------- Conversaciones ---------------- */
function Convos() {
  const [sel, setSel] = aUse(DATA.conversations[0].id);
  const c = DATA.conversations.find(x => x.id === sel);
  return (
    <div className="convos-layout">
      <div className="convos-list">
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 12, top: 11, color: "var(--faint)" }}><Icon name="search" size={17} /></span>
          <input placeholder="Buscar persona o tema…" style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface-2)", fontSize: 13.5, fontFamily: "inherit", outline: "none" }} />
        </div>
        {DATA.conversations.map(cv => (
          <button key={cv.id} onClick={() => setSel(cv.id)} className="nav-item" style={{ height: "auto", padding: 12, gap: 12, marginBottom: 4, background: sel === cv.id ? "var(--blue-tint)" : "transparent", alignItems: "flex-start" }}>
            <Avatar p={{ color: cv.color, initials: cv.initials }} size={42} />
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="row" style={{ gap: 6 }}><span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cv.name}</span>{cv.unread > 0 && <span className="badge" style={{ marginLeft: "auto" }}>{cv.unread}</span>}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 400 }}>{cv.summary}</div>
              <div className="row" style={{ gap: 8, marginTop: 5 }}><span style={{ fontSize: 11.5, color: "var(--warm-deep)", fontWeight: 700 }} className="row"><Icon name="mic" size={12} /> {cv.voiceNotes}</span><span style={{ fontSize: 11.5, color: "var(--faint)" }}>{cv.lastAt}</span></div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ overflowY: "auto" }}>
        <div className="topbar" style={{ padding: "16px 28px" }}>
          <Avatar p={{ color: c.color, initials: c.initials }} size={40} />
          <div><h1 style={{ fontSize: 17 }}>{c.name}</h1><div className="sub">{c.members} {c.members > 1 ? "personas" : "persona"} · {c.voiceNotes} notas de voz</div></div>
          <div className="topbar-spacer" />
          <button className="btn btn-soft btn-sm"><Icon name="doc" size={15} /> Usar en un informe</button>
        </div>
        <div style={{ padding: "20px 28px 60px", maxWidth: 760 }}>
          <AINote><b>Transcripción automática activada.</b> Las notas de voz se convierten en texto al llegar. Puedes corregir cualquier palabra — la grabación original se conserva.</AINote>
          <div style={{ marginTop: 18 }}>
            {(c.role === "team" ? DATA.teamReports : DATA.transcript).map((t, i) => {
              const p = DATA.people[t.who];
              const isTeam = t.kind === "reporte";
              return (
                <div key={i} className="tline" style={{ padding: "16px 0" }}>
                  <Avatar p={p} size={40} />
                  <div className="grow">
                    <div className="row" style={{ gap: 8 }}><span style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</span>{isTeam ? <Chip tone="blue"><Icon name="users" size={12} /> Reporte de equipo</Chip> : <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.role}</span>}<span className="grow" /><span style={{ fontSize: 12, color: "var(--muted)" }}>{t.at}</span></div>
                    <div className="row" style={{ margin: "8px 0" }}><VoicePlayer dur={t.dur} color={p.color} /></div>
                    <div style={{ fontSize: 15.5, color: "var(--ink)", lineHeight: 1.6 }}>{t.text}</div>
                    <div className="row" style={{ gap: 7, marginTop: 9, flexWrap: "wrap" }}>{t.tags.map(tag => <Chip key={tag} tone={isTeam ? "" : "blue"}>{tag}</Chip>)}<button className="chip" style={{ cursor: "pointer" }}><Icon name="plus" size={13} /> etiqueta</button></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Informes (lista) ---------------- */
function Informes({ onNew }) {
  return (
    <div className="page float-in">
      <div className="row" style={{ marginBottom: 22 }}>
        <div><h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>Informes</h2><p style={{ color: "var(--muted)", fontSize: 14.5, margin: "4px 0 0" }}>Reportes armados con las voces de tu comunidad, tu equipo y tus documentos.</p></div>
        <div className="grow" />
        <button className="btn btn-primary btn-lg" onClick={onNew}><Icon name="plus" size={18} /> Nuevo informe</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>
        <button onClick={onNew} className="card" style={{ padding: 24, border: "1.5px dashed var(--blue)", background: "var(--blue-tint)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, textAlign: "left", minHeight: 200, justifyContent: "center" }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="spark" size={26} /></div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "var(--blue-deep)" }}>Empezar un informe</div>
          <div style={{ fontSize: 13.5, color: "var(--blue-ink)", lineHeight: 1.5 }}>Elige las voces, Voz arma un borrador y tú lo revisas paso a paso.</div>
        </button>
        {DATA.reports.map(r => (
          <div key={r.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 7, background: r.color }} />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
              <div className="row" style={{ marginBottom: 12 }}>
                <Chip tone={r.status === "Aprobado" ? "green" : "amber"} dot>{r.status}</Chip>
                <div className="grow" />
                <span style={{ fontSize: 12, color: "var(--faint)" }}>{r.updated}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.25 }}>{r.title}</h3>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{r.program}</div>
              <div className="row" style={{ marginTop: "auto", paddingTop: 16, gap: 8 }}>
                <span className="row" style={{ gap: 6, color: "var(--warm-deep)", fontWeight: 700, fontSize: 13 }}><Icon name="mic" size={14} /> {r.voices} voces</span>
                {r.impact && <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>· <b style={{ color: "var(--ink)" }}>{r.impact}</b> {r.impactLabel}</span>}
                <div className="grow" />
                <button className="btn btn-ghost btn-sm"><Icon name="eye" size={14} /> Abrir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Automatizaciones (con cuidado) ---------------- */
function Automatizaciones() {
  const [state, setState] = aUse({ transcribe: true, group: true, notify: false, autodraft: false, autoreply: false });
  const set = (k) => setState(s => ({ ...s, [k]: !s[k] }));
  const items = [
    { id: "transcribe", t: "Transcribir las notas de voz al llegar", d: "Convierte audio a texto automáticamente. La grabación original siempre se conserva.", safe: true },
    { id: "group", t: "Agrupar voces parecidas por tema", d: "Te ahorra ordenar a mano. Solo sugiere agrupaciones — tú puedes deshacerlas.", safe: true },
    { id: "notify", t: "Avisarme cuando haya suficientes voces para un informe", d: "Una notificación amable, sin presión. Tú decides si lo creas.", safe: true },
    { id: "autodraft", t: "Preparar borradores de informe automáticamente", d: "Voz dejaría un borrador listo para que lo revises. Nunca se comparte solo.", caution: true },
  ];
  return (
    <div className="page float-in" style={{ maxWidth: 800 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>Automatizaciones</h2>
      <p style={{ color: "var(--ink-soft)", fontSize: 15, margin: "6px 0 0", lineHeight: 1.55, maxWidth: 620 }}>Voz puede ayudarte con el trabajo repetitivo. Pero todo lo que tenga que ver con <b>hablar por tu organización</b> queda apagado — y bajo tu control.</p>

      <div className="card" style={{ marginTop: 22, overflow: "hidden" }}>
        {items.map((it, i) => (
          <div key={it.id} className="row" style={{ padding: "17px 20px", gap: 16, borderTop: i ? "1px solid var(--line-soft)" : "none", alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, flex: "none", display: "grid", placeItems: "center", background: it.caution ? "var(--amber-tint)" : "var(--blue-tint)", color: it.caution ? "#8A7340" : "var(--blue)" }}><Icon name={it.caution ? "spark" : "wand"} size={20} /></div>
            <div className="grow">
              <div className="row" style={{ gap: 9 }}><span style={{ fontWeight: 800, fontSize: 15.5 }}>{it.t}</span>{it.safe && <Chip tone="green">Seguro</Chip>}{it.caution && <Chip tone="amber" dot>Revisa siempre</Chip>}</div>
              <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.5 }}>{it.d}</div>
            </div>
            <Switch on={state[it.id]} onClick={() => set(it.id)} />
          </div>
        ))}
      </div>

      {/* la línea roja: responder por WhatsApp */}
      <div className="card" style={{ marginTop: 16, padding: 20, border: "1.5px solid var(--warm-tint2)", background: "var(--warm-tint)" }}>
        <div className="row" style={{ gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, flex: "none", display: "grid", placeItems: "center", background: "var(--warm)", color: "#fff" }}><Icon name="heart" size={20} /></div>
          <div className="grow">
            <div className="row" style={{ gap: 9 }}><span style={{ fontWeight: 800, fontSize: 15.5 }}>Responder en WhatsApp automáticamente</span><Chip tone="warm" dot>Desactivado a propósito</Chip></div>
            <div style={{ fontSize: 13.5, color: "var(--warm-deep)", marginTop: 4, lineHeight: 1.55 }}>Las personas que te escriben merecen una respuesta humana. Voz <b>nunca</b> contestará por ti. Esta función no existe — y así seguirá.</div>
          </div>
          <div style={{ opacity: .5 }}><Switch on={false} onClick={() => {}} /></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Equipo (simple) ---------------- */
function Equipo() {
  const team = [
    { p: { name: "Carla Vega", color: "var(--blue)", initials: "CV" }, role: "Coordinadora", perm: "Puede crear y aprobar informes" },
    { p: { name: "Carlos Ruiz", color: "#5D7A66", initials: "CR" }, role: "Equipo de campo", perm: "Recoge y etiqueta voces" },
    { p: { name: "Ana Soto", color: "#6B8875", initials: "AS" }, role: "Dirección", perm: "Solo lectura de informes finales" },
  ];
  return (
    <div className="page float-in" style={{ maxWidth: 760 }}>
      <div className="row" style={{ marginBottom: 20 }}><div><h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>Equipo</h2><p style={{ color: "var(--muted)", fontSize: 14.5, margin: "4px 0 0" }}>Cada persona ve solo lo que necesita.</p></div><div className="grow" /><button className="btn btn-primary"><Icon name="plus" size={17} /> Invitar</button></div>
      <div className="card">
        {team.map((m, i) => (
          <div key={i} className="row" style={{ padding: "15px 18px", gap: 13, borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
            <Avatar p={m.p} size={42} />
            <div className="grow"><div style={{ fontWeight: 700, fontSize: 15 }}>{m.p.name}</div><div style={{ fontSize: 13, color: "var(--muted)" }}>{m.perm}</div></div>
            <Chip tone="blue">{m.role}</Chip>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Root ---------------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3f6fb3",
  "warm": "#c97a4e",
  "density": "regular",
  "tone": "calido",
  "showOnboarding": true
}/*EDITMODE-END*/;

const TONE_COPY = {
  calido: { greet: "Buenos días" },
  directo: { greet: "Hola" },
};

function App({ activeProject, setActiveProject }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [onb, setOnb] = aUse(true);
  const [variant, setVariant] = aUse("wizard");
  const [page, setPage] = aUse("inicio");
  const [flow, setFlow] = aUse(false);
  const [menuOpen, setMenuOpen] = aUse(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    const close = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  // aplica tweaks a las variables CSS (los tints se derivan con color-mix)
  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--blue", t.accent);
    r.setProperty("--warm", t.warm);
    r.setProperty("--density", t.density === "compact" ? ".85" : t.density === "comfy" ? "1.15" : "1");
  }, [t.accent, t.warm, t.density]);

  const copy = TONE_COPY[t.tone] || TONE_COPY.calido;
  const showOnb = onb && t.showOnboarding;

  const panel = (
    <TweaksPanel>
      <TweakSection label="Color" />
      <TweakColor label="Azul confianza" value={t.accent} options={["#3f6fb3", "#2f6e8f", "#4a5fb0", "#2f7d6b"]} onChange={v => setTweak("accent", v)} />
      <TweakColor label="Acento cálido (voces)" value={t.warm} options={["#c97a4e", "#cc6a52", "#c98a3a", "#b56a8a"]} onChange={v => setTweak("warm", v)} />
      <TweakSection label="Interfaz" />
      <TweakRadio label="Densidad" value={t.density} options={["compact", "regular", "comfy"]} onChange={v => setTweak("density", v)} />
      <TweakRadio label="Tono de la copy" value={t.tone} options={["calido", "directo"]} onChange={v => setTweak("tone", v)} />
      <TweakSection label="Demo" />
      <TweakToggle label="Mostrar onboarding al abrir" value={t.showOnboarding} onChange={v => { setTweak("showOnboarding", v); setOnb(v); }} />
      <TweakButton label="Ver onboarding otra vez" onClick={() => setOnb(true)} />
    </TweaksPanel>
  );

  if (showOnb) {
    return (<>
      <Onboarding variant={variant} setVariant={setVariant} onFinish={() => setOnb(false)} />
      {panel}
    </>);
  }

  return (
    <div className="app">
      {menuOpen && <button type="button" className={"sidebar-backdrop open"} onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}
      <Sidebar page={page} setPage={(p) => { setFlow(false); setPage(p); }} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="main">
        <div className="mobile-bar">
          <button type="button" className="btn btn-ghost btn-sm mobile-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <Icon name="menu" size={20} />
          </button>
          <div className="mobile-brand"><Icon name="mic" size={18} /></div>
          <span className="mobile-bar-title">Voz</span>
        </div>
        {flow
          ? <ReportFlow onClose={() => setFlow(false)} tone={t} />
          : <>
              {page === "inicio" && <Inicio onNew={() => setFlow(true)} setPage={setPage} copy={copy} />}
              {page === "convos" && <Convos />}
              {page === "importar" && <Importar onGenerate={() => setFlow(true)} goDatos={() => setPage("inicio")} />}
              {page === "informes" && <Informes onNew={() => setFlow(true)} />}
              {page === "datos" && <Analytics activeProject={activeProject} setActiveProject={setActiveProject} setPage={setPage} onNew={() => setFlow(true)} copy={copy} />}
              {page === "autom" && <Automatizaciones />}
              {page === "equipo" && <Equipo />}
            </>}
      </div>
      {panel}
    </div>
  );
}


export default App;
export { DATA };
