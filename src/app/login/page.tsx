'use client';
import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/firebase/auth';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    
    try {
      const { token } = await authService.login(email, password);
      document.cookie = `sessionToken=${token}; path=/`;      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      return router.push('/home');
    };
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-background">
      
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}> 
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="escribetu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2"></div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/register" 
                className="text-primary hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPageWithSuspense() {
    return (
        <Suspense fallback="Cargando...">
        <LoginPage />
        </Suspense>
    );
}