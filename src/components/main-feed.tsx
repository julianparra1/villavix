'use client';

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Post from "@/components/post";

export function MainFeed() {
  const pinnedPosts = [
    { id: 1, range: "FUNCIONARIO", // Asegúrate de escribir exactamente "FUNCIONARIO" o "CIUDADANO"
      title: "  Los gatos dominaran el mundo",
      username: "Adrian Navarro",
      imageuser: "Avatar1.jpg",
      imagepost: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Felis_silvestris_silvestris_small_gradual_decrease_of_quality.png",
      text: "Mushoku Tensei sigue la historia de un hombre desempleado de 34 años que muere en un accidente de tráfico después de vivir una vida llena de arrepentimientos y aislamiento. Sin embargo, renace en un mundo de fantasía como Rudeus Greyrat, conservando sus recuerdos de su vida pasada. Desde su infancia, Rudeus muestra un talento excepcional para la magia, lo que lo lleva a ser entrenado por la maga Roxy Migurdia. También entabla amistad con Sylphiette, una niña de su edad con quien crea un fuerte vínculo. A medida que crece, Rudeus es enviado a vivir con sus parientes y se convierte en el tutor de Eris Boreas Greyrat, una joven noble con un carácter fuerte. Con el tiempo, desarrollan una relación especial mientras Rudeus mejora sus habilidades con la espada bajo la enseñanza de Ghislaine, una experta espadachina. Sin embargo, sus vidas cambian drásticamente cuando un desastre mágico los transporta a una región desconocida del mundo. Rudeus y Eris deben encontrar la manera de regresar a casa con la ayuda de Ruijerd, un guerrero de la temida raza Supard. Durante su viaje, Rudeus madura, mejora sus habilidades y enfrenta numerosos desafíos que ponen a prueba su determinación y crecimiento personal. Tras regresar a su hogar, Rudeus descubre que su familia se ha dispersado debido al desastre. Eris decide dejarlo para fortalecerse, lo que sume a Rudeus en una profunda depresión. Con el tiempo, se une a la Universidad de Magia, donde se reencuentra con Sylphiette y poco después se casa con ella. Más adelante, acepta una misión para rescatar a su madre y se casa también con Roxy, formando una familia con ambas. Su vida sigue evolucionando mientras sigue superando obstáculos, formando nuevas relaciones y enfrentando las consecuencias de sus decisiones en su búsqueda de una vida sin arrepentimientos.",
      hashtags: ["#ejemplo", "#shadcn", "#ui"],
      date: "2023-01-01", },

    { id: 2, range: "FUNCIONARIO", // Asegúrate de escribir exactamente "FUNCIONARIO" o "CIUDADANO"
      title: "  Los gatos dominaran el mundo",
      username: "Adrian Navarro",
      imageuser: "Avatar1.jpg",
      text: "Este es un ejemplo de post que muestra la información requerida.",
      hashtags: ["#ejemplo", "#shadcn", "#ui"],
      date: "2023-01-01", },

      { id: 3, range: "FUNCIONARIO", // Asegúrate de escribir exactamente "FUNCIONARIO" o "CIUDADANO"
        title: "  Los gatos dominaran el mundo",
        username: "Adrian Navarro",
        imageuser: "Avatar1.jpg",
        imagepost: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Felis_silvestris_silvestris_small_gradual_decrease_of_quality.png",
        text: "Este es un ejemplo de post que muestra la información requerida.",
        hashtags: ["#ejemplo", "#shadcn", "#ui"],
        date: "2023-01-01", },
  ]

  return (
    <div className="space-y-6">
      {/*<div className="flex items-center space-x-4">
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
      </div> */}
      <div className="space-y-5 p-4">
      {pinnedPosts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  )
}