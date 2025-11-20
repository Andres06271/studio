'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderKanban, ArrowRight, FileText } from 'lucide-react';
import { initialDocuments, initialProjects } from '@/lib/data';
import type { Document, Project } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Cargar documentos desde localStorage o usar datos iniciales
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    } else {
      localStorage.setItem('documents', JSON.stringify(initialDocuments));
      setDocuments(initialDocuments);
    }
    
    // Cargar obras desde localStorage o usar datos iniciales
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
    } else {
        localStorage.setItem('projects', JSON.stringify(initialProjects));
        setProjects(initialProjects);
    }
  }, []);
  
  const getDocumentsCountForProject = (projectName: string) => {
    return documents.filter(doc => doc.project === projectName).length;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Documentos por Obra</h1>
        <p className="text-muted-foreground">
          Selecciona una obra para ver y gestionar sus documentos.
        </p>
      </div>
      <Separator />
      
      {projects.length === 0 ? (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No hay obras disponibles. Crea una obra para poder asignarle documentos.
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <CardTitle className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-primary"/>
                            {project.name}
                        </CardTitle>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <FileText className="h-4 w-4"/>
                    <span>{getDocumentsCountForProject(project.name)} Documento(s)</span>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/documentos/${project.id}`}>
                    Gestionar Documentos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
