'use client';

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainFeed() {
  const [posts, setPosts] = useState([
    { id: 1, content: "Esta es una publicación de ejemplo.", author: "Usuario Ejemplo" },
    { id: 2, content: "Otra publicación de prueba.", author: "Otro Usuario" },
  ])

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const content = formData.get("post-content") as string
    if (content.trim()) {
      setPosts([{ id: Date.now(), content, author: "Usuario Actual" }, ...posts])
      e.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <form onSubmit={handlePostSubmit} className="flex-grow">
          <Input name="post-content" placeholder="¿Qué estás pensando?" />
          <Button type="submit" className="mt-2">
            Publicar
          </Button>
        </form>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{post.author}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}