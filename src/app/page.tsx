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
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center bg-white/80 dark:bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-xl">VillaVix</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Características</Link>
            <Link href="#testimonials" className="text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Testimonios</Link>
            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cómo Funciona</Link>
          </nav>
          
          <Button variant="outline" className="hidden md:flex">Iniciar Sesión</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">Registrarse</Button>
          <ModeToggle/>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <Badge className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50">✨ Nueva Plataforma</Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
          Conectando Ciudadanos y Funcionarios
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
          Nuestra plataforma facilita la comunicación entre ciudadanos y funcionarios públicos,
          permitiendo reportar quejas y dar seguimiento a soluciones para mejorar nuestra comunidad.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
            Reportar Queja <ArrowRightIcon className="ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-950/30">
            Soy Funcionario
          </Button>
        </div>
        <div className="mt-16 relative w-full max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30"></div>
          <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
            <Image 
              src="/dashboard-preview.png" 
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
              icon: <ChatBubbleIcon className="h-8 w-8 text-indigo-500" />,
              title: "Reportes Ciudadanos",
              description: "Presenta tus quejas y sugerencias de manera fácil y rápida con seguimiento en tiempo real."
            },
            {
              icon: <PersonIcon className="h-8 w-8 text-indigo-500" />,
              title: "Panel para Funcionarios",
              description: "Gestiona reportes, responde a los ciudadanos y coordina soluciones desde un solo lugar."
            },
            {
              icon: <StarIcon className="h-8 w-8 text-indigo-500" />,
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

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Opiniones de Usuarios</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre cómo VillaVix está transformando la relación ciudadano-funcionario
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "Gracias a la plataforma, mi reporte fue atendido en menos de una semana. La comunicación directa con los funcionarios es excelente.",
              author: "Carolina Martínez",
              role: "Ciudadana"
            },
            {
              quote: "Como funcionario público, esta herramienta me ha permitido organizar mejor mi trabajo y atender más eficientemente las necesidades de los ciudadanos.",
              author: "Roberto Gómez",
              role: "Director de Servicios Públicos"
            }
          ].map((testimonial, i) => (
            <Card key={i} className="bg-white border-gray-100 dark:bg-gray-800/30 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-600/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gradient-to-r dark:from-indigo-900/40 dark:to-purple-900/40 border-gray-100 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">¿Listo para mejorar tu comunidad?</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg mt-2">
              Únete a miles de ciudadanos y funcionarios que ya están transformando su ciudad.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 w-full md:w-auto">
              Crear Cuenta Ciudadano
            </Button>
            <Button size="lg" variant="outline" className="w-full md:w-auto text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-950/30">
              Acceso para Funcionarios
            </Button>
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
                src="/logo.svg"
                alt="Logo"
                width={30}
                height={30}
              />
              <span className="font-bold text-lg text-gray-900 dark:text-white">VillaVix</span>
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