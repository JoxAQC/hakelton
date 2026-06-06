/* Flujo de generación de informes (pieza central) → window.ReportFlow */
const { useState: rUse, useEffect: rEff } = React;

/* ---- Gráficos SVG simples ---- */
function BarChart({ data, color = "#2563EB", h = 72 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100 / data.length;
  return (
    <svg width="100%" height={h} style={{ display: "block" }}>
      {data.map((d, i) => {
        const barH = Math.max(3, (d.value / max) * (h - 18));
        const x = i * w + w * 0.15;
        const bw = w * 0.7;
        return (
          <g key={i}>
            <rect x={`${x}%`} y={h - 18 - barH} width={`${bw}%`} height={barH}
              fill={color} opacity={0.75} rx={3} />
            <text x={`${x + bw / 2}%`} y={h - 3} textAnchor="middle"
              fontSize={8} fill="#999" fontFamily="inherit">{d.label}</text>
            <text x={`${x + bw / 2}%`} y={h - 20 - barH} textAnchor="middle"
              fontSize={8} fill={color} fontFamily="inherit" fontWeight="700">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments, size = 72 }) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - 9;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let off = -0.25;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const rot = off * 360;
        off += pct;
        return (
          <circle key={i} r={r} cx={cx} cy={cy} fill="none"
            stroke={seg.color} strokeWidth={11}
            strokeDasharray={`${dash} ${circ - dash}`}
            transform={`rotate(${rot} ${cx} ${cy})`} />
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight="800"
        fill="#1A1A1A" fontFamily="inherit">{segments[0]?.value}%</text>
    </svg>
  );
}

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

/* ---------- Paso 0: elegir fuentes + documentos ---------- */
function PickSources({ picked, setPicked, docs, setDocs }) {
  const toggle = (id) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const totalVoices = DATA.conversations.filter(c => picked.includes(c.id)).reduce((a, c) => a + c.voiceNotes, 0);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files || []);
    const newDocs = files.map(f => ({ id: f.name, name: f.name, size: (f.size / 1024).toFixed(0) + " KB", status: "done" }));
    setDocs(d => [...d, ...newDocs]);
  };

  return (
    <div className="float-in" style={{ maxWidth: 800 }}>
      {/* Conversaciones */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 4px" }}>¿De qué voces quieres partir?</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 14.5, margin: "0 0 18px", lineHeight: 1.5 }}>Elige las conversaciones de audio que entrarán en el informe.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DATA.conversations.map(c => {
            const on = picked.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)} style={{
                padding: "14px 16px", display: "flex", gap: 13, alignItems: "center", textAlign: "left",
                border: "1.5px solid " + (on ? "var(--blue)" : "var(--line)"),
                background: on ? "var(--blue-tint)" : "#fff",
                borderRadius: "var(--r)", transition: "all .15s", cursor: "pointer",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (on ? "var(--blue)" : "var(--line)"), background: on ? "var(--blue)" : "transparent", display: "grid", placeItems: "center", flex: "none", color: "#fff" }}>
                  {on && <Icon name="check" size={13} />}
                </div>
                <Avatar p={{ color: c.color, initials: c.initials }} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)", background: "var(--surface-2)", padding: "1px 7px", borderRadius: 999, fontWeight: 600 }}>{c.kind}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.summary}</div>
                </div>
                <div style={{ textAlign: "right", flex: "none" }}>
                  <div style={{ display: "flex", gap: 5, alignItems: "center", color: "var(--warm-deep)", fontWeight: 700, fontSize: 13 }}><Icon name="mic" size={13} /> {c.voiceNotes} voces</div>
                  <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>{c.lastAt}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", color: "var(--ink-soft)", fontSize: 13.5 }}>
          <Icon name="mic" size={15} style={{ color: "var(--warm)" }} />
          <span><b style={{ color: "var(--ink)" }}>{totalVoices} voces</b> de {picked.length} conversación{picked.length !== 1 ? "es" : ""}</span>
        </div>
      </div>

      {/* Documentos adicionales */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Documentos adicionales</h3>
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Opcional</span>
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.5 }}>Sube actas, listas de asistencia, encuestas o cualquier archivo que quieras incluir en el contexto del informe.</p>

        {/* Drop zone */}
        <label onDragOver={e => e.preventDefault()} onDrop={handleFileDrop}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "24px 20px", border: "2px dashed var(--line)", borderRadius: "var(--r)", background: "var(--surface-2)", cursor: "pointer", transition: "border-color .15s", textAlign: "center" }}>
          <input type="file" multiple onChange={handleFileDrop} style={{ display: "none" }} accept=".pdf,.xlsx,.xls,.csv,.docx,.txt" />
          <Icon name="upload" size={28} style={{ color: "var(--muted)" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Arrastra archivos aquí o haz clic para seleccionar</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>PDF, Excel, CSV, Word · Máx 20 MB por archivo</div>
          </div>
        </label>

        {/* Archivos ya subidos (mock inicial + nuevos) */}
        {(docs.length > 0) && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[...DATA.documents, ...docs].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", border: "1px solid var(--line-soft)", borderRadius: "var(--r-sm)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-tint)", display: "grid", placeItems: "center", flex: "none" }}>
                  <Icon name="doc" size={16} style={{ color: "var(--blue)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{d.size} · {d.note || "Listo"}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-deep)", background: "var(--green-tint)", padding: "2px 8px", borderRadius: 999 }}>✓ Listo</span>
              </div>
            ))}
          </div>
        )}
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
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 22px" }}>Eco está preparando un borrador…</h2>
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

/* ---------- Paso 2: WYSIWYG — reporte visual + sidebar de edición ---------- */
function ReportPreview({ blocks, metrics }) {
  const included = blocks.filter(b => b.include);
  const mInc = metrics.filter(m => m.include);
  const hasEst = mInc.some(m => m.kind === "estimated");
  const totalVoices = new Set(included.flatMap(b => b.sources.map(s => s.who))).size;
  const testimBlocks = included.filter(b => b.kindTag === "testimonio");
  const teamBlocks   = included.filter(b => b.kindTag === "reporte");

  return (
    <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--blue)", boxShadow: "var(--sh-lg)", fontSize: 13 }}>

      {/* Encabezado */}
      <div style={{ padding: "22px 24px 18px", background: "var(--blue)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", marginBottom: 5 }}>
          Informe de Impacto · Fundación Raíces
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-.025em", color: "#fff", margin: "0 0 10px", lineHeight: 1.1, textTransform: "uppercase" }}>
          Impacto de la posta médica en Villa El Sol
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.65)", background: "rgba(255,255,255,.12)", padding: "2px 9px", borderRadius: 999 }}>Salud Comunitaria</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.65)", background: "rgba(255,255,255,.12)", padding: "2px 9px", borderRadius: 999 }}>Marzo 2026</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.65)", background: "rgba(255,255,255,.12)", padding: "2px 9px", borderRadius: 999 }}>
            {totalVoices} voces recogidas
          </span>
        </div>
      </div>

      {/* Métricas */}
      {mInc.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(mInc.length, 4)}, 1fr)`, gap: 1, background: "var(--blue)" }}>
          {mInc.slice(0, 4).map((m) => (
            <div key={m.id} style={{ background: "#fff", padding: "14px 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-.03em", color: m.kind === "estimated" ? "var(--warm-deep)" : "var(--blue)", lineHeight: 1 }}>
                {m.value}{m.unit || ""}{m.kind === "estimated" && <span style={{ fontSize: 13, verticalAlign: "super" }}>*</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cuerpo 2 columnas */}
      <div style={{ background: "#fff", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

        {/* Col izquierda */}
        <div style={{ padding: "18px 20px", borderRight: "1px solid var(--line-soft)" }}>
          {testimBlocks.slice(0, 1).map(b => (
            <div key={b.id} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 6 }}>Resumen ejecutivo</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)", marginBottom: 4 }}>{b.heading}</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--ink-soft)", margin: 0 }}>{b.ai}</p>
            </div>
          ))}

          {testimBlocks.flatMap(b => b.sources).length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--warm-deep)", marginBottom: 8 }}>Voces de la comunidad</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {testimBlocks.flatMap(b => b.sources).slice(0, 3).map((s, i) => {
                  const p = DATA.people[s.who];
                  return (
                    <div key={i} style={{ padding: "9px 11px", background: "var(--warm-tint)", borderRadius: "var(--r-sm)", borderLeft: "3px solid var(--warm)" }}>
                      <div style={{ fontStyle: "italic", fontSize: 12, lineHeight: 1.5, color: "var(--ink)", marginBottom: 4 }}>"{s.quote}"</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--warm-deep)" }}>— {p.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Col derecha */}
        <div style={{ padding: "18px 20px" }}>
          {teamBlocks.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 8 }}>Reporte del equipo</div>
              {teamBlocks.map(b => (
                <div key={b.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)", marginBottom: 3 }}>{b.heading}</div>
                  <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--ink-soft)", margin: "0 0 7px" }}>{b.ai}</p>
                  {b.sources.slice(0, 1).map((s, i) => {
                    const p = DATA.people[s.who];
                    return (
                      <div key={i} style={{ padding: "8px 10px", background: "var(--blue-tint)", borderRadius: "var(--r-sm)", borderLeft: "3px solid var(--blue)" }}>
                        <div style={{ fontStyle: "italic", fontSize: 11.5, color: "var(--ink)", marginBottom: 3 }}>"{s.quote}"</div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--blue-deep)" }}>— {p.name}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Gráfico de voces por tema */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 5 }}>Voces por tema</div>
            <BarChart color="var(--blue)" h={60} data={[
              { label: "Acceso", value: 5 }, { label: "Insumos", value: 3 },
              { label: "Horario", value: 4 }, { label: "Equipo", value: 6 },
            ]} />
          </div>

          {/* Demografía */}
          <div style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", display: "flex", gap: 10, alignItems: "center" }}>
            <DonutChart size={56} segments={[
              { value: 58, color: "var(--blue)" },
              { value: 42, color: "var(--warm)" },
            ]} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 5 }}>Género</div>
              {[{ label: "Femenino", v: "58%", c: "var(--blue)" }, { label: "Masculino", v: "42%", c: "var(--warm)" }].map(g => (
                <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, marginBottom: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: g.c }} />
                  <span style={{ color: "var(--ink-soft)" }}>{g.label}</span>
                  <span style={{ fontWeight: 700, color: "var(--ink)", marginLeft: "auto" }}>{g.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pie */}
      <div style={{ background: "var(--blue)", padding: "10px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10.5, color: "rgba(255,255,255,.55)", fontWeight: 600 }}>Fundación Raíces · Generado con Voz</span>
        {hasEst && <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>* Cifra estimada revisada por el equipo</span>}
        <span style={{ fontSize: 10.5, color: "rgba(255,255,255,.55)", fontWeight: 600 }}>Basado en {totalVoices} voces</span>
      </div>
    </div>
  );
}

function ReviewDraft({ blocks, setBlocks, metrics, setMetrics, tone }) {
  const [editing, setEditing] = rUse(null);
  const setInc = (id, v) => setBlocks(b => b.map(x => x.id === id ? { ...x, include: v } : x));
  const setText = (id, txt) => setBlocks(b => b.map(x => x.id === id ? { ...x, ai: txt } : x));
  const setMetVal = (id, v) => setMetrics(m => m.map(x => x.id === id ? { ...x, value: v.replace(/[^0-9.]/g, "") } : x));
  const setMetInc = (id, v) => setMetrics(m => m.map(x => x.id === id ? { ...x, include: v } : x));

  return (
    <div className="float-in" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

      {/* ── Centro: vista previa viva ── */}
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          Vista previa en tiempo real — lo que edites se refleja aquí
        </div>
        <ReportPreview blocks={blocks} metrics={metrics} />
      </div>

      {/* ── Sidebar: controles de edición ── */}
      <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Métricas */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="spark" size={15} style={{ color: "var(--blue)" }} />
            <span style={{ fontWeight: 800, fontSize: 13.5 }}>Métricas</span>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {metrics.map(mt => {
              const est = mt.kind === "estimated";
              return (
                <div key={mt.id} style={{ display: "flex", alignItems: "center", gap: 8, opacity: mt.include ? 1 : .45, padding: "6px 8px", borderRadius: "var(--r-sm)", background: mt.include && est ? "var(--amber-tint)" : "var(--surface-2)" }}>
                  <Switch on={mt.include} warm={est} onClick={() => setMetInc(mt.id, !mt.include)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{mt.label}</div>
                    {est
                      ? <input value={mt.value} onChange={e => setMetVal(mt.id, e.target.value)} inputMode="numeric"
                          style={{ width: "100%", fontSize: 15, fontWeight: 800, border: "none", borderBottom: "1.5px dashed var(--amber)", background: "transparent", color: "var(--warm-deep)", fontFamily: "inherit", outline: "none", padding: 0 }} />
                      : <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{mt.value}{mt.unit || ""}</div>}
                  </div>
                  {est && <Icon name="edit" size={12} style={{ color: "var(--amber)", flex: "none" }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Secciones */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="doc" size={15} style={{ color: "var(--blue)" }} />
            <span style={{ fontWeight: 800, fontSize: 13.5 }}>Secciones</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{blocks.filter(b=>b.include).length}/{blocks.length}</span>
          </div>
          <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {blocks.map(b => (
              <div key={b.id}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 6px", borderRadius: "var(--r-sm)", background: editing === b.id ? "var(--blue-tint)" : "transparent" }}>
                  <Switch on={b.include} onClick={() => setInc(b.id, !b.include)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: b.include ? "var(--ink)" : "var(--muted)", lineHeight: 1.3 }}>{b.heading}</div>
                    {b.flagged && <div style={{ fontSize: 10.5, color: "var(--amber)", fontWeight: 600, marginTop: 2 }}>⚠ Revisar antes de publicar</div>}
                  </div>
                  <button onClick={() => setEditing(editing === b.id ? null : b.id)}
                    style={{ border: "none", background: "none", color: "var(--blue)", cursor: "pointer", padding: 2, flex: "none" }}>
                    <Icon name="edit" size={13} />
                  </button>
                </div>
                {editing === b.id && b.include && (
                  <div style={{ margin: "4px 6px 6px", padding: 8, background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}>
                    <textarea value={b.ai} onChange={e => setText(b.id, e.target.value)}
                      style={{ width: "100%", minHeight: 80, border: "1px solid var(--line)", borderRadius: 6, padding: 8, fontFamily: "inherit", fontSize: 12, lineHeight: 1.5, color: "var(--ink)", resize: "vertical", outline: "none", background: "#fff" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5, padding: "4px 2px", display: "flex", gap: 7, alignItems: "flex-start" }}>
          <Icon name="shield" size={14} style={{ color: "var(--green)", flex: "none", marginTop: 1 }} />
          Nada se publica hasta que tú lo apruebes en el paso siguiente.
        </div>
      </div>
    </div>
  );
}

/* ---------- Paso 3: aprobar y compartir ---------- */
function Share({ blocks, metrics, onClose }) {
  const [approved, setApproved] = rUse(false);
  const handlePDF = () => { window.print(); };
  const included = blocks.filter(b => b.include);
  const mInc = (metrics || []).filter(m => m.include);
  const hasEst = mInc.some(m => m.kind === "estimated");
  const totalVoices = new Set(included.flatMap(b => b.sources.map(s => s.who))).size;

  // Separar bloques por tipo para las secciones del reporte visual
  const testimBlocks = included.filter(b => b.kindTag === "testimonio");
  const teamBlocks   = included.filter(b => b.kindTag === "reporte");
  const otherBlocks  = included.filter(b => b.kindTag !== "testimonio" && b.kindTag !== "reporte");

  // Colores del sistema
  const BG = "var(--blue)";         // sage green — fondo principal
  const CARD = "#ffffff";
  const ACCENT = "var(--warm)";     // tierra cálida — acento

  return (
    <div className="float-in" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 26, alignItems: "start" }}>

      {/* ══════════════ VISTA PREVIA — estilo reporte visual ══════════════ */}
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", background: BG, boxShadow: "var(--sh-lg)" }}>

        {/* ── Encabezado ── */}
        <div style={{ padding: "28px 30px 24px", background: BG }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)", marginBottom: 6 }}>Informe de Impacto · Fundación Raíces</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-.03em", color: "#fff", margin: "0 0 6px", lineHeight: 1.1, textTransform: "uppercase" }}>Impacto de la posta médica en Villa El Sol</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.7)", background: "rgba(255,255,255,.12)", padding: "3px 10px", borderRadius: 999 }}>Salud Comunitaria</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.7)", background: "rgba(255,255,255,.12)", padding: "3px 10px", borderRadius: 999 }}>Marzo 2026</span>
          </div>
        </div>

        {/* ── Fila de métricas clave ── */}
        {mInc.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(mInc.length, 4)}, 1fr)`, gap: 2, margin: "0 2px" }}>
            {mInc.slice(0, 4).map((m, i) => (
              <div key={m.id} style={{ background: CARD, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: m.kind === "estimated" ? "var(--warm-deep)" : BG, lineHeight: 1 }}>
                  {m.value}{m.unit || ""}{m.kind === "estimated" && <span style={{ fontSize: 16, verticalAlign: "super" }}>*</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Cuerpo del informe ── */}
        <div style={{ background: CARD, margin: "2px 2px 0", padding: "22px 26px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Columna izquierda: resumen ejecutivo + voces de comunidad */}
          <div>
            {/* Resumen */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: BG, marginBottom: 8 }}>Resumen ejecutivo</div>
              {testimBlocks.slice(0, 1).map(b => (
                <div key={b.id}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>{b.heading}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-soft)", margin: 0 }}>{b.ai}</p>
                </div>
              ))}
              {testimBlocks.length === 0 && otherBlocks.slice(0,1).map(b => (
                <div key={b.id}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>{b.heading}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-soft)", margin: 0 }}>{b.ai}</p>
                </div>
              ))}
            </div>

            {/* Voces de la comunidad */}
            {testimBlocks.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--warm-deep)", marginBottom: 10 }}>Voces de la comunidad</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {testimBlocks.flatMap(b => b.sources).slice(0, 3).map((s, i) => {
                    const p = DATA.people[s.who];
                    return (
                      <div key={i} style={{ padding: "11px 13px", background: "var(--warm-tint)", borderRadius: "var(--r-sm)", borderLeft: "3px solid var(--warm)" }}>
                        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "var(--ink)", marginBottom: 6 }}>"{s.quote}"</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--warm-deep)" }}>— {p.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: reporte de equipo + lo que falta */}
          <div>
            {/* Reporte del equipo */}
            {teamBlocks.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: BG, marginBottom: 8 }}>Reporte del equipo</div>
                {teamBlocks.map(b => (
                  <div key={b.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>{b.heading}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-soft)", margin: "0 0 8px" }}>{b.ai}</p>
                    {b.sources.slice(0,1).map((s, i) => {
                      const p = DATA.people[s.who];
                      return (
                        <div key={i} style={{ padding: "10px 12px", background: "var(--blue-tint)", borderRadius: "var(--r-sm)", borderLeft: "3px solid var(--blue)" }}>
                          <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5, color: "var(--ink)", marginBottom: 5 }}>"{s.quote}"</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--blue-deep)" }}>— {p.name}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Resto de bloques */}
            {[...testimBlocks.slice(1), ...otherBlocks].slice(0, 2).map(b => (
              <div key={b.id} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink)", marginBottom: 3 }}>{b.heading}</div>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-soft)", margin: 0 }}>{b.ai}</p>
              </div>
            ))}

            {/* Puntos clave */}
            <div style={{ marginTop: 10, padding: "14px 16px", background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>Puntos clave</div>
              <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                <li style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>La cercanía redujo barreras de acceso a la salud.</li>
                <li style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>Faltan insumos y atención los fines de semana.</li>
                <li style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>Equipo atendió ~80 personas en jornada de campo.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Pie ── */}
        <div style={{ background: BG, padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>Fundación Raíces · Generado con Voz</span>
          {hasEst && <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>* Cifra estimada revisada por el equipo</span>}
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>Basado en {totalVoices} voces</span>
        </div>
      </div>

      {/* ══════════════ PANEL APROBAR / COMPARTIR ══════════════ */}
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
            <button className="btn btn-primary" disabled={!approved} onClick={handlePDF}><Icon name="down" size={17} /> Descargar PDF</button>
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
  const [docs, setDocs] = rUse([]);
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

      <div className="page" style={{ maxWidth: step === 3 ? 1180 : step === 2 ? 1100 : 700, margin: "0 auto" }}>
        {step === 0 && <PickSources picked={picked} setPicked={setPicked} docs={docs} setDocs={setDocs} />}
        {step === 1 && <Drafting done={() => setStep(2)} />}
        {step === 2 && <ReviewDraft blocks={blocks} setBlocks={setBlocks} metrics={metrics} setMetrics={setMetrics} tone={tone} />}
        {step === 3 && <Share blocks={blocks} metrics={metrics} onClose={onClose} />}

        {step !== 1 && (
          <div className="row" style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid var(--line)", gap: 12 }}>
            {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(s => s === 2 ? 0 : s - 1)}><Icon name="back" size={16} /> Atrás</button>}
            <div className="grow" />
            {step === 0 && <button className="btn btn-primary btn-lg" disabled={!canNext} onClick={() => setStep(1)}>Preparar borrador con Eco <Icon name="spark" size={16} /></button>}
            {step === 2 && <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Revisar versión final <Icon name="arrow" size={16} /></button>}
            {step === 3 && <button className="btn btn-ghost" onClick={onClose}>Guardar y cerrar</button>}
          </div>
        )}
      </div>
    </div>
  );
}

window.ReportFlow = ReportFlow;

const __sp = document.createElement("style");
__sp.textContent = "@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .7s linear infinite}";
document.head.appendChild(__sp);
