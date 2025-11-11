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
    <div id="report-root" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">
            Analiza los datos y exporta reportes personalizados.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={async () => {
                // Client-side PDF generation using html2canvas + jsPDF
                // Dynamic import to avoid hard dependency at build-time if packages are missing.
                try {
                  const [html2canvasMod, jsPDFMod] = await Promise.all([
                    import('html2canvas'),
                    import('jspdf')
                  ])
                  const html2canvas = html2canvasMod.default || html2canvasMod
                  const { jsPDF } = jsPDFMod

                  const el = document.getElementById('report-root') || document.body
                  const canvas = await html2canvas(el, { scale: 2 })
                  const imgData = canvas.toDataURL('image/png')

                  // A4 dimensions in mm
                  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
                  const pageWidth = pdf.internal.pageSize.getWidth()
                  const pageHeight = pdf.internal.pageSize.getHeight()

                  // Calculate image dimensions (preserve aspect ratio)
                  const imgProps = (pdf as any).getImageProperties(imgData)
                  const imgWidthMm = (imgProps.width * 25.4) / 96 // px to mm (@96dpi)
                  const imgHeightMm = (imgProps.height * 25.4) / 96
                  const ratio = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm)
                  const renderWidth = imgWidthMm * ratio
                  const renderHeight = imgHeightMm * ratio

                  pdf.addImage(imgData, 'PNG', (pageWidth - renderWidth) / 2, 10, renderWidth, renderHeight)
                  pdf.save('reportes.pdf')
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Error generando PDF', err)
                  // Fallback: abrir diálogo de impresión del navegador
                  if (typeof window !== 'undefined') window.print()
                }
            }}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
            </Button>
            <Button variant="outline" onClick={async () => {
                // Call server-side export endpoint so the server can stream/format large exports
                try {
                  const params = new URLSearchParams()
                  params.set('format', 'csv')
                  if (projectFilter && projectFilter !== 'all') params.set('project', projectFilter)
                  if (typeFilter && typeFilter !== 'all') params.set('type', typeFilter)
                  if (date?.from) {
                    const fromIso = date.from.toISOString().slice(0,10)
                    params.set('from', fromIso)
                    if (date.to) {
                      const toIso = date.to.toISOString().slice(0,10)
                      params.set('to', toIso)
                    }
                  }

                  const res = await fetch(`/api/reportes/export?${params.toString()}`)
                  if (!res.ok) throw new Error(`Export failed: ${res.status}`)

                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const disposition = res.headers.get('Content-Disposition') || ''
                  let filename = 'reportes-incidentes.csv'
                  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";\n]+)/)
                  if (match && match[1]) filename = decodeURIComponent(match[1])

                  const a = document.createElement('a')
                  a.href = url
                  a.download = filename
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  setTimeout(() => URL.revokeObjectURL(url), 5000)
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Error descargando CSV', err)
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
