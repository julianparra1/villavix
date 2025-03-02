"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage, createPost } from '@/app/actions';
import Image from 'next/image';
import { Loader2, ImageIcon } from 'lucide-react';

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Escribe un título para tu publicación" 
                      {...field} 
                      disabled={isUploading}
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
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escribe el contenido de tu publicación..." 
                      className="min-h-[150px]"
                      {...field} 
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label htmlFor="image">Imagen (opcional)</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                    className={imagePreview ? "hidden" : ""}
                  />
                  {!imagePreview && (
                    <Label 
                      htmlFor="image" 
                      className="flex items-center gap-2 justify-center rounded-md border border-dashed py-4 px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Seleccionar imagen
                      </span>
                    </Label>
                  )}
                </div>
                
                {imagePreview && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
              
              {imagePreview && (
                <div className="mt-4 relative overflow-hidden rounded-md border">
                  <div className="aspect-video w-full">
                    <Image 
                      src={imagePreview}
                      alt="Vista previa"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <FormDescription>
                Archivos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB.
              </FormDescription>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando publicación...
                </>
              ) : "Publicar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}