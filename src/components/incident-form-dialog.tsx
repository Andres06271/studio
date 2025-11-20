'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Incident, Project } from '@/lib/types';
import type { DialogProps } from '@radix-ui/react-dialog';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const ProjectMap = dynamic(() => import('./project-map').then((mod) => mod.ProjectMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
});


const incidentFormSchema = z.object({
  type: z.string().min(3, 'El tipo es requerido.'),
  severity: z.enum(['Bajo', 'Medio', 'Alto']),
  project: z.string().min(1, 'La obra es requerida.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

interface IncidentFormDialogProps extends DialogProps {
  onIncidentCreated: (incident: Incident) => void;
}

export function IncidentFormDialog({
  open,
  onOpenChange,
  onIncidentCreated,
}: IncidentFormDialogProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mapKey, setMapKey] = useState(Date.now());
  const { toast } = useToast();

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      type: '',
      severity: 'Bajo',
      project: '',
      description: '',
      latitude: 6.2442,
      longitude: -75.5812,
    },
  });

  const selectedProjectName = form.watch('project');

  useEffect(() => {
    if (open) {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const loadedProjects: Project[] = JSON.parse(storedProjects);
        setProjects(loadedProjects);
        // Set default location to the first project if available
        if (loadedProjects.length > 0) {
          const firstProject = loadedProjects[0];
          form.setValue('latitude', firstProject.latitude || 6.2442);
          form.setValue('longitude', firstProject.longitude || -75.5812);
        }
      }
      setMapKey(Date.now()); // Force map remount
    }
  }, [open, form]);

  useEffect(() => {
      if(selectedProjectName) {
        const project = projects.find(p => p.name === selectedProjectName);
        if (project && project.latitude && project.longitude) {
            form.setValue('latitude', project.latitude);
            form.setValue('longitude', project.longitude);
            setMapKey(Date.now()); // Remount map to center on new coords
        }
      }
  }, [selectedProjectName, projects, form])


  const handleMapClick = (lat: number, lng: number) => {
    form.setValue('latitude', lat, { shouldValidate: true });
    form.setValue('longitude', lng, { shouldValidate: true });
  };

  const onSubmit = (data: IncidentFormValues) => {
    const newIncident: Incident = {
      ...data,
      id: `INC-${Date.now()}`,
      status: 'Reportado',
      date: new Date().toISOString(),
      latitude: data.latitude,
      longitude: data.longitude,
    };
    onIncidentCreated(newIncident);
    toast({
      title: 'Incidente Reportado',
      description: `El incidente de tipo "${data.type}" ha sido reportado exitosamente.`,
    });
    if (onOpenChange) onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Reportar Nuevo Incidente</DialogTitle>
          <DialogDescription>
            Completa la información para registrar un nuevo incidente. Haz clic en el mapa para fijar la ubicación.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Obra Afectada</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una obra" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {projects.map((p) => (
                            <SelectItem key={p.id} value={p.name}>
                            {p.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Incidente</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Deslizamiento, Falla de equipo" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Severidad</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona la severidad" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Bajo">Bajo</SelectItem>
                        <SelectItem value="Medio">Medio</SelectItem>
                        <SelectItem value="Alto">Alto</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Describe el incidente en detalle..."
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {/* Hidden fields for lat/lng */}
                 <FormField control={form.control} name="latitude" render={({ field }) => (<FormItem className="hidden"><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>)} />
                 <FormField control={form.control} name="longitude" render={({ field }) => (<FormItem className="hidden"><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>)} />
             </div>
             <div className="space-y-2 flex flex-col">
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Ubicación del Incidente</FormLabel>
                <div className="h-[400px] w-full rounded-md border overflow-hidden flex-1">
                    {open && (
                      <ProjectMap 
                          key={mapKey}
                          lat={form.watch('latitude') || 6.2442} 
                          lng={form.watch('longitude') || -75.5812} 
                          onMapClick={handleMapClick} 
                      />
                    )}
                </div>
                 <p className="text-xs text-muted-foreground">
                    Haz clic en el mapa para fijar la ubicación del incidente.
                </p>
            </div>
            <DialogFooter className="md:col-span-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Reportar Incidente</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
