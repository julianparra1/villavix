'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/firebase/auth';
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button";
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;
    const genero = formData.get('genero') as string;
    const birthdate = formData.get('birthdate') as string;
    const birthdateDate = new Date(birthdate)
    const age = calculateAge(birthdateDate)
    
    if (age < 18) {
      setError("Debes ser mayor de 18 años para registrarte.")
      setLoading(false)
      return
    }
  
    try {
      const { token } = await authService.register(
        email, 
        password, 
        name, 
        lastname, 
        genero, 
        birthdate, 
        age
      );
      document.cookie = `sessionToken=${token}; path=/`;
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate como ciudadano
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  name="name"
                  type="text" 
                  placeholder="Juanito" 
                  required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input 
                  id="lastname" 
                  name="lastname"
                  type="text" 
                  placeholder="Bananas" 
                  required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                <Input 
                  id="birthdate" 
                  name="birthdate"
                  type="date" 
                  required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select name="genero">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masc">Masculino</SelectItem>
                    <SelectItem value="fem">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="na">Prefiero no decirlo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/login" 
                className="text-primary hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}