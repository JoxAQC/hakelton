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

window.Analytics = Analytics;
