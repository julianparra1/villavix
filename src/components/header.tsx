import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { getAuth, signOut } from "firebase/auth";
import { UserCircle, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, userRole, loading } = useAuth();
  
  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center bg-white/80 dark:bg-transparent backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Image
          src="/logo2.2.svg"
          alt="Logo"
          width={50}
          height={50}
          className="fill-indigo-700 dark:invert"
        />
        <span className="font-ebgaramond font-medium text-xl">VillaVix</span>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex space-x-6">
          <Link href="/home" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400 transition">Posts</Link>
        </nav>
        
        {loading ? (
          // Show loading indicator while auth state is being determined
          <div className="h-9 w-9 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700"></div>
        ) : user ? (
          // Show user profile when logged in
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                <Avatar>
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "Usuario"} />
                  <AvatarFallback>{user.displayName?.[0] || user.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.displayName || "Usuario"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  {userRole && (
                    <span className="text-xs font-medium text-primary">{userRole}</span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Show login/register buttons when not logged in
          <>
            <Link href={`/login`}>
              <Button variant="outline" className="hidden md:flex">Iniciar Sesión</Button>
            </Link>
            <Link href={`/page`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">Registrarse</Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}