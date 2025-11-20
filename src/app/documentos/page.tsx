'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2, UploadCloud, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { initialDocuments } from '@/lib/data';
import type { Document, Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    } else {
      localStorage.setItem('documents', JSON.stringify(initialDocuments));
      setDocuments(initialDocuments);
    }
    
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
    }
  }, []);

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
    if (!selectedProject) {
        toast({ variant: 'destructive', title: 'Selecciona una obra' });
        return;
    }
    
    const project = projects.find(p => p.id === selectedProject);
    if(!project) return;
    
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
    setSelectedProject('');
    toast({ title: `${files.length} documento(s) subido(s) con éxito.`});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Documentos</h1>
        <p className="text-muted-foreground">
          Gestiona y carga los documentos de tus proyectos.
        </p>
      </div>
      <Separator />
      <Card>
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

              <div className="grid sm:grid-cols-2 gap-4">
                 <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                        <SelectValue placeholder="Asociar a una obra..." />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>

                <Button onClick={handleUpload}>
                  Subir {files.length} archivo(s)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Nombre</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Subido por</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc: Document) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doc.project || 'N/A'}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
