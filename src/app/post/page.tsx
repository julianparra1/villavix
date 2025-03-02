"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage, createPost } from '@/app/actions';
import Image from 'next/image';
import { Loader2, ImageIcon, X, ArrowLeft, Send } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation with React Hook Form and Zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres.",
  }),
  content: z.string().min(10, {
    message: "El contenido debe tener al menos 10 caracteres.",
  })
});

interface CreatePostFormProps {
  userId: string;
  userEmail: string;
}

export default function CreatePostForm({ userId, userEmail }: CreatePostFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // File size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Archivo demasiado grande",{
          description: "La imagen debe ser menor a 5MB",
        });
        return;
      }
      
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    
    try {
      // Upload image if one is selected
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        
        const result = await uploadImage(formData);
        if (result.error) {
          toast.error("Error al subir la imagen",{
            description: result.error,
          });
          setIsUploading(false);
          return;
        }
        
        imageUrl = result.imageUrl || '';
      }
      
      // Create post
      const postFormData = new FormData();
      postFormData.append('title', values.title);
      postFormData.append('content', values.content);
      if (imageUrl) {
        postFormData.append('imageUrl', imageUrl);
      }
      
      const result = await createPost(postFormData);
      
      if (result.error) {
        toast.error("Error al crear la publicación", {
          description: result.error,
        });
      } else {
        toast.success("¡Publicación creada!",{
          description: "Tu publicación ha sido creada exitosamente."
        });
        
        // Reset form
        form.reset();
        setImage(null);
        setImagePreview(null);
        
        // Redirect to dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error",{
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group mb-4 hover:bg-muted/50 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Publicación</h1>
        <p className="text-muted-foreground mt-1">
          Comparte tus ideas, preguntas o sugerencias con la comunidad.
        </p>
      </div>
      
      <Card className="">
        <CardHeader className="]">
          <CardTitle className="text-xl">Crear Publicación</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 pb-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Título</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Escribe un título atractivo para tu publicación" 
                        {...field} 
                        disabled={isUploading}
                        className="text-lg py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Contenido</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Escribe el contenido de tu publicación..." 
                        className="min-h-[200px] text-base resize-y"
                        {...field} 
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribe un texto claro y detallado para comunicar tu mensaje.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3 pt-2">
                <Label htmlFor="image" className="text-base font-medium block">
                  Imagen (opcional)
                </Label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed rounded-lg p-8">
                    <div className="flex flex-col items-center text-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="font-medium text-base">Agregar imagen</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sube una imagen para ilustrar tu publicación
                      </p>
                      
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="relative"
                        disabled={isUploading}
                        asChild
                      >
                        <Label htmlFor="image" className="cursor-pointer m-0">
                          Seleccionar archivo
                        </Label>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-md border">
                    <div className="aspect-video w-full relative bg-black/5">
                      <Image 
                        src={imagePreview}
                        alt="Vista previa"
                        fill
                        className="object-contain"
                      />
                      
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon"
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                        className="absolute top-2 right-2 rounded-full z-10 opacity-90 hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <FormDescription>
                  Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB.
                </FormDescription>
              </div>
              
              <CardFooter className="flex justify-end gap-3 px-0 pt-4 pb-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                
                <Button 
                  type="submit" 
                  className="gap-2" 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creando publicación...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publicar
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}