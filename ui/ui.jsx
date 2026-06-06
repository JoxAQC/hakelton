/* Componentes UI compartidos → window */
const { useState, useEffect, useRef } = React;

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
    <div className="wave" style={color ? { "--warm": color } : null}>
      {heights.map((h, i) => (
        <span key={i} style={{
          height: h,
          opacity: playing ? 0.55 + 0.45 * Math.abs(Math.sin(i)) : 0.8,
          animation: playing ? `vp 0.9s ${i * 0.045}s ease-in-out infinite alternate` : "none",
        }} />
      ))}
    </div>
  );
}

/* ---- Reproductor de nota de voz ---------------------------------- */
function VoicePlayer({ dur = "0:48", color }) {
  const [on, setOn] = useState(false);
  useEffect(() => { if (!on) return; const t = setTimeout(() => setOn(false), 2600); return () => clearTimeout(t); }, [on]);
  return (
    <div className="row" style={{ gap: 11, padding: "8px 12px", background: "var(--warm-tint)", borderRadius: 999, width: "fit-content" }}>
      <button onClick={() => setOn(v => !v)} style={{
        border: "none", background: color || "var(--warm)", color: "#fff",
        width: 30, height: 30, borderRadius: 999, display: "grid", placeItems: "center",
      }}>
        <Icon name={on ? "pause" : "play"} size={15} />
      </button>
      <Wave playing={on} bars={22} color={color} />
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--warm-deep)", fontVariantNumeric: "tabular-nums" }}>{dur}</span>
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

Object.assign(window, { Icon, Avatar, Wave, VoicePlayer, Switch, Chip, AINote });

/* animación de barras */
const __vp = document.createElement("style");
__vp.textContent = "@keyframes vp{from{transform:scaleY(.5)}to{transform:scaleY(1.25)}}";
document.head.appendChild(__vp);
