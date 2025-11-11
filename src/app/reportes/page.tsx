'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, SlidersHorizontal } from 'lucide-react';
import { incidentTrendData, projectProgressData, incidentTypeData, incidents } from '@/lib/data';
import { toCsv, downloadFile } from '@/lib/report-utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell } from "recharts"
import { PieChart as RechartsPieChart } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

const lineChartConfig = {
  incidentes: {
    label: "Incidentes Reportados",
    color: "hsl(var(--primary))",
  },
}

const barChartConfig = {
  progress: { label: "Avance", color: "hsl(var(--chart-1))" },
};

const pieChartConfig: Record<string, { label: string; color?: string }> = {
  incidents: { label: "Incidentes" },
  'Deslizamiento': { label: "Deslizamiento", color: "hsl(var(--chart-1))" },
  'Inundación': { label: "Inundación", color: "hsl(var(--chart-2))" },
  'Falla Estructural': { label: "Falla Estructural", color: "hsl(var(--chart-3))" },
  'Otro': { label: "Otro", color: "hsl(var(--chart-4))" },
}

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">
            Analiza los datos y exporta reportes personalizados.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
                // quick printable view can be implemented later — for now keep print action simple
                // open print dialog (user can save as PDF)
                if (typeof window !== 'undefined') {
                  window.print()
                }
            }}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => {
                // Client-side CSV export (quick-win)
                try {
                  const columns = [
                    { key: 'id', label: 'ID' },
                    { key: 'type', label: 'Tipo' },
                    { key: 'severity', label: 'Severidad' },
                    { key: 'date', label: 'Fecha' },
                    { key: 'description', label: 'Descripción' },
                    { key: 'status', label: 'Estado' },
                    { key: 'project', label: 'Proyecto' },
                  ]

                  // Apply current filters before exporting
                  const filtered = (incidents as any[]).filter((i) => {
                    if (projectFilter && projectFilter !== 'all' && i.project !== projectFilter) return false
                    if (typeFilter && typeFilter !== 'all' && i.type !== typeFilter) return false
                    if (date?.from) {
                      const from = date.from.getTime()
                      const to = date.to ? date.to.getTime() : from
                      const id = new Date(i.date).getTime()
                      if (id < from || id > to) return false
                    }
                    return true
                  })

                  const csv = toCsv(filtered, columns)
                  downloadFile('incidentes.csv', csv)
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Error generando CSV', err)
                }
            }}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar CSV
            </Button>
        </div>
      </div>
      <Separator />

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" />Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={projectFilter} onValueChange={(v) => setProjectFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las obras</SelectItem>
              <SelectItem value="Viaducto del Suroeste">Viaducto del Suroeste</SelectItem>
              <SelectItem value="Túnel de Oriente">Túnel de Oriente</SelectItem>
            </SelectContent>
          </Select>

           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Seleccionar rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo de riesgo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los riesgos</SelectItem>
              <SelectItem value="Deslizamiento">Deslizamiento</SelectItem>
              <SelectItem value="Inundación">Inundación</SelectItem>
            </SelectContent>
          </Select>

          <Button>Aplicar Filtros</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Incidentes</CardTitle>
            <CardDescription>Incidentes reportados en el período</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">128</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Obras Finalizadas</CardTitle>
            <CardDescription>Proyectos completados exitosamente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Mitigación</CardTitle>
            <CardDescription>Incidentes resueltos vs. reportados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">92%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Obras</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgressData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" unit="%" hide />
                  <YAxis dataKey="zone" type="category" tickLine={false} axisLine={false} tickMargin={8} className="text-sm" width={80} />
                  <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incidentes por severidad</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <RechartsPieChart>
                  <Tooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={incidentTypeData.map(d => ({...d, name: d.type}))} dataKey="count" nameKey="type" innerRadius={50} outerRadius={100} paddingAngle={5} cornerRadius={5}>
                    {incidentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartConfig[entry.type as keyof typeof pieChartConfig]?.color || 'hsl(var(--muted))'} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
