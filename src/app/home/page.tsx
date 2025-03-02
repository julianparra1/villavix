'use client';
import Link from 'next/link';
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

export default function HomeGo() {


  return (

    <div className="flex min-h-screen">
      <section className="container mx-auto px-4 py-24">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 w-[450px]">
        <form className="text-center">
          <CardContent className="space-y-4">
          <div className="space-y-2">
              <Input 
                id="name" 
                name="name"
                type="text" 
                placeholder="¿Que piensas el dia de hoy?" 
                required />
            </div>
          </CardContent>
        </form>
          <CardContent className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 w-full">
              Hacer una publicacion
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
