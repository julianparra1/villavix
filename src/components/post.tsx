"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { PostProps } from "@/app/actions";

export default function Post({
  title,
  authorName,
  imageuser,
  imageUrl,
  content,
  hashtags,
  createdAt
  
}: PostProps) {

  const [expanded, setExpanded] = useState(false);  // Asegúrate de tener esta línea

  const words = content.split(" ");
  const shouldTruncate = words.length > 40;
  const truncatedText = shouldTruncate ? words.slice(0, 40).join(" ") + "..." : content;

  return (
    <Card className="w-full gap-2 mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={imageuser}/>
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <span className="font-semibold not-italic">{authorName}</span>
          <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-700">
            Seguir
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
      </CardContent>
    </Card>
  );
}
