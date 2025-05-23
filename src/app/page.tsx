import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, RocketIcon, StarIcon, ArrowRightIcon, HeartIcon, ChatBubbleIcon, PersonIcon } from "@radix-ui/react-icons";

export default function HomePage() {
  return (
    <div>  
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
      <Badge className="mb-4 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-900/50">✨ Nueva Plataforma</Badge>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
          Conectando Ciudadanos y Funcionarios
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
          Nuestra plataforma facilita la comunicación entre ciudadanos y funcionarios públicos,
          permitiendo reportar quejas y dar seguimiento a soluciones para mejorar nuestra comunidad.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">

        <Link href={`/home`}>
          <Button size="lg" className="relative bg-black text-white border border-white rounded-lg overflow-hidden hover:bg-gray-800">
            Reportar Queja <ArrowRightIcon className="ml-2" />
          </Button>
          </Link>
          <Link href={`/home`}>
          <Button size="lg"  className="relative bg-black text-white border border-white rounded-lg overflow-hidden hover:bg-gray-800">
            Soy Funcionario
          </Button>
          </Link>

        </div>
        <div className="mt-16 relative w-full max-w-4xl">
  <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-600 rounded-lg blur opacity-30"></div>
  <div className="relative bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
    <Image 
      src="/dashboard-preview.jpg" 
      alt="Dashboard de la Plataforma" 
      width={1200}
      height={600}
      className="w-full h-auto"
    />
  </div>
</div>

      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Características Principales</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas para conectar efectivamente con tu comunidad
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ChatBubbleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />,
              title: "Reportes Ciudadanos",
              description: "Presenta tus quejas y sugerencias de manera fácil y rápida con seguimiento en tiempo real."
            },
            {
              icon: <PersonIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />,
              title: "Panel para Funcionarios",
              description: "Gestiona reportes, responde a los ciudadanos y coordina soluciones desde un solo lugar."
            },
            {
              icon: <StarIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />,
              title: "Transparencia",
              description: "Visualiza estadísticas públicas sobre la gestión de quejas y desempeño de funcionarios."
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-white border-gray-100 hover:shadow-md dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <div className="p-2 bg-indigo-100/60 dark:bg-indigo-900/20 w-fit rounded-lg mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800/30 border-gray-100 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">¿Listo para mejorar tu comunidad?</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg mt-2">
              Únete a miles de ciudadanos y funcionarios que ya están transformando su ciudad.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-center gap-4">
            
            <Link href={`/register`}>
            <Button size="lg" className="relative bg-black text-white border border-white rounded-lg overflow-hidden hover:bg-gray-800">
              Crear Cuenta Ciudadano
            </Button>
            </Link>
            
            <Link href={`/refunc`}>
            <Button size="lg" className="relative bg-black text-white border border-white rounded-lg overflow-hidden hover:bg-gray-800">
              Acceso para Funcionarios
            </Button>
            </Link>
          </CardContent>
          <CardFooter className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Registro gratuito para ciudadanos. Verificación requerida para funcionarios.
          </CardFooter>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Image
                src="/logo2.2.svg"
                alt="Logo"
                width={30}
                height={30}
              />
              <span className="font-ebgaramond font-medium text-xl">VillaVix</span>
              </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Privacidad</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Términos</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Contacto</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2025 VillaVix. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}