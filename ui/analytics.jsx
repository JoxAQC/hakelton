/* Panel de datos — indicadores demográficos fusionados → window.Analytics */
const { useState: dUse } = React;

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
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, paddingBottom: 20, position: "relative" }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%", alignItems: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--blue-deep)", marginBottom: 4 }}>{d.value}%</div>
            <div style={{ width: "100%", maxWidth: 36, height: `${Math.round(d.value / max * 100)}%`, minHeight: 4, background: "var(--blue)", borderRadius: "6px 6px 2px 2px", opacity: 0.8 }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap" }}>{d.label}</div>
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
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, paddingBottom: 20 }}>
      {data.map((d, i) => {
        const last = i === data.length - 1;
        const h = Math.round(d.v / max * 100);
        return (
          <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%", alignItems: "center" }}>
              {last && <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--warm-deep)", marginBottom: 4 }}>{fmt(d.v * mult)}</div>}
              <div style={{ width: "100%", maxWidth: 32, height: `${h}%`, minHeight: 4, background: last ? "var(--warm)" : "var(--blue-tint2)", borderRadius: "6px 6px 2px 2px" }} />
            </div>
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

  return (
    <div className="page float-in">
      {/* Cabecera */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.025em", margin: "0 0 3px" }}>
            {copy?.greet ?? "Buenos días"}, Carla 👋
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
            Resumen de impacto · <b style={{ color: "var(--ink-soft)" }}>{sc.label}</b>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: 999, padding: 3, border: "1px solid var(--line-soft)" }}>
            {a.scopes.map(s => (
              <button key={s.id} onClick={() => setScope(s.id)} style={{
                border: "none", padding: "6px 14px", borderRadius: 999, fontWeight: 700, fontSize: 13,
                background: scope === s.id ? "#fff" : "transparent",
                color: scope === s.id ? "var(--blue-deep)" : "var(--muted)",
                boxShadow: scope === s.id ? "var(--sh-sm)" : "none",
                transition: "all .15s", cursor: "pointer", fontFamily: "inherit",
              }}>{s.id === "mes" ? "Este mes" : s.id === "tri" ? "Trimestre" : "Este año"}</button>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13 }}><Icon name="down" size={15} /> Exportar</button>
          {onNew && <button className="btn btn-primary" onClick={onNew}><Icon name="plus" size={16} /> Nuevo informe</button>}
        </div>
      </div>

      {/* Fila de métricas clave — 4 tarjetas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { val: fmt(a.base.impacted * mult), label: "Personas alcanzadas", icon: "users", color: "var(--blue)", bg: "var(--blue-tint)" },
          { val: fmt(a.base.voices * mult), label: "Voces recogidas", icon: "mic", color: "var(--warm-deep)", bg: "var(--warm-tint)" },
          { val: fmt(a.base.events * mult), label: "Eventos realizados", icon: "check", color: "var(--green-deep)", bg: "var(--green-tint)" },
          { val: fmt(a.base.docs * mult), label: "Documentos subidos", icon: "doc", color: "var(--ink-soft)", bg: "var(--surface-2)" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "var(--r)", padding: "18px 20px", border: "1px solid var(--line-soft)", boxShadow: "var(--sh-sm)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: m.bg, display: "grid", placeItems: "center", marginBottom: 12, color: m.color }}>
              <Icon name={m.icon} size={18} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.03em", color: "var(--ink)", lineHeight: 1 }}>{m.val}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Fila principal — gráfico + programas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
        {/* Tendencia */}
        <div style={{ background: "#fff", borderRadius: "var(--r)", padding: "20px 22px", border: "1px solid var(--line-soft)", boxShadow: "var(--sh-sm)" }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Tendencia de personas alcanzadas</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>Últimos 6 meses</div>
          <Trend data={a.trend} mult={mult} />
        </div>

        {/* Programas */}
        <div style={{ background: "#fff", borderRadius: "var(--r)", padding: "20px 22px", border: "1px solid var(--line-soft)", boxShadow: "var(--sh-sm)" }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Personas por programa</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>Total {sc.label}</div>
          <ProgBars data={a.programs} mult={mult} />
        </div>
      </div>

      {/* Fila inferior — género + edad + voces recientes */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", gap: 16 }}>
        {/* Género */}
        <div style={{ background: "#fff", borderRadius: "var(--r)", padding: "20px 22px", border: "1px solid var(--line-soft)", boxShadow: "var(--sh-sm)" }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Género</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Autoreportado</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Donut data={a.gender} size={110} thickness={16} />
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 }}>
              {a.gender.map(g => (
                <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: g.color, flex: "none" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", flex: 1 }}>{g.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{g.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edad */}
        <div style={{ background: "#fff", borderRadius: "var(--r)", padding: "20px 22px", border: "1px solid var(--line-soft)", boxShadow: "var(--sh-sm)" }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Rango de edad</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>% de personas alcanzadas</div>
          <AgeBars data={a.age} />
        </div>

        {/* Voces recientes */}
        <div style={{ background: "#fff", borderRadius: "var(--r)", padding: "20px 22px", border: "1px solid var(--line-soft)", boxShadow: "var(--sh-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 15, flex: 1 }}>Voces recientes</div>
            {setPage && (
              <button onClick={() => setPage("convos")} style={{ border: "none", background: "none", color: "var(--blue)", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                Ver todas <Icon name="arrow" size={13} />
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[DATA.teamReports[0], ...DATA.transcript].slice(0, 2).map((t, i) => {
              const p = DATA.people[t.who];
              return (
                <div key={i} style={{ paddingBottom: i === 0 ? 14 : 0, borderBottom: i === 0 ? "1px solid var(--line-soft)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Avatar p={p} size={30} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{t.at}</div>
                    </div>
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.text}</p>
                  <VoicePlayer dur={t.dur} color={p.color} compact />
                </div>
              );
            })}
          </div>
          {onNew && (
            <button onClick={onNew} className="btn btn-primary" style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>
              <Icon name="spark" size={15} /> Crear informe con estas voces
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--faint)" }}>* Las cifras combinan datos exactos y estimaciones del equipo.</div>
    </div>
  );
}

window.Analytics = Analytics;
