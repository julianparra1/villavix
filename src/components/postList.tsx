"use client";
import { useEffect, useCallback } from "react";
import { PostProps } from '@/app/actions';
import PostComponent from "@/components/post";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useRealtimePosts } from '@/lib/useRealtimePosts';

interface PostsListProps {
  initialPosts: PostProps[];
  initialHasMore: boolean;
}

export function PostsList({ initialPosts, initialHasMore }: PostsListProps) {
  // Use the real-time hook instead of managing state manually
  const { posts, hasMore, isLoading, loadMorePosts } = useRealtimePosts(initialPosts);
  
  // Use react-intersection-observer to detect when the loading element is in view
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 300,
  });
  
  // Load more posts when the loading element comes into view
  const loadMoreOnInView = useCallback(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [inView, hasMore, isLoading, loadMorePosts]);
  
  useEffect(() => {
    loadMoreOnInView();
  }, [loadMoreOnInView]);
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-medium text-gray-500 dark:text-gray-400">
          No hay publicaciones disponibles
        </h2>
        <p className="mt-2 text-gray-400 dark:text-gray-500">
          Las publicaciones aparecerán aquí cuando sean creadas
        </p>
        <Button asChild className="mt-8">
          <Link href="/post">Crear una publicación</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4">
      {posts.map((post) => (
        <PostComponent key={`${post.id}-${post.createdAt}`} {...post}/>
      ))}
      
      {/* Loading indicator - this element triggers the next fetch when it comes into view */}
      {hasMore && (
        <div 
          ref={ref} 
          className="flex justify-center py-8"
        >
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-6 w-6 animate-spin text-gray-500" />}
            <p className="text-sm text-gray-500">
              {isLoading ? 'Cargando más publicaciones...' : 'Desplázate para cargar más'}
            </p>
          </div>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay más publicaciones para mostrar
        </div>
      )}
    </div>
  );
}