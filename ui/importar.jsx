/* Importar documentos → generar informe → window.Importar */
const { useState: iUse, useRef: iRef } = React;

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

window.Importar = Importar;
