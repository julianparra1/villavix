import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";

export default function Header(){
    return(
        <header className="container mx-auto px-4 py-6 flex justify-between items-center bg-white/80 dark:bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="fill-indigo-700 dark:invert"
          />
          <span className="font-bold text-xl">VillaVix</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Características</Link>
            <Link href="#testimonials" className="text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Testimonios</Link>
            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cómo Funciona</Link>
          </nav>
          <Link href={`/login`}>
            <Button variant="outline" className="hidden md:flex">Iniciar Sesión</Button>
          </Link>
          <Link href={`/register`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">Registrarse</Button>
          </Link>
          <ModeToggle/>
        </div>
      </header>
    )
 }