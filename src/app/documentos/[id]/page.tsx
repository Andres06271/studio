'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2, UploadCloud, X, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { initialDocuments } from '@/lib/data';
import type { Document, Project } from '@/lib/types';
import Link from 'next/link';

export default function ProjectDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projectDocuments, setProjectDocuments] = useState<Document[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Cargar todos los documentos y la información del proyecto
  useEffect(() => {
    // Cargar el proyecto específico
    if (typeof id === 'string') {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const projects: Project[] = JSON.parse(storedProjects);
        const foundProject = projects.find((p) => p.id === id);
        setProject(foundProject || null);
      }
    }

    // Cargar todos los documentos
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    } else {
      localStorage.setItem('documents', JSON.stringify(initialDocuments));
      setDocuments(initialDocuments);
    }
  }, [id]);

  // Filtrar documentos cuando el proyecto o los documentos cambien
  useEffect(() => {
    if (project) {
      const filteredDocs = documents.filter(doc => doc.project === project.name);
      setProjectDocuments(filteredDocs);
    }
  }, [project, documents]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles([...files, ...Array.from(selectedFiles)]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (files.length === 0) {
        toast({ variant: 'destructive', title: 'No hay archivos seleccionados' });
        return;
    }
    if (!project) return;
    
    const newDocuments: Document[] = files.map(file => ({
        id: `DOC-${Date.now()}-${Math.random()}`,
        name: file.name,
        description: `Archivo para ${project.name}`,
        uploader: 'Equipo de Ingeniería', // Placeholder user
        uploadDate: new Date().toISOString(),
        url: '#', // Placeholder URL
        project: project.name,
    }));
    
    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    
    setFiles([]);
    toast({ title: `${files.length} documento(s) subido(s) con éxito.`});
  };
  
  const handleDelete = (docId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    toast({ title: `Documento eliminado.`});
  }

  if (!project) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Obra no encontrada</h1>
            <p className="text-muted-foreground">La obra que buscas no existe o ha sido eliminada.</p>
            <Button asChild variant="outline">
                <Link href="/documentos">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Documentos
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/documentos">
                <ArrowLeft />
            </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Documentos de: {project.name}</h1>
            <p className="text-muted-foreground">
            Gestiona y carga los documentos de esta obra.
            </p>
        </div>
      </div>
      <Separator />

      <Card>
        <CardHeader>
            <CardTitle>Cargar Nuevos Documentos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div
            className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
              isDragging ? 'border-primary bg-accent' : 'border-border'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">
              Arrastra y suelta tus archivos aquí
            </p>
            <p className="text-sm text-muted-foreground">o haz clic para seleccionar archivos</p>
            <Button asChild variant="outline" className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">Subir nuevo</label>
            </Button>
            <input id="file-upload" type="file" className="hidden" multiple onChange={(e) => handleFileSelect(e.target.files)} />
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Archivos para subir:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <span className="text-sm font-medium truncate">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUpload}>
                  Subir {files.length} archivo(s) a {project.name}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Documentos de la Obra</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {projectDocuments.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
                No hay documentos para esta obra todavía.
            </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[40%]">Nombre</TableHead>
                    <TableHead>Subido por</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {projectDocuments.map((doc: Document) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="font-medium">{doc.name}</span>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>{doc.uploader}</TableCell>
                    <TableCell>{format(new Date(doc.uploadDate), 'dd MMM, yyyy')}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Descargar</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(doc.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
