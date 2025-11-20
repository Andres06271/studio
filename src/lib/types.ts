export type Document = {
  id: string;
  name: string;
  description: string;
  uploader: string;
  uploadDate: string;
  url: string;
};

export type ProjectTimelineStage = {
  stage: string;
  date: string;
  completed: boolean;
};

export type Project = {
  id: string;
  name: string;
  location: string;
  status: 'Activo' | 'Pausado' | 'Finalizado' | 'En Riesgo';
  progress: number;
  manager: string;
  startDate: string;
  endDate: string;
  description: string;
  timeline: ProjectTimelineStage[];
  documents: Document[];
  latitude?: number;
  longitude?: number;
};

export type Incident = {
  id: string;
  type: string;
  severity: 'Alto' | 'Medio' | 'Bajo';
  date: string;
  description: string;
  status: 'Reportado' | 'En revisión' | 'Mitigado';
  project: string;
};
