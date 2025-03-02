'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Settings, Activity, Users, LogOut } from "lucide-react";

export function LeftSidebar() {
  const handleLogout = () => {
    // Implementar lógica de cierre de sesión aquí
    console.log("Cerrando sesión...")
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <Link href="/profile">
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Perfil
        </Button>
      </Link>
      <Link href="/settings">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Ajustes
        </Button>
      </Link>
      <Link href="/activity">
        <Button variant="ghost" className="w-full justify-start">
          <Activity className="mr-2 h-4 w-4" />
          Actividad
        </Button>
      </Link>
      <Link href="/officials">
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Funcionarios
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        className="w-full justify-start mt-auto px-3" 
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  )
}
