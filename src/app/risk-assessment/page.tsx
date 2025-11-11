'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AIGeneratedRiskAssessmentOutput,
  aiGeneratedRiskAssessment,
} from '@/ai/flows/ai-generated-risk-assessment';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  projectDescription: z
    .string()
    .min(50, 'La descripción del proyecto debe tener al menos 50 caracteres.'),
  historicalIncidentData: z
    .string()
    .min(50, 'Los datos históricos deben tener al menos 50 caracteres.'),
  projectTimeline: z
    .string()
    .min(10, 'El cronograma del proyecto debe tener al menos 10 caracteres.'),
  engineeringPersonnel: z
    .string()
    .min(10, 'El personal de ingeniería debe tener al menos 10 caracteres.'),
});

export default function RiskAssessmentPage() {
  const [result, setResult] = useState<AIGeneratedRiskAssessmentOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: '',
      historicalIncidentData: '',
      projectTimeline: '',
      engineeringPersonnel: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const assessmentResult = await aiGeneratedRiskAssessment(values);
      setResult(assessmentResult);
      toast({
        title: "Evaluación completada",
        description: "El análisis de riesgos ha finalizado con éxito.",
      });
    } catch (error) {
      console.error('AI Risk Assessment failed:', error);
      toast({
        variant: "destructive",
        title: "Error en la Evaluación",
        description: "No se pudo completar el análisis de riesgos. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
          <BrainCircuit className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-headline">Herramienta de Evaluación de Riesgos IA</h1>
          <p className="text-muted-foreground">
            Utiliza IA para identificar riesgos potenciales en tus proyectos.
          </p>
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>
              Proporciona los detalles para el análisis de IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Proyecto</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe la naturaleza, alcance y ubicación del proyecto..."
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="historicalIncidentData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datos Históricos de Incidentes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Incluye datos relevantes de incidentes pasados en zonas o proyectos similares..."
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectTimeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cronograma del Proyecto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Q1 2025 - Q4 2026"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="engineeringPersonnel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal de Ingeniería</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Juan Pérez (Senior), María García (Junior)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    'Analizando...'
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" /> Generar Evaluación
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div>
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" />
                        Resultados del Análisis de IA
                    </CardTitle>
                    <CardDescription>
                        Riesgos potenciales y estrategias de mitigación sugeridas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loading && (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Separator className="my-4" />
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    )}
                    {!loading && !result && (
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                          <AlertTitle className="text-blue-800 dark:text-blue-300">Esperando entrada</AlertTitle>
                          <AlertDescription className="text-blue-700 dark:text-blue-400">
                            Completa el formulario para generar la evaluación de riesgos.
                          </AlertDescription>
                        </Alert>
                    )}
                    {result && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Zap className="h-5 w-5 text-destructive" /> Riesgos Identificados</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.identifiedRisks}</p>
                            </div>
                             <Separator />
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-success" /> Estrategias de Mitigación</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.riskMitigationStrategies}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
