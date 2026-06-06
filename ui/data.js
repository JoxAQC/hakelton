/* Datos mock → window.DATA
   Dos tipos de voz: "testimonio" (comunidad) y "reporte" (equipo / voluntariado). */
import { supabase } from "../lib/supabase/client";
window.DATA = (function () {
  const people = {
    // Comunidad
    maria:   { id: "maria",   name: "María Elena Quispe",   role: "Vecina · Programa de salud", color: "#2563EB", initials: "MQ" },
    roberto: { id: "roberto", name: "Don Roberto Mamani",   role: "Dirigente comunal",          color: "#7C3AED", initials: "RM" },
    luz:     { id: "luz",     name: "Luz Carrasco",          role: "Madre · Comedor popular",    color: "#0891B2", initials: "LC" },
    jowel:   { id: "jowel",   name: "Jowel Andrade",         role: "Joven · Taller ambiental",   color: "#0369A1", initials: "JA" },
    // Equipo / voluntariado
    carlosH: { id: "carlosH", name: "Carlos Huamán",         role: "Voluntario · Equipo de campo", color: "#1D4ED8", initials: "CH", team: true },
    anaR:    { id: "anaR",    name: "Ana Rivas",             role: "Coordinadora de jornada",      color: "#0369A1", initials: "AR", team: true },
  };

  // Conversaciones de WhatsApp conectadas
  const conversations = [
    {
      id: "equipo", name: "Equipo de campo · Voluntariado", kind: "Grupo", role: "team",
      members: 8, color: "#1D4ED8", initials: "EC",
      lastAt: "hace 30 min", unread: 2, voiceNotes: 6,
      summary: "Reportes de los voluntarios: qué se hizo, qué se desplegó y qué quedó pendiente.",
    },
    {
      id: "salud", name: "Salud Comunitaria — Villa El Sol", kind: "Grupo", role: "community",
      members: 14, color: "#2563EB", initials: "SC",
      lastAt: "hace 12 min", unread: 3, voiceNotes: 8,
      summary: "Testimonios sobre la nueva posta médica y acceso a medicinas.",
    },
    {
      id: "ambiente", name: "Jóvenes por el río", kind: "Grupo", role: "community",
      members: 21, color: "#0369A1", initials: "JR",
      lastAt: "ayer", unread: 0, voiceNotes: 11,
      summary: "Jornada de limpieza y voces sobre la contaminación del río.",
    },
    {
      id: "roberto", name: "Don Roberto Mamani", kind: "Directo", role: "community",
      members: 1, color: "#7C3AED", initials: "RM",
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
    { id: "r1", title: "Impacto de la posta médica — Marzo 2026", program: "Salud Comunitaria", status: "Borrador en revisión", voices: 8, updated: "hoy", color: "#2563EB", impact: 120, impactLabel: "personas impactadas" },
    { id: "r2", title: "Resultados jornada de limpieza del río", program: "Medio Ambiente", status: "Aprobado", voices: 11, updated: "hace 4 días", color: "#0EA5E9", impact: 340, impactLabel: "kg de residuos retirados" },
    { id: "r3", title: "Comedor Las Manitos — Reporte trimestral", program: "Seguridad alimentaria", status: "Aprobado", voices: 6, updated: "hace 2 sem", color: "#0369A1", impact: 85, impactLabel: "familias atendidas" },
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
      { label: "Femenino", value: 58, color: "#2563EB" },
      { label: "Masculino", value: 39, color: "#0EA5E9" },
      { label: "Otro / NS", value: 3, color: "#CBD5E1" },
    ],
    age: [
      { label: "0–12", value: 14 }, { label: "13–17", value: 12 }, { label: "18–29", value: 26 },
      { label: "30–44", value: 23 }, { label: "45–64", value: 17 }, { label: "65+", value: 8 },
    ],
    programs: [
      { name: "Salud comunitaria", value: 480, color: "#2563EB" },
      { name: "Medio ambiente", value: 340, color: "#0EA5E9" },
      { name: "Educación", value: 260, color: "#7C3AED" },
      { name: "Seguridad alimentaria", value: 160, color: "#0369A1" },
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

  // Audios agrupados por proyecto (para la vista de bandeja de Informes)
  const projects = [
    { id: "salud",     label: "Salud Comunitaria",    color: "#2563EB", count: 4 },
    { id: "ambiente",  label: "Medio Ambiente",        color: "#0EA5E9", count: 3 },
    { id: "alimenta",  label: "Seguridad Alimentaria", color: "#0369A1", count: 2 },
    { id: "educacion", label: "Educación",             color: "#7C3AED", count: 1 },
  ];

  const audioInbox = [
    // --- Salud Comunitaria ---
    { id: "a1", project: "salud", who: "maria",   at: "Hoy · 09:14", dur: "0:48", unread: true,
      subject: "Testimonio: acceso a la posta",
      preview: "Desde que abrieron la posta, ya no tengo que viajar dos horas…",
      text: "Buenos días señorita. Le quería contar que desde que abrieron la posta, ya no tengo que viajar dos horas hasta el hospital. Mi hija pudo vacunarse aquí mismo. Pero todavía faltan medicinas, a veces vamos y no hay nada.",
      tags: ["acceso a salud", "vacunación", "falta de insumos"] },
    { id: "a2", project: "salud", who: "roberto", at: "Hoy · 09:31", dur: "1:12", unread: true,
      subject: "Demanda: atención de fin de semana",
      preview: "Como dirigente le digo: la comunidad está agradecida pero necesitamos…",
      text: "Como dirigente le digo: la comunidad está agradecida pero necesitamos que el puesto tenga atención los fines de semana. La gente se enferma cualquier día, no solo de lunes a viernes.",
      tags: ["horario de atención", "demanda comunal"] },
    { id: "a3", project: "salud", who: "luz",     at: "Hoy · 10:02", dur: "0:35", unread: false,
      subject: "Impacto económico en las familias",
      preview: "Yo soy mamá de tres. Antes gastaba en pasajes lo que no tenía…",
      text: "Yo soy mamá de tres. Antes gastaba en pasajes lo que no tenía. Ahora camino diez minutos. Eso para nosotras es muchísimo, de verdad.",
      tags: ["impacto económico", "cercanía"] },
    { id: "a4", project: "salud", who: "carlosH", at: "Ayer · 08:50", dur: "1:05", unread: false,
      subject: "Reporte de campo: jornada de salud",
      preview: "Cerramos la jornada de salud en Villa El Sol. Atendimos unas 80 personas…",
      text: "Listo compañeros, cerramos la jornada de salud en Villa El Sol. Atendimos a unas 80 personas y desplegamos dos carpas de triaje, con apoyo de una enfermera de la posta. Lo que no pudimos hacer fue la toma de presión: no llegó el tensiómetro, lo dejamos pendiente para la próxima.",
      tags: ["jornada de salud", "80 atendidos", "pendiente: tensiómetro"] },

    // --- Medio Ambiente ---
    { id: "a5", project: "ambiente", who: "jowel", at: "Hoy · 11:20", dur: "0:52", unread: true,
      subject: "Contaminación del río: voz de joven",
      preview: "El río está muy mal, señorita. Ya no se puede pescar como antes…",
      text: "El río está muy mal, señorita. Ya no se puede pescar como antes. Los jóvenes de aquí crecimos bañándonos ahí y ahora da miedo entrar. Queremos que alguien haga algo de verdad.",
      tags: ["contaminación", "juventud", "pesca"] },
    { id: "a6", project: "ambiente", who: "anaR", at: "Ayer · 16:05", dur: "0:52", unread: false,
      subject: "Reporte: taller ambiental con jóvenes",
      preview: "El taller ambiental salió bien, vinieron 25 jóvenes y recogimos…",
      text: "El taller ambiental salió bien, vinieron 25 jóvenes y recogimos como 12 sacos de basura del río. Faltaron guantes para todos, anótenlo para la próxima compra.",
      tags: ["taller ambiental", "25 participantes", "faltaron guantes"] },
    { id: "a7", project: "ambiente", who: "roberto", at: "Hace 3 días", dur: "0:40", unread: false,
      subject: "Acuerdo con el municipio sobre el río",
      preview: "Estuvimos reunidos con el municipio y prometieron revisar las empresas…",
      text: "Estuvimos reunidos con el municipio y prometieron revisar las empresas que están tirando residuos al río. Quedamos en un seguimiento para el próximo mes. Hay buena voluntad pero necesitamos ver hechos.",
      tags: ["municipio", "empresas", "seguimiento"] },

    // --- Seguridad Alimentaria ---
    { id: "a8", project: "alimenta", who: "luz", at: "Hace 2 días · 14:30", dur: "0:44", unread: true,
      subject: "Comedor popular: situación de insumos",
      preview: "Ayer nos quedamos sin aceite y sin harina. Las donaciones bajaron mucho…",
      text: "Ayer nos quedamos sin aceite y sin harina. Las donaciones bajaron mucho este mes. Seguimos atendiendo a 85 familias pero necesitamos apoyo urgente en insumos básicos.",
      tags: ["comedor", "insumos", "urgente"] },
    { id: "a9", project: "alimenta", who: "maria", at: "Hace 1 sem", dur: "0:30", unread: false,
      subject: "Familias nuevas que se suman al comedor",
      preview: "Han llegado cuatro familias nuevas del asentamiento de arriba…",
      text: "Han llegado cuatro familias nuevas del asentamiento de arriba. Tienen niños pequeños. Les estamos dando un lugar pero ya estamos al límite de capacidad.",
      tags: ["nuevas familias", "capacidad", "niños"] },

    // --- Educación ---
    { id: "a10", project: "educacion", who: "carlosH", at: "Hace 5 días", dur: "1:00", unread: false,
      subject: "Reporte: talleres de refuerzo escolar",
      preview: "Los talleres de refuerzo van bien. Tenemos 18 niños inscritos esta semana…",
      text: "Los talleres de refuerzo van bien. Tenemos 18 niños inscritos esta semana, subió desde 12. Los profes voluntarios están comprometidos. Solo falta conseguir más cuadernos y lápices para los que no tienen.",
      tags: ["refuerzo escolar", "18 niños", "materiales"] },
  ];

  return { people, conversations, transcript, teamReports, reports, draftBlocks, analytics, documents, projects, audioInbox };
})();

export async function loadSupabaseData() {
  try {
    const { data: org } = await supabase
      .from("organizations")
      .select("*, programs(*)")
      .eq("name", "Fundación Raíces")
      .single();

    if (org && org.programs) {
      window.DATA.orgCategory = org.category;
      window.DATA.projects = org.programs.map((p, i) => ({
        id: p.id,
        label: p.name,
        color: ["#6B8875", "#4A6352", "#7A9480", "#8B7355"][i % 4],
        count: Math.floor(Math.random() * 5) + 1
      }));
    }
  } catch (error) {
    console.error("Error loading data from Supabase:", error);
  }
}
