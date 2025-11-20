'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Project, Incident } from '@/lib/types';
import { initialIncidents, initialProjects } from '@/lib/data';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layers, CircleDot, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ProjectDetailMap = dynamic(
  () => import('@/components/project-detail-map').then((mod) => mod.ProjectDetailMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }
);

export default function ObraSigPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [bufferRadius, setBufferRadius] = useState<number>(0);
  const [radiusInput, setRadiusInput] = useState<string>('500');
  const [isBufferMode, setIsBufferMode] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null); // No se usa directamente pero es útil para futuras interacciones
  const { toast } = useToast();

  useEffect(() => {
    if (typeof id === 'string') {
      const storedProjects = localStorage.getItem('projects');
      const projects: Project[] = storedProjects ? JSON.parse(storedProjects) : initialProjects;
      const foundProject = projects.find((p) => p.id === id);
      setProject(foundProject || null);
      
      if (foundProject) {
        const storedIncidents = localStorage.getItem('incidents');
        const allIncidents: Incident[] = storedIncidents ? JSON.parse(storedIncidents) : initialIncidents;
        const projectIncidents = allIncidents.filter(inc => inc.project === foundProject.name);
        setIncidents(projectIncidents);
      }
    }
    setLoading(false);
  }, [id]);

  const handleToggleBufferMode = () => {
    const radius = parseInt(radiusInput, 10);
    if (isNaN(radius) || radius <= 0) {
      toast({
        variant: 'destructive',
        title: 'Radio inválido',
        description: 'Por favor, introduce un número positivo para el radio.',
      });
      return;
    }
    setBufferRadius(radius);
    setIsBufferMode(true);
    toast({
      title: 'Modo Buffer Activado',
      description: `Haz clic en el mapa para dibujar un círculo de ${radius}m.`,
    });
  };

  const onBufferDraw = () => {
    setIsBufferMode(false);
    setBufferRadius(0);
  };
  
  const handleClearBuffers = () => {
    if (project?.bufferLayer) {
      project.bufferLayer.clearLayers();
      toast({ title: 'Capa de buffer limpiada' });
    }
  }
  
  if (loading) {
    return <Skeleton className="h-screen w-full" />;
  }

  if (!project) {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-2xl font-bold font-headline">Obra no encontrada</h1>
            <p className="text-muted-foreground">El mapa de la obra que buscas no existe o ha sido eliminada.</p>
            <Button asChild variant="outline">
                <Link href="/obras">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Obras
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="relative h-[calc(100vh-theme(spacing.16))] w-full">
        <div className="leaflet-control-container">
          <div className="leaflet-top leaflet-left">
            <div className="leaflet-control bg-transparent p-0">
               <div className="flex w-[320px] flex-col gap-0 overflow-hidden rounded-md border border-border bg-background/80 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 p-3">
                     <Button asChild variant="outline" size="icon" className="h-9 w-9 shrink-0">
                        <Link href={`/obras/${id}`}>
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold font-headline leading-tight">{project.name}</h1>
                        <p className="text-sm text-muted-foreground">Visualizador SIG</p>
                    </div>
                </div>

                 <Collapsible className="w-full">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between border-t border-border bg-background/50 px-3 py-2 text-left text-sm font-medium hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4"/>
                        Análisis de Proximidad
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform [&[data-state=open]]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-3 border-t border-border p-3">
                      <div>
                        <Label htmlFor="buffer-radius" className="mb-1.5 block text-xs text-muted-foreground">
                            Radio en metros
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input 
                                id="buffer-radius"
                                type="number"
                                placeholder="Radio en metros"
                                value={radiusInput}
                                onChange={(e) => setRadiusInput(e.target.value)}
                                className="h-9"
                            />
                             <span className="text-sm text-muted-foreground">m</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <Button onClick={handleToggleBufferMode} size="sm" className="w-full" disabled={isBufferMode}>
                              <CircleDot className="mr-2 h-4 w-4" />
                              {isBufferMode ? 'Selecciona...' : 'Dibujar'}
                          </Button>
                           <Button onClick={handleClearBuffers} size="sm" variant="destructive" className="w-full">
                              <X className="mr-2 h-4 w-4" />
                              Limpiar
                          </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                 </Collapsible>
              </div>
            </div>
          </div>
        </div>
        <ProjectDetailMap 
            project={project} 
            incidents={incidents} 
            interactive={true} 
            bufferRadius={bufferRadius}
            onBufferDraw={onBufferDraw}
            setMapInstance={setMapInstance}
        />
    </div>
  );
}
