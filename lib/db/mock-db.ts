export const mockOrganizations = [
  {
    id: "org_1",
    name: "Fundación Raíces",
    category: "Desarrollo Social",
    description: "Organización dedicada al desarrollo integral de comunidades vulnerables.",
    settings: {
      annual_budget_usd: 120000,
      headquarters: "Lima, Perú",
      contact_email: "contacto@fundacionraices.org",
      highlights: "Más de 10 años trabajando en educación y salud comunitaria."
    },
    programs: [
      {
        id: "aulas",
        name: "Aulas Conectadas",
        description: "Equipamiento de aulas rurales con tecnología e internet.",
        status: "Activo",
        budget_usd: 35000,
        impact_summary: "Acceso a la tecnología para 480 estudiantes.",
        settings: {
          impacted: 480,
          voices: 48,
          events: 3,
          docs: 4
        }
      },
      {
        id: "tutorias",
        name: "Tutorías Solidarias",
        description: "Acompañamiento académico fuera del horario escolar.",
        status: "Activo",
        budget_usd: 25000,
        impact_summary: "Acompañamiento a 340 niños con riesgo de deserción.",
        settings: {
          impacted: 340,
          voices: 36,
          events: 2,
          docs: 3
        }
      },
      {
        id: "formacion",
        name: "Formación Docente Integral",
        description: "Capacitación continua para maestros de zonas vulnerables.",
        status: "Activo",
        budget_usd: 40000,
        impact_summary: "260 docentes capacitados en nuevas metodologías.",
        settings: {
          impacted: 260,
          voices: 32,
          events: 2,
          docs: 2
        }
      },
      {
        id: "becas",
        name: "Becas Futuro",
        description: "Apoyo económico para estudiantes universitarios destacados.",
        status: "En riesgo",
        budget_usd: 20000,
        impact_summary: "160 becas otorgadas a jóvenes universitarios.",
        settings: {
          impacted: 160,
          voices: 26,
          events: 1,
          docs: 2
        }
      }
    ]
  }
];

// Helper to simulate fetching from Supabase
export const fetchMockOrgs = async () => {
  return mockOrganizations;
};
