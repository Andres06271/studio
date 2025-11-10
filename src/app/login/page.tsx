import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10"
           style={{
             backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, transparent 1px)',
             backgroundSize: '2rem 2rem',
           }}></div>
      <div className="absolute -bottom-1/2 -left-1/4 w-full h-full rounded-full bg-primary/5 blur-3xl opacity-50"></div>
      <div className="absolute -top-1/2 -right-1/4 w-3/4 h-3/4 rounded-full bg-secondary/5 blur-3xl opacity-50"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4 flex items-center justify-center gap-2 text-foreground">
              <Icons.logo className="h-10 w-10 text-primary" />
              <span className="text-3xl font-bold font-headline">Civisys</span>
            </Link>
            <CardDescription className="font-medium">
              Plataforma de Gestión y Control de Riesgos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>                
                <Input
                  id="email"
                  type="email"
                  placeholder="ingeniero@civisys.co"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="#"
                    className="text-sm text-primary/90 hover:text-primary hover:underline"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  Recordarme
                </Label>
              </div>
              <Button type="submit" className="w-full !mt-6 font-bold uppercase tracking-wider" asChild>
                <Link href="/">Iniciar Sesión</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © 2025 Civisys S.A.S.
        </p>
      </div>
    </div>
  );
}
