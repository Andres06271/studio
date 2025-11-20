'use client';

import { useState } from 'react';
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
  DialogTrigger,
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
import { useToast } from '@/hooks/use-toast';
import { MapPin, PlusCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const ProjectMap = dynamic(() => import('./project-map').then((mod) => mod.ProjectMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
});

const projectFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  location: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres.'),
  manager: z.string().min(3, 'El nombre del responsable es requerido.'),
  description: z.string().min(10, 'La descripción es requerida.'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'La fecha de inicio es requerida.',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'La fecha de finalización es requerida.',
  }),
  latitude: z.number(),
  longitude: z.number(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function CreateProjectForm() {
  const [open, setOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const { toast } = useToast();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      location: '',
      manager: '',
      description: '',
      startDate: '',
      endDate: '',
      latitude: 6.2442, // Default to Medellín
      longitude: -75.5812,
    },
  });
  
  const handleMapClick = (lat: number, lng: number) => {
    form.setValue('latitude', lat, { shouldValidate: true });
    form.setValue('longitude', lng, { shouldValidate: true });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Force map to remount when dialog opens
      setMapKey((prev) => prev + 1);
    }
  };

  const onSubmit = (data: ProjectFormValues) => {
    console.log('Nuevo proyecto creado:', data);
    toast({
      title: 'Obra Creada',
      description: `El proyecto "${data.name}" ha sido creado exitosamente.`,
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Nueva Obra
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crear Nueva Obra</DialogTitle>
          <DialogDescription>
            Completa la información para registrar un nuevo proyecto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Proyecto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Viaducto del Suroeste" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación (Texto)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Antioquia, Colombia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Ana García" {...field} />
                    </FormControl>
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
                      <Textarea placeholder="Descripción detallada del proyecto..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inicio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Finalización</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Latitud</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Longitud</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="space-y-2 flex flex-col">
                <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Ubicación en el Mapa</FormLabel>
                <div className="h-[400px] w-full rounded-md border overflow-hidden flex-1">
                    <ProjectMap 
                        key={mapKey}
                        lat={form.watch('latitude')} 
                        lng={form.watch('longitude')} 
                        onMapClick={handleMapClick} 
                    />
                </div>
                 <p className="text-xs text-muted-foreground">
                    Haz clic en el mapa para fijar la ubicación de la obra.
                </p>
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Proyecto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
