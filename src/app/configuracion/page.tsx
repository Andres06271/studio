import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y de la aplicación.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Actualiza la información de tu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue="Equipo de Ingeniería" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="ingeniero@civisys.co" />
          </div>
          <Button>Guardar Cambios</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Elige cómo quieres recibir las notificaciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notifications" defaultChecked />
            <Label htmlFor="email-notifications" className="font-normal">
              Notificaciones por Email
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Recibe un email cuando se reporte un incidente de alta severidad.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox id="push-notifications" />
            <Label htmlFor="push-notifications" className="font-normal">
              Notificaciones Push
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Recibe notificaciones push en tus dispositivos. (Próximamente)
          </p>
          <Button>Guardar Preferencias</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>
            Personaliza la apariencia de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
              Usa el ícono de sol/luna en la barra de navegación para cambiar entre modo claro y oscuro.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
