-- Migration 00005: Seed Data (Category Metrics, Demo Org, Programs)

-- 1. Insert Category Metric Templates
INSERT INTO category_metric_templates (category_id, label, metrics_json) VALUES
('salud', 'Salud comunitaria', '["Número de personas atendidas (por campaña, por mes)", "Tipo de atención brindada (consulta, derivación, tamizaje)", "Porcentaje de derivaciones completadas vs. iniciadas", "Cobertura geográfica (comunidades, distritos alcanzados)", "Casos con seguimiento activo"]'::jsonb),
('amb', 'Medio ambiente', '["Kilos / toneladas de residuos gestionados", "Número de jornadas realizadas", "Familias o comunidades beneficiadas", "Litros de agua tratada o acceso habilitado", "Voluntarios movilizados por actividad"]'::jsonb),
('edu', 'Educación', '["Número de beneficiarios por programa", "Tasa de asistencia y deserción", "Talleres completados vs. planificados", "Becas otorgadas y seguimiento de beneficiarios", "Avance individual (si hay seguimiento por persona)"]'::jsonb),
('der', 'Derechos', '["Casos acompañados activos vs. cerrados", "Tipo de vulneración más frecuente", "Tiempo promedio de resolución o acompañamiento", "Derivaciones a instancias legales o institucionales", "Porcentaje de casos con resultado documentado"]'::jsonb);

-- 2. Insert Demo Organization: Fundación Raíces (educación)
-- Guardamos el ID en una tabla temporal para usarlo luego si lo corremos en un script, o usamos UUIDs estáticos.
-- Vamos a usar gen_random_uuid(), pero usando DO block o CTEs para referenciar.

DO $$
DECLARE
    v_org_id UUID;
    v_prog1_id UUID;
    v_prog2_id UUID;
    v_prog3_id UUID;
    v_prog4_id UUID;
BEGIN
    INSERT INTO organizations (name, category, description, settings) 
    VALUES (
        'Fundación Raíces', 
        'educacion', 
        'Cerrar la brecha educativa en sectores vulnerables proporcionando infraestructura tecnológica, tutorías académicas y capacitación a docentes.', 
        '{"headquarters": "Lima, Perú", "annual_budget_usd": 450000, "contact_email": "contacto@fundacionraices.org", "highlights": "La Fundación Raíces ha logrado reducir la deserción escolar en un 35% en las comunidades intervenidas durante 2026."}'::jsonb
    ) RETURNING id INTO v_org_id;

    -- Insert Programs
    INSERT INTO programs (org_id, name, description, budget_usd, impact_summary, status, start_date) VALUES 
    (v_org_id, 'Aulas Conectadas', 'Implementación de laboratorios de computación con conexión a internet satelital en escuelas rurales.', 180000, '12 escuelas equipadas y 1,500 estudiantes beneficiados directamente.', 'active', CURRENT_DATE) RETURNING id INTO v_prog1_id;

    INSERT INTO programs (org_id, name, description, budget_usd, impact_summary, status, start_date) VALUES 
    (v_org_id, 'Tutorías Solidarias', 'Programa de acompañamiento académico extraescolar impartido por voluntarios universitarios para evitar la deserción escolar.', 90000, '320 niños y adolescentes recibiendo apoyo semanal en matemáticas y comprensión lectora.', 'active', CURRENT_DATE) RETURNING id INTO v_prog2_id;

    INSERT INTO programs (org_id, name, description, budget_usd, impact_summary, status, start_date) VALUES 
    (v_org_id, 'Formación Docente Integral', 'Talleres de capacitación continua en herramientas pedagógicas digitales para profesores de escuelas públicas.', 70000, '150 docentes certificados en metodologías activas de aprendizaje.', 'completed', CURRENT_DATE - INTERVAL '1 year') RETURNING id INTO v_prog3_id;

    INSERT INTO programs (org_id, name, description, budget_usd, impact_summary, status, start_date) VALUES 
    (v_org_id, 'Becas Futuro', 'Fondo de becas de sostenimiento para estudiantes de secundaria con excelencia académica y bajos recursos económicos.', 110000, '50 estudiantes becados, cubriendo sus gastos de útiles, alimentación y transporte.', 'active', CURRENT_DATE) RETURNING id INTO v_prog4_id;

    -- Update Programs with extra info in an alternative table or just the name for now, 
    -- since programs table doesn't have budget or description yet. (Wait, let's keep them in settings or just name for demo).

    -- Inserción de Actividades (ej. Grupos de WhatsApp mockeados para la Demo).
    -- Esto permite que si leemos `activities` veamos "Equipo de campo", "Don Roberto", etc.
    INSERT INTO activities (org_id, program_id, source, description, raw_data) VALUES 
    (v_org_id, v_prog1_id, 'whatsapp', 'Grupo: Equipo de campo · Voluntariado', '{"kind": "Grupo", "role": "team", "members": 8, "summary": "Reportes de los voluntarios: qué se hizo, qué se desplegó y qué quedó pendiente."}'::jsonb),
    (v_org_id, v_prog1_id, 'whatsapp', 'Grupo: Educación Comunitaria', '{"kind": "Grupo", "role": "community", "members": 14, "summary": "Testimonios sobre las aulas conectadas."}'::jsonb);

END $$;
