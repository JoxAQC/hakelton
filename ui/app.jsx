/* App shell + páginas + root → monta en #root */
const { useState: aUse } = React;

/* ---------------- Sidebar ---------------- */
function Sidebar({ page, setPage, tone }) {
  const nav = [
    { id: "inicio", icon: "home", label: "Inicio" },
    { id: "convos", icon: "chat", label: "Conversaciones", badge: "5" },
    { id: "importar", icon: "upload", label: "Importar" },
    { id: "informes", icon: "doc", label: "Informes" },
    { id: "datos", icon: "chart", label: "Panel de datos" },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Icon name="mic" size={21} /></div>
        <div><div className="brand-name">Voz</div><div className="brand-sub">Fundación Raíces</div></div>
      </div>
      <div className="nav-label">Trabajo</div>
      {nav.map(n => (
        <button key={n.id} className={"nav-item" + (page === n.id ? " active" : "")} onClick={() => setPage(n.id)}>
          <Icon name={n.icon} size={20} /> {n.label}
          {n.badge && <span className="badge">{n.badge}</span>}
        </button>
      ))}
      <div className="nav-label">Organización</div>
      <button className={"nav-item" + (page === "equipo" ? " active" : "")} onClick={() => setPage("equipo")}><Icon name="users" size={20} /> Equipo</button>
      <button className={"nav-item" + (page === "autom" ? " active" : "")} onClick={() => setPage("autom")}><Icon name="wand" size={20} /> Automatizaciones</button>
      <button className="nav-item"><Icon name="gear" size={20} /> Configuración</button>

      <div className="side-foot">
        <div className="ai-note" style={{ padding: "11px 12px", marginBottom: 12, fontSize: 12.5 }}>
          <span className="ai-ico"><Icon name="shield" size={16} /></span>
          <div>Voz nunca responde ni envía mensajes sin tu aprobación.</div>
        </div>
        <div className="side-user">
          <Avatar p={{ color: "var(--blue)", initials: "CV" }} size={36} />
          <div className="grow"><div className="nm">Carla Vega</div><div className="rl">Coordinadora</div></div>
          <Icon name="gear" size={16} style={{ color: "var(--faint)" }} />
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Inicio ---------------- */
function Inicio({ onNew, setPage, copy }) {
  const stats = [
    { ic: "mic", v: "26", l: "voces esta semana", tone: "warm" },
    { ic: "users", v: "19", l: "personas escuchadas", tone: "blue" },
    { ic: "doc", v: "1", l: "informe en borrador", tone: "blue" },
  ];
  return (
    <div className="page float-in">
      <div className="row" style={{ alignItems: "flex-end", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.025em", margin: 0 }}>{copy.greet}, Carla 👋</h2>
          <p style={{ color: "var(--muted)", fontSize: 15, margin: "4px 0 0" }}>Llegaron 3 voces nuevas hoy. Cuando quieras, las convertimos en un informe.</p>
        </div>
        <div className="grow" />
        <button className="btn btn-primary btn-lg" onClick={onNew}><Icon name="plus" size={18} /> Nuevo informe</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div key={i} className="card card-pad" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, display: "grid", placeItems: "center", background: s.tone === "warm" ? "var(--warm-tint)" : "var(--blue-tint)", color: s.tone === "warm" ? "var(--warm)" : "var(--blue)" }}><Icon name={s.ic} size={23} /></div>
            <div><div style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{s.v}</div><div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{s.l}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>
        {/* voces recientes */}
        <div className="card card-pad">
          <div className="row" style={{ marginBottom: 6 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Voces recientes</h3>
            <div className="grow" />
            <button className="btn btn-soft btn-sm" onClick={() => setPage("convos")}>Ver todas <Icon name="arrow" size={14} /></button>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 6px" }}>Testimonios de la comunidad y reportes del equipo, transcritos automáticamente.</p>
          {[DATA.teamReports[0], ...DATA.transcript].map((t, i) => {
            const p = DATA.people[t.who];
            const isTeam = t.kind === "reporte";
            return (
              <div key={i} className="tline">
                <Avatar p={p} size={40} />
                <div className="grow">
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</span>
                    {isTeam
                      ? <Chip tone="blue"><Icon name="users" size={12} /> Equipo</Chip>
                      : <span style={{ fontSize: 12.5, color: "var(--muted)" }}>· {p.role}</span>}
                    <span className="grow" /><span style={{ fontSize: 12, color: "var(--faint)" }}>{t.at}</span>
                  </div>
                  {isTeam
                    ? <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.55, margin: "5px 0 9px" }}>{t.text}</div>
                    : <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15.5, color: "var(--ink)", lineHeight: 1.5, margin: "5px 0 9px" }}>"{t.text}"</div>}
                  <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                    <VoicePlayer dur={t.dur} color={p.color} />
                    {t.tags.slice(0, 2).map(tag => <Chip key={tag} tone={isTeam ? "" : "blue"}>{tag}</Chip>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* lateral */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card card-pad" style={{ background: "linear-gradient(165deg, var(--blue-tint), oklch(0.96 0.02 252))", border: "1px solid var(--blue-tint2)" }}>
            <div style={{ color: "var(--blue)", marginBottom: 10 }}><Icon name="spark" size={26} /></div>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 6px" }}>Tienes 8 voces sobre salud</h3>
            <p style={{ fontSize: 13.5, color: "var(--blue-ink)", lineHeight: 1.55, margin: "0 0 14px" }}>Suficientes para un informe sólido. Voz prepara un borrador y tú lo revisas, sección por sección.</p>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={onNew}>Crear informe con estas voces</button>
          </div>
          <div className="card card-pad">
            <div className="row" style={{ gap: 9, marginBottom: 10 }}><span style={{ color: "var(--warm)" }}><Icon name="heart" size={20} /></span><h3 style={{ fontSize: 15.5, fontWeight: 800, margin: 0 }}>El toque humano</h3></div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, margin: 0 }}>Voz transcribe y ordena. <b>Decidir qué se cuenta, y cómo, sigue siendo tu trabajo.</b> Por eso cada informe pasa por tus manos antes de salir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Conversaciones ---------------- */
function Convos() {
  const [sel, setSel] = aUse(DATA.conversations[0].id);
  const c = DATA.conversations.find(x => x.id === sel);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "calc(100vh - 70px)" }}>
      <div style={{ borderRight: "1px solid var(--line)", overflowY: "auto", padding: 14 }}>
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
            <div style={{ width: 40, height: 40, borderRadius: 11, flex: "none", display: "grid", placeItems: "center", background: it.caution ? "var(--amber-tint)" : "var(--blue-tint)", color: it.caution ? "oklch(0.6 0.12 75)" : "var(--blue)" }}><Icon name={it.caution ? "spark" : "wand"} size={20} /></div>
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
    { p: { name: "Carlos Ruiz", color: "oklch(0.55 0.1 250)", initials: "CR" }, role: "Equipo de campo", perm: "Recoge y etiqueta voces" },
    { p: { name: "Ana Soto", color: "oklch(0.6 0.13 145)", initials: "AS" }, role: "Dirección", perm: "Solo lectura de informes finales" },
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

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [onb, setOnb] = aUse(true);
  const [variant, setVariant] = aUse("wizard");
  const [page, setPage] = aUse("inicio");
  const [flow, setFlow] = aUse(false);

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
      <Sidebar page={page} setPage={(p) => { setFlow(false); setPage(p); }} tone={t} />
      <div className="main">
        {flow
          ? <ReportFlow onClose={() => setFlow(false)} tone={t} />
          : <>
              {page === "inicio" && <Inicio onNew={() => setFlow(true)} setPage={setPage} copy={copy} />}
              {page === "convos" && <Convos />}
              {page === "importar" && <Importar onGenerate={() => setFlow(true)} goDatos={() => setPage("datos")} />}
              {page === "informes" && <Informes onNew={() => setFlow(true)} />}
              {page === "datos" && <Analytics />}
              {page === "autom" && <Automatizaciones />}
              {page === "equipo" && <Equipo />}
            </>}
      </div>
      {panel}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
