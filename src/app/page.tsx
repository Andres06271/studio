import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { kpiData, projectProgressData, incidentTypeData, incidentTrendData } from '@/lib/data';
import { BarChart3, PieChart, LineChart, FileText, AlertOctagon, FolderKanban } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, Cell as RechartsPrimitive, Line, ResponsiveContainer, Tooltip } from "recharts"
import { PieChart as RechartsPieChart } from 'recharts/lib/chart/PieChart';
import { LineChart as RechartsLineChart } from 'recharts/lib/chart/LineChart';
import { YAxis } from 'recharts/lib/cartesian/YAxis';


const chartConfig = {
  progress: {
    label: "Avance",
    color: "hsl(var(--primary))",
  },
  incidents: {
    label: "Incidentes",
  }
}

const pieChartConfig = {
  incidents: {
    label: "Incidentes",
  },
  'Deslizamiento': {
    label: "Deslizamiento",
    color: "hsl(var(--chart-1))",
  },
  'Inundación': {
    label: "Inundación",
    color: "hsl(var(--chart-2))",
  },
  'Falla Estructural': {
    label: "Falla Estructural",
    color: "hsl(var(--chart-3))",
  },
  'Otro': {
    label: "Otro",
    color: "hsl(var(--chart-4))",
  },
}

const lineChartConfig = {
  incidentes: {
    label: "Incidentes Reportados",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardPage() {
  const kpiIcons = {
    'Obras Activas': <FolderKanban className="text-secondary" />,
    'Incidentes Reportados': <AlertOctagon className="text-destructive" />,
    'Obras en Riesgo': <AlertOctagon className="text-warning" />,
    'Documentos Cargados': <FileText className="text-primary" />,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              {kpiIcons[kpi.title as keyof typeof kpiIcons]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Avance de Obras por Zona
            </CardTitle>
            <CardDescription>Progreso promedio de las obras activas.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgressData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                   <CartesianGrid vertical={false} />
                   <XAxis dataKey="zone" tickLine={false} axisLine={false} tickMargin={8} />
                   <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="%" />
                   <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
                </BarChart>
               </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="size-5" />
              Distribución de Incidentes por Tipo
            </CardTitle>
            <CardDescription>Clasificación de incidentes reportados.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip content={<ChartTooltipContent nameKey="incidents" hideLabel />} />
                  <Pie data={incidentTypeData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
                     {incidentTypeData.map((entry, index) => (
                      <RechartsPrimitive.Cell key={`cell-${index}`} fill={pieChartConfig[entry.type as keyof typeof pieChartConfig]?.color || 'hsl(var(--muted))'} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="size-5" />
            Incidentes Reportados por Mes
          </CardTitle>
          <CardDescription>Tendencia de incidentes en los últimos 6 meses.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={incidentTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip content={<ChartTooltipContent indicator="line" />} />
                  <Line type="monotone" dataKey="incidentes" stroke="var(--color-incidentes)" strokeWidth={2} dot={true} />
                </RechartsLineChart>
              </ResponsiveContainer>
           </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
