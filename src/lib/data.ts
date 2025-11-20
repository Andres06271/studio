import type { Project, Incident, Document } from './types';

// Dashboard KPI Data
export const kpiData = [
  { title: 'Obras Activas', value: 8, change: '+2 desde el mes pasado' },
  { title: 'Incidentes Reportados', value: 12, change: '-3 desde la semana pasada' },
  { title: 'Obras en Riesgo', value: 2, change: '+1 esta semana' },
  { title: 'Documentos Cargados', value: 128, change: '+20 este mes' },
];

// Dashboard Chart Data
export const projectProgressData = [
  { zone: 'Norte', progress: 75 },
  { zone: 'Sur', progress: 40 },
  { zone: 'Oriente', progress: 90 },
  { zone: 'Occidente', progress: 60 },
  { zone: 'Centro', progress: 25 },
];

export const incidentTypeData = [
  { type: 'Deslizamiento', count: 45 },
  { type: 'Inundación', count: 25 },
  { type: 'Falla Estructural', count: 15 },
  { type: 'Otro', count: 15 },
];

export const incidentTrendData = [
  { month: 'Ene', incidentes: 12 },
  { month: 'Feb', incidentes: 19 },
  { month: 'Mar', incidentes: 15 },
  { month: 'Abr', incidentes: 25 },
  { month: 'May', incidentes: 21 },
  { month: 'Jun', incidentes: 32 },
];


// Initial Projects Data for localStorage if not present
export const initialProjects: Project[] = [
  {
    id: 'OBRA-001',
    name: 'Viaducto del Suroeste',
    location: 'Antioquia, Colombia',
    status: 'Activo',
    progress: 75,
    manager: 'Ana García',
    startDate: '2023-01-15',
    endDate: '2025-06-30',
    description: 'Construcción de viaducto para conectar municipios del suroeste antioqueño, optimizando el transporte de carga y pasajeros.',
    timeline: [
      { stage: 'Planeación', date: '2023-02-20', completed: true },
      { stage: 'Cimentación', date: '2023-08-15', completed: true },
      { stage: 'Estructura Principal', date: '2024-05-10', completed: true },
      { stage: 'Acabados y Señalización', date: '2025-03-01', completed: false },
      { stage: 'Entrega final', date: '2025-06-30', completed: false },
    ],
    documents: [],
  },
  {
    id: 'OBRA-002',
    name: 'Túnel de Oriente',
    location: 'Antioquia, Colombia',
    status: 'Finalizado',
    progress: 100,
    manager: 'Carlos Ruiz',
    startDate: '2020-03-10',
    endDate: '2023-12-20',
    description: 'Ampliación y modernización del Túnel de Oriente para mejorar el flujo vehicular entre Medellín y el aeropuerto JMC.',
    timeline: [],
    documents: [],
  },
  {
    id: 'OBRA-003',
    name: 'Hidroeléctrica Ituango',
    location: 'Ituango, Colombia',
    status: 'En Riesgo',
    progress: 60,
    manager: 'Sofia Petro',
    startDate: '2018-05-01',
    endDate: '2026-12-31',
    description: 'Proyecto de generación de energía hidroeléctrica de importancia nacional, con complejidades geológicas y sociales.',
    timeline: [],
    documents: [],
  },
  {
    id: 'OBRA-004',
    name: 'Autopista al Mar 2',
    location: 'Urabá, Colombia',
    status: 'Activo',
    progress: 45,
    manager: 'Luis Mendoza',
    startDate: '2022-08-01',
    endDate: '2027-02-28',
    description: 'Construcción de la segunda calzada de la autopista que conecta Medellín con el Urabá antioqueño.',
    timeline: [],
    documents: [],
  },
  {
    id: 'OBRA-005',
    name: 'Puente Pumarejo',
    location: 'Barranquilla, Colombia',
    status: 'Finalizado',
    progress: 100,
    manager: 'Isabela Díaz',
    startDate: '2015-01-01',
    endDate: '2019-12-20',
    description: 'Diseño y construcción del nuevo Puente Pumarejo sobre el Río Magdalena, uno de los más largos de Colombia.',
    timeline: [],
    documents: [],
  },
  {
    id: 'OBRA-006',
    name: 'Metro de Bogotá',
    location: 'Bogotá, Colombia',
    status: 'Pausado',
    progress: 25,
    manager: 'Jorge Valbuena',
    startDate: '2021-10-20',
    endDate: '2028-10-20',
    description: 'Primera línea del metro elevado para la capital de Colombia, un proyecto de infraestructura urbana masiva.',
    timeline: [],
    documents: [],
  },
];

// Incidents Data
export const incidents: Incident[] = [
  {
    id: 'INC-001',
    type: 'Deslizamiento',
    severity: 'Alto',
    date: '2024-05-10',
    description: 'Deslizamiento menor en el talud norte, sin afectar la estructura principal.',
    status: 'En revisión',
    project: 'Viaducto del Suroeste',
  },
  {
    id: 'INC-002',
    type: 'Falla Estructural',
    severity: 'Medio',
    date: '2024-04-22',
    description: 'Fisuras detectadas en viga de soporte secundaria. Requiere inspección urgente.',
    status: 'Reportado',
    project: 'Autopista al Mar 2',
  },
  {
    id: 'INC-003',
    type: 'Inundación',
    severity: 'Bajo',
    date: '2024-03-15',
    description: 'Acumulación de agua en zona de excavación por lluvias atípicas.',
    status: 'Mitigado',
    project: 'Metro de Bogotá',
  },
  {
    id: 'INC-004',
    type: 'Deslizamiento',
    severity: 'Alto',
    date: '2024-06-01',
    description: 'Alerta de posible inestabilidad en ladera cercana a la obra. Se activó plan de contingencia.',
    status: 'Reportado',
    project: 'Hidroeléctrica Ituango',
  },
];

// Documents Data
export const documents: Document[] = [
  {
    id: 'DOC-001',
    name: 'Planos Estructurales v2.pdf',
    description: 'Versión final de los planos estructurales del viaducto.',
    uploader: 'Ana García',
    uploadDate: '2024-03-15',
    url: '#',
  },
  {
    id: 'DOC-002',
    name: 'Estudio de Suelos.pdf',
    description: 'Análisis geotécnico de la zona de cimentación.',
    uploader: 'Geotecnia SAS',
    uploadDate: '2023-05-20',
    url: '#',
  },
  {
    id: 'DOC-003',
    name: 'Licencia Ambiental.pdf',
    description: 'Resolución de la ANLA para la construcción.',
    uploader: 'Gestión Ambiental',
    uploadDate: '2022-11-30',
    url: '#',
  },
  {
    id: 'DOC-004',
    name: 'Minuta Reunión 2024-06-05.docx',
    description: 'Acta de la reunión de seguimiento semanal del proyecto.',
    uploader: 'Carlos Ruiz',
    uploadDate: '2024-06-05',
    url: '#',
  },
];
