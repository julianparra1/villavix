import { useState, useEffect, useRef, useCallback } from "react";
import { PostProps, getPosts } from '@/app/actions';
import PostComponent from "@/components/post";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { MessageCircle, Heart, Share2, MoreHorizontal, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useInView } from "react-intersection-observer";

interface PostsListProps {
  initialPosts: PostProps[];
  initialHasMore: boolean;
}

export function PostsList({ initialPosts, initialHasMore }: PostsListProps) {
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Use react-intersection-observer to detect when the loading element is in view
  const { ref, inView } = useInView({
    threshold: 0,
    // Only trigger once element is visible for 300ms
    delay: 300,
  });
  
  // Function to load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      // Get the ID of the last post to use as cursor
      const lastPostId = posts[posts.length - 1]?.id;
      
      // Fetch next batch of posts
      const { posts: newPosts, hasMore: morePostsAvailable } = await getPosts(5, lastPostId);
      
      // Update state with new posts
      setPosts(currentPosts => [...currentPosts, ...newPosts]);
      setHasMore(morePostsAvailable);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [posts, hasMore, isLoading]);
  
  // Load more posts when the loading element comes into view
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [inView, loadMorePosts, hasMore, isLoading]);
  
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
              <PostComponent key={post.id} {...post}/>
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