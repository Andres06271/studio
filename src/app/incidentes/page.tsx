'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { initialIncidents } from '@/lib/data';
import type { Incident } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle } from 'lucide-react';
import { IncidentFormDialog } from '@/components/incident-form-dialog';

type FilterStatus = 'Todos' | 'Reportado' | 'En revisión' | 'Mitigado';

export default function IncidentsPage() {
  const [filter, setFilter] = useState<FilterStatus>('Todos');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      setIncidents(JSON.parse(storedIncidents));
    } else {
      localStorage.setItem('incidents', JSON.stringify(initialIncidents));
      setIncidents(initialIncidents);
    }
  }, []);

  const handleIncidentCreated = (newIncident: Incident) => {
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    localStorage.setItem('incidents', JSON.stringify(updatedIncidents));
  };

  const filteredIncidents =
    filter === 'Todos'
      ? incidents
      : incidents.filter((incident) => incident.status === filter);

  const getSeverityBadge = (severity: Incident['severity']) => {
    return {
      'Alto': 'bg-red-500 text-white',
      'Medio': 'bg-orange-400 text-white',
      'Bajo': 'bg-green-500 text-white',
    }[severity];
  };

  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'Reportado':
        return 'default';
      case 'En revisión':
        return 'secondary';
      case 'Mitigado':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold font-headline">Incidentes</h1>
            <p className="text-muted-foreground">
            Visualiza y gestiona los incidentes reportados.
            </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Reportar Nuevo Incidente
        </Button>
      </div>
      
      <IncidentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onIncidentCreated={handleIncidentCreated}
      />

      <Separator />

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filtrar por estado:</span>
        {(['Todos', 'Reportado', 'En revisión', 'Mitigado'] as FilterStatus[]).map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          )
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIncidents.map((incident: Incident) => (
          <Card key={incident.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">
                  {incident.type}
                </CardTitle>
                <Badge className={cn('whitespace-nowrap', getSeverityBadge(incident.severity))}>
                  {incident.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground pt-1">
                Obra: {incident.project}
              </p>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-sm text-muted-foreground mb-4">
                {incident.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Badge variant={getStatusBadge(incident.status)}>
                  {incident.status}
                </Badge>
                <time dateTime={incident.date}>
                  {format(parseISO(incident.date), 'dd MMM yyyy', { locale: es })}
                </time>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredIncidents.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground py-10">
                No hay incidentes que coincidan con el filtro seleccionado.
            </div>
        )}
      </div>
    </div>
  );
}
