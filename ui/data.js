/* Datos mock → window.DATA
   Dos tipos de voz: "testimonio" (comunidad) y "reporte" (equipo / voluntariado). */
window.DATA = (function () {
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
