'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Project } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const projects: Project[] = JSON.parse(storedProjects);
        const foundProject = projects.find((p) => p.id === id);
        setProject(foundProject || null);
      }
    }
    setLoading(false);
  }, [id]);
  
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
        <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button asChild variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
                <Link href={`/obras/${id}`}>
                    <ArrowLeft />
                </Link>
            </Button>
            <div className="bg-background/80 backdrop-blur-sm rounded-md px-4 py-2">
                <h1 className="text-lg font-bold font-headline">{project.name}</h1>
                <p className="text-sm text-muted-foreground">Visualizador SIG</p>
            </div>
        </div>
      <ProjectDetailMap project={project} interactive={true} />
    </div>
  );
}
