/* Onboarding — 3 variaciones comparables → window.Onboarding */
const { useState: oUse } = React;

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

const PROGRAM_METRICS = {
  salud: {
    emoji: "🫀", label: "Salud comunitaria",
    metrics: [
      "Número de personas atendidas (por campaña, por mes)",
      "Tipo de atención brindada (consulta, derivación, tamizaje)",
      "Porcentaje de derivaciones completadas vs. iniciadas",
      "Cobertura geográfica (comunidades, distritos alcanzados)",
      "Casos con seguimiento activo",
    ],
  },
  amb: {
    emoji: "🌿", label: "Medio ambiente",
    metrics: [
      "Kilos / toneladas de residuos gestionados",
      "Número de jornadas realizadas",
      "Familias o comunidades beneficiadas",
      "Litros de agua tratada o acceso habilitado",
      "Voluntarios movilizados por actividad",
    ],
  },
  edu: {
    emoji: "📋", label: "Educación",
    metrics: [
      "Número de beneficiarios por programa",
      "Tasa de asistencia y deserción",
      "Talleres completados vs. planificados",
      "Becas otorgadas y seguimiento de beneficiarios",
      "Avance individual (si hay seguimiento por persona)",
    ],
  },
  der: {
    emoji: "🛡️", label: "Derechos",
    metrics: [
      "Casos acompañados activos vs. cerrados",
      "Tipo de vulneración más frecuente",
      "Tiempo promedio de resolución o acompañamiento",
      "Derivaciones a instancias legales o institucionales",
      "Porcentaje de casos con resultado documentado",
    ],
  },
};

function VariantWizard({ onFinish }) {
  const [step, setStep] = oUse(0);
  const [prog, setProg] = oUse("salud");
  const steps = ["Hola", "Conectar", "Rubro", "Listo"];
  const programs = [
    { id: "salud", icon: "heart", t: "Salud comunitaria", d: "Postas, campañas, acceso a medicinas" },
    { id: "amb", icon: "spark", t: "Medio ambiente", d: "Jornadas de limpieza, agua, residuos" },
    { id: "edu", icon: "doc", t: "Educación", d: "Talleres, escuelas, becas" },
    { id: "der", icon: "shield", t: "Derechos", d: "Acompañamiento legal, denuncias" },
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
            <div><Chip tone="blue" dot>Paso 1 de 3</Chip></div>
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
            <div><Chip tone="blue" dot>Paso 2 de 3</Chip></div>
            <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.02em", margin: "16px 0 0", lineHeight: 1.15 }}>¿Cuál es el rubro de tu organización?</h2>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, marginTop: 10 }}>Selecciona uno. Esto le ayudará a Voz a sugerirte las métricas correctas para tus informes.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {programs.map(p => {
                const on = prog === p.id;
                return (
                  <button key={p.id} onClick={() => setProg(p.id)} style={{
                    textAlign: "left", padding: "12px 14px", borderRadius: "var(--r-sm)",
                    background: on ? "var(--blue-tint)" : "var(--surface)",
                    border: "1.5px solid " + (on ? "var(--blue)" : "var(--line)"),
                    transition: "all .15s", display: "flex", gap: 12, alignItems: "center", cursor: "pointer",
                  }}>
                    {/* Radio dot */}
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%", flex: "none",
                      border: "2px solid " + (on ? "var(--blue)" : "var(--line)"),
                      background: on ? "var(--blue)" : "transparent",
                      display: "grid", placeItems: "center",
                    }}>
                      {on && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                    </span>
                    <span style={{ color: on ? "var(--blue)" : "var(--muted)", flex: "none" }}><Icon name={p.icon} size={17} /></span>
                    <span>
                      <div style={{ fontWeight: 700, fontSize: 14, color: on ? "var(--blue-deep)" : "var(--ink)" }}>{p.t}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{p.d}</div>
                    </span>
                  </button>
                );
              })}
            </div>
          </>}
          {step === 3 && <>
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
            {step < 3
              ? <button className="btn btn-primary btn-lg" onClick={() => setStep(s => s + 1)}>{step === 0 ? "Empezar" : "Continuar"} <Icon name="arrow" size={17} /></button>
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
          {step === 2 && (() => {
            const m = PROGRAM_METRICS[prog];
            return (
              <div style={{ width: "100%", maxWidth: 280 }}>
                <div style={{ background: "#fff", borderRadius: "var(--r)", padding: "20px 22px", boxShadow: "var(--sh)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{m.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--ink)", marginBottom: 12 }}>
                    Métricas que Voz tracked para <span style={{ color: "var(--blue)" }}>{m.label}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {m.metrics.map((metric, i) => (
                      <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--blue)", flex: "none", marginTop: 1 }}><Icon name="check" size={13} /></span>
                        <span style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>{metric}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, padding: "9px 12px", background: "var(--blue-tint)", borderRadius: "var(--r-sm)", fontSize: 11.5, color: "var(--blue-deep)", lineHeight: 1.4 }}>
                    Puedes agregar o quitar métricas en cualquier momento desde la configuración.
                  </div>
                </div>
              </div>
            );
          })()}
          {step === 3 && <div style={{ textAlign: "center" }}>
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

window.Onboarding = Onboarding;
