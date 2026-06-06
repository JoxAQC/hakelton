/* App shell + páginas + root → monta en #root */
const { useState: aUse } = React;

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

/* ---------------- Conversaciones (bandeja estilo inbox) ---------------- */
function Convos({ onNew }) {
  const [activeProject, setActiveProject] = aUse("todos");
  const [sel, setSel] = aUse(DATA.audioInbox[0].id);
  const [note, setNote] = aUse("");

  const audio = DATA.audioInbox.find(a => a.id === sel) || DATA.audioInbox[0];
  const person = audio ? DATA.people[audio.who] : null;
  const project = audio ? DATA.projects.find(p => p.id === audio.project) : null;
  const unreadTotal = DATA.audioInbox.filter(a => a.unread).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr", height: "100%", overflow: "hidden" }}>

      {/* ---- Col 1: proyectos / labels ---- */}
      <div style={{ borderRight: "1px solid var(--line-soft)", padding: "20px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        <button className="btn btn-primary btn-lg" onClick={onNew} style={{ marginBottom: 18, width: "100%", justifyContent: "center" }}>
          <Icon name="plus" size={16} /> Nuevo informe
        </button>

        {[
          { id: "todos", label: "Todos los audios", icon: "mic", badge: unreadTotal },
          { id: "starred", label: "Destacados", icon: "star" },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveProject(item.id)}
            className="nav-item"
            style={{ background: activeProject === item.id ? "var(--blue-tint)" : "transparent", color: activeProject === item.id ? "var(--blue-deep)" : "var(--ink-soft)", fontWeight: activeProject === item.id ? 700 : 600, borderRadius: "var(--r-sm)", padding: "9px 12px" }}>
            <Icon name={item.icon} size={17} />
            <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
            {item.badge > 0 && <span className="badge" style={{ background: "var(--blue)", color: "#fff" }}>{item.badge}</span>}
          </button>
        ))}

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", padding: "16px 12px 6px" }}>Proyecto</div>
        {DATA.projects.map(proj => {
          const cnt = DATA.audioInbox.filter(a => a.project === proj.id && a.unread).length;
          const isActive = activeProject === proj.id;
          return (
            <button key={proj.id} onClick={() => setActiveProject(proj.id)}
              className="nav-item"
              style={{ background: isActive ? "var(--blue-tint)" : "transparent", color: isActive ? "var(--blue-deep)" : "var(--ink-soft)", fontWeight: isActive ? 700 : 600, borderRadius: "var(--r-sm)", padding: "9px 12px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: proj.color, flex: "none" }} />
              <span style={{ flex: 1, textAlign: "left", fontSize: 13.5 }}>{proj.label}</span>
              {cnt > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{cnt}</span>}
            </button>
          );
        })}
      </div>

      {/* ---- Col 2: lista de audios ---- */}
      <div style={{ borderRight: "1px solid var(--line-soft)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--line-soft)", position: "sticky", top: 0, background: "var(--paper)", zIndex: 2 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: 10, color: "var(--faint)" }}><Icon name="search" size={16} /></span>
            <input placeholder="Buscar audios…" style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface-2)", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
          </div>
        </div>

        {(activeProject === "todos" || activeProject === "starred"
          ? DATA.projects
          : DATA.projects.filter(p => p.id === activeProject)
        ).map(proj => {
          const items = DATA.audioInbox.filter(a => a.project === proj.id);
          if (!items.length) return null;
          return (
            <div key={proj.id}>
              <div style={{ padding: "10px 16px 6px", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: proj.color, borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: proj.color }} />
                {proj.label}
              </div>
              {items.map(a => {
                const p = DATA.people[a.who];
                const isSel = sel === a.id;
                return (
                  <button key={a.id} onClick={() => setSel(a.id)}
                    style={{ width: "100%", textAlign: "left", padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", border: "none", borderBottom: "1px solid var(--line-soft)", background: isSel ? "var(--blue-tint)" : "transparent", cursor: "pointer", transition: "background .12s" }}>
                    <Avatar p={p} size={38} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: a.unread ? 800 : 600, fontSize: 14, color: "var(--ink)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                        <span style={{ fontSize: 11.5, color: "var(--faint)", flex: "none" }}>{a.at}</span>
                      </div>
                      <div style={{ fontWeight: a.unread ? 700 : 500, fontSize: 13.5, color: "var(--ink)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.subject}</div>
                      <div className="row" style={{ gap: 6 }}>
                        <span style={{ color: "var(--warm-deep)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><Icon name="mic" size={12} /> {a.dur}</span>
                        <span style={{ fontSize: 12, color: "var(--faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{a.preview}</span>
                      </div>
                    </div>
                    {a.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", flex: "none", marginTop: 6 }} />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ---- Col 3: detalle del audio ---- */}
      <div style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {audio && person ? (
          <>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line-soft)", display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar p={person} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15.5 }}>{person.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{person.role}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--faint)" }}>{audio.at}</div>
              <button className="btn btn-ghost btn-sm" onClick={onNew}><Icon name="doc" size={14} /> Usar en informe</button>
            </div>

            <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>
              {project && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: project.color, padding: "3px 10px", background: project.color + "18", borderRadius: 999 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: project.color }} />
                    {project.label}
                  </span>
                </div>
              )}
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 18px", letterSpacing: "-.02em" }}>{audio.subject}</h2>
              <div style={{ marginBottom: 20 }}>
                <VoicePlayer dur={audio.dur} color={person.color} />
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink)", marginBottom: 18 }}>{audio.text}</div>
              <div className="row" style={{ gap: 7, flexWrap: "wrap" }}>
                {audio.tags.map(tag => <Chip key={tag} tone="blue">{tag}</Chip>)}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--line-soft)", padding: "16px 24px", background: "var(--surface)" }}>
              <div style={{ borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px 4px", fontSize: 13, color: "var(--muted)", borderBottom: "1px solid var(--line-soft)" }}>
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>Nota interna</span> · visible solo para tu equipo
                </div>
                <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--line-soft)", display: "flex", gap: 8 }}>
                  {["B", "I", "U"].map(f => (
                    <button key={f} style={{ border: "none", background: "none", fontWeight: 700, fontSize: 13, color: "var(--ink-soft)", cursor: "pointer", padding: "2px 6px", borderRadius: 4 }}>{f}</button>
                  ))}
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Escribe una nota sobre este audio…"
                  style={{ width: "100%", minHeight: 90, border: "none", outline: "none", padding: "12px 16px", fontFamily: "inherit", fontSize: 14, lineHeight: 1.6, resize: "none", color: "var(--ink)", background: "transparent" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <button className="btn btn-ghost btn-sm" onClick={onNew}><Icon name="spark" size={15} /> Crear informe con este audio</button>
                <button className="btn btn-primary" disabled={!note.trim()}><Icon name="check" size={15} /> Guardar nota</button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "grid", placeItems: "center", color: "var(--faint)", fontSize: 14 }}>
            Selecciona un audio para ver el detalle
          </div>
        )}
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

function App() {
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
              {page === "convos" && <div style={{ height: "100vh", overflow: "hidden" }}><Convos onNew={() => setFlow(true)} /></div>}
              {page === "importar" && <Importar onGenerate={() => setFlow(true)} goDatos={() => setPage("inicio")} />}
              {page === "informes" && <Informes onNew={() => setFlow(true)} />}
              {page === "autom" && <Automatizaciones />}
              {page === "equipo" && <Equipo />}
            </>}
      </div>
      {panel}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
