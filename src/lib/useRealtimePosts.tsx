import { useState, useEffect } from 'react';
import { 
  collection, query, orderBy, limit, onSnapshot, 
  startAfter, doc, getDocs 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/clientApp';
import type { PostProps } from '@/app/actions';

export function useRealtimePosts(initialPosts: PostProps[], postLimit = 5) {
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Real-time subscription to posts
  useEffect(() => {
    // Create a query for the posts collection
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(postLimit)
    );

    // Subscribe to the query
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      // Process posts from snapshot
      const updatedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Handle different types of createdAt field
        let createdAtISO;
        if (!data.createdAt) {
          createdAtISO = new Date().toISOString();
        } else if (typeof data.createdAt.toDate === 'function') {
          createdAtISO = data.createdAt.toDate().toISOString();
        } else if (data.createdAt instanceof Date) {
          createdAtISO = data.createdAt.toISOString();
        } else if (typeof data.createdAt === 'string') {
          createdAtISO = data.createdAt;
        } else if (typeof data.createdAt === 'object' && data.createdAt._seconds !== undefined) {
          createdAtISO = new Date(data.createdAt._seconds * 1000).toISOString();
        } else {
          createdAtISO = new Date().toISOString();
        }

        return {
          id: doc.id,
          title: data.title || '',
          authorName: data.authorName || 'Usuario',
          imageuser: data.imageuser || '',
          imageUrl: data.imageUrl || null,
          content: data.content || '',
          hashtags: Array.isArray(data.hashtags) ? [...data.hashtags] : [],
          createdAt: createdAtISO
        } as PostProps;
      });

      // Update the state with new posts
      setPosts(updatedPosts);
      setHasMore(updatedPosts.length === postLimit);
    }, (error) => {
      console.error("Error in real-time posts subscription:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [postLimit]);

  // Function to load more posts
  const loadMorePosts = async () => {
    if (isLoading || !hasMore || posts.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const lastPost = posts[posts.length - 1];
      
      // Create a query for more posts
      const morePostsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(doc(db, 'posts', lastPost.id)),
        limit(postLimit)
      );
      
      const morePostsSnapshot = await getDocs(morePostsQuery);
      
      const newPosts = morePostsSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Same timestamp handling as above
        let createdAtISO;
        if (!data.createdAt) {
          createdAtISO = new Date().toISOString();
        } else if (typeof data.createdAt.toDate === 'function') {
          createdAtISO = data.createdAt.toDate().toISOString();
        } else if (data.createdAt instanceof Date) {
          createdAtISO = data.createdAt.toISOString();
        } else if (typeof data.createdAt === 'string') {
          createdAtISO = data.createdAt;
        } else if (typeof data.createdAt === 'object' && data.createdAt._seconds !== undefined) {
          createdAtISO = new Date(data.createdAt._seconds * 1000).toISOString();
        } else {
          createdAtISO = new Date().toISOString();
        }
        
        return {
          id: doc.id,
          title: data.title || '',
          authorName: data.authorName || 'Usuario',
          imageuser: data.imageuser || '',
          imageUrl: data.imageUrl || null,
          content: data.content || '',
          hashtags: Array.isArray(data.hashtags) ? [...data.hashtags] : [],
          createdAt: createdAtISO
        } as PostProps;
      });
      
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length === postLimit);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { posts, hasMore, isLoading, loadMorePosts };
}