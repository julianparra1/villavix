import { useState, useEffect } from 'react';
import { 
  collection, query, orderBy, limit, onSnapshot, 
  startAfter, doc, getDocs, getDoc, DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/clientApp';
import type { PostProps } from '@/app/actions';

export function useRealtimePosts(initialPosts: PostProps[], postLimit = 5) {
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot | null>(null);

  // Helper function to process post data
  const processPostData = (doc: DocumentSnapshot) => {
    const data = doc.data();
    if (!data) return null;
    
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
  };

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
      if (snapshot.empty) {
        setPosts([]);
        setHasMore(false);
        return;
      }

      // Process posts from snapshot
      const updatedPosts = snapshot.docs
        .map(doc => processPostData(doc))
        .filter((post): post is PostProps => post !== null);

      // Store the last document for pagination
      setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
      
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
    if (isLoading || !hasMore || !lastVisibleDoc) return;
    
    setIsLoading(true);
    
    try {
      // Create a query for more posts using the stored lastVisibleDoc
      const morePostsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleDoc),
        limit(postLimit)
      );
      
      const morePostsSnapshot = await getDocs(morePostsQuery);
      
      if (morePostsSnapshot.empty) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      const newPosts = morePostsSnapshot.docs
        .map(doc => processPostData(doc))
        .filter((post): post is PostProps => post !== null);
      
      // Update the last visible document for next pagination
      setLastVisibleDoc(morePostsSnapshot.docs[morePostsSnapshot.docs.length - 1]);
      
      // Append new posts to the existing list
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