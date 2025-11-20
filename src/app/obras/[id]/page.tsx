'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Project } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MapPin, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ProjectDetailMap = dynamic(
  () => import('@/components/project-detail-map').then((mod) => mod.ProjectDetailMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }
);

export default function ObraDetailPage() {
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

  const getStatusBadgeClass = (status: Project['status']) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'En Riesgo':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'Pausado':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300 border-gray-300 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return <p>Obra no encontrada.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link href="/obras">
                    <ArrowLeft />
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">{project.name}</h1>
                <p className="text-muted-foreground">{project.location}</p>
            </div>
        </div>
        <Button asChild>
            <Link href={`/obras/${project.id}/sig`}>
                <ExternalLink className="mr-2 h-4 w-4"/>
                Ver en Mapa SIG
            </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn('font-normal', getStatusBadgeClass(project.status))}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Responsable: <span className="font-medium text-foreground">{project.manager}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                   <span>
                    {format(new Date(project.startDate), 'dd MMM, yyyy', {locale: es})} - {format(new Date(project.endDate), 'dd MMM, yyyy', {locale: es})}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Progreso de la Obra</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-4">
                  <Progress value={project.progress} className="h-3" />
                  <span className="text-lg font-bold text-foreground">{project.progress}%</span>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-0 rounded-b-lg overflow-hidden">
              {project && (
                <ProjectDetailMap project={project} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
