"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { PostProps } from "@/app/actions";
import { Pin } from "lucide-react";
import Image from "next/image";import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Post({
  id,
  title,
  authorName,
  imageuser,
  imageUrl,
  content,
  hashtags,
  createdAt

}: PostProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);  // Asegúrate de tener esta línea

  const words = content.split(" ");
  const shouldTruncate = words.length > 40;
  const truncatedText = shouldTruncate ? words.slice(0, 40).join(" ") + "..." : content;

  const handlePinPost = () => {
    alert(`Post fijado con ID: ${id}`);
  };

  return (


    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="w-full gap-2 mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={imageuser as string} />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <span className="font-semibold not-italic">{authorName}</span>
              <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700">
                Seguir
              </Button>
              <div className="flex-grow"></div>
              <Button size="icon" variant="ghost" onClick={handlePinPost}>
                <Pin className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardTitle className="text-xl ml-6">{title}</CardTitle>
          <CardContent>
            <p className="inline">{expanded ? content : truncatedText}</p>
            {shouldTruncate && (
              <Button className="bg-transparent hover:bg-transparent px-2 py-1 text-xs text-blue-500 inline ml-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Ver menos" : "Ver más"}
              </Button>
            )}
            {imageUrl && (
              <div className="mt-4">
                <Image
                  src={imageUrl}
                  alt={title}
              width={500}
              height={300}
                  className="w-full max-h-[400px] object-cover rounded"
                />
              </div>
            )}
            <div className="mt-2 flex gap-2">
              {hashtags?.map((tag, index) => (
                <span key={index} className="text-blue-500">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-2">
              <span className="text-gray-500">{createdAt}</span>
            </div>
          </CardContent>

        </Card>
      </DialogTrigger>

      <DialogContent className="w-auto max-h-[650px] flex flex-col">

        <DialogHeader>
          <DialogTitle className="text-xl ml-6">{title}</DialogTitle>
          <div className="flex items-center ml-6 space-x-6">

            <Avatar className="w-10 h-10">
              <AvatarImage src={imageuser} />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <span className="font-semibold not-italic">{authorName}</span>
            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700">
              Seguir
            </Button>
            <div className="flex-grow"></div>
            <Button size="icon" variant="ghost" onClick={handlePinPost}>
              <Pin className="w-5 h-5" />
            </Button>
        </div>
        </DialogHeader>
        <ScrollArea className="border-none h-[400px] w-full border p-4">
        
        <p className="inline">{content}</p>

        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Imagen del post"
              className="w-full max-h-[400px] object-cover rounded"
            />
          </div>
        )}
        <div className="mt-2 flex gap-2">
          {hashtags?.map((tag, index) => (
            <span key={index} className="text-blue-500">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <span className="text-gray-500">{createdAt}</span>
        </div>
        </ScrollArea>
      </DialogContent>

    </Dialog>
  );
}
