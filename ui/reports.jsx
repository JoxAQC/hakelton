/* Flujo de generación de informes (pieza central) → window.ReportFlow */
const { useState: rUse, useEffect: rEff } = React;

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

window.ReportFlow = ReportFlow;

const __sp = document.createElement("style");
__sp.textContent = "@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .7s linear infinite}";
document.head.appendChild(__sp);
