'use server';

import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Type for post data
export interface PostProps {
  id: string;
  title: string;
  authorName: string;
  imageuser: string;
  imageUrl?: string | null;
  content: string;
  hashtags?: string[] | null;
  createdAt: string;
}

// Server action to upload image using Admin SDK
export async function uploadImage(formData: FormData) {
  try {
    // Get the current user's session
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      throw new Error('No authenticated session');
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const file = formData.get('image') as File;
    
    if (!file || file.size === 0) {
      return { error: 'No file provided' };
    }

    // Convert File to Buffer for server upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a filename with timestamp to avoid collisions
    const filename = `posts/${decodedClaims.uid}/${Date.now()}-${file.name}`;
    
    // Upload using Admin SDK's storage
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(filename);
    
    // Upload the file with metadata
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: Date.now().toString(), // Custom token for public URL
        },
      },
    });
    
    // Make the file publicly accessible
    await fileRef.makePublic();
    
    // Get the public URL
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
    return { imageUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { error: 'Failed to upload image' };
  }
}

// Server action to create post using Admin SDK
export async function createPost(formData: FormData) {
  try {
    // Get the current user's session
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      throw new Error('No authenticated session');
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!title || !content) {
      return { error: 'Title and content are required' };
    }

    // Add post to Firestore using Admin SDK
    const postRef = adminDb.collection('posts').doc();
    const post: PostProps = {
      id: postRef.id,
      title,
      authorName: decodedClaims.name || 'Usuario',
      imageuser: '', // Add appropriate value
      imageUrl: imageUrl || null,
      content: content,
      hashtags: ["test"], // Add appropriate value
      createdAt: new Date().toISOString() // This will be updated with server timestamp
    };

    await postRef.set({
      ...post,
      authorId: decodedClaims.uid,
      authorEmail: decodedClaims.email,
      createdAt: FieldValue.serverTimestamp()
    });

    // Revalidate the dashboard path to show the new post
    revalidatePath('/dashboard');
    return { success: true, postId: postRef.id };
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: 'Failed to create post' };
  }
}

export async function getPosts(limit = 5, lastPostId?: string) {
  try {
    let query = adminDb.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limit);
      
    if (lastPostId) {
      const lastDoc = await adminDb.collection('posts').doc(lastPostId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }
    
    const postsSnapshot = await query.get();
    const hasMore = postsSnapshot.docs.length === limit;
    
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Handle different types of createdAt field
      let createdAtISO;
      if (!data.createdAt) {
        createdAtISO = new Date().toISOString();
      } else if (typeof data.createdAt.toDate === 'function') {
        // It's a Firestore timestamp
        createdAtISO = data.createdAt.toDate().toISOString();
      } else if (data.createdAt instanceof Date) {
        // It's a JavaScript Date
        createdAtISO = data.createdAt.toISOString();
      } else if (typeof data.createdAt === 'string') {
        // It's already a string
        createdAtISO = data.createdAt;
      } else if (typeof data.createdAt === 'object' && data.createdAt._seconds !== undefined) {
        // It's a Firestore timestamp in serialized form
        createdAtISO = new Date(data.createdAt._seconds * 1000).toISOString();
      } else {
        // Fallback
        createdAtISO = new Date().toISOString();
      }

      return {
        id: doc.id,
        title: data.title || '',
        authorName: data.authorName || 'Usuario',
        imageuser: '',
        imageUrl: data.imageUrl || null,
        content: data.content || '',
        hashtags: Array.isArray(data.hashtags) ? [...data.hashtags] : [],
        createdAt: createdAtISO
      };
    });
    
    return { posts, hasMore };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], hasMore: false };
  }
}

// Server action to get user-specific posts using Admin SDK
export async function getUserPosts() {
  try {
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      return [];
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const postsSnapshot = await adminDb.collection('posts')
      .where('authorId', '==', decodedClaims.uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        authorName: data.authorName || 'Usuario',
        imageuser: '', // Add appropriate value
        imageUrl: data.imageUrl || null,
        content: data.content,
        hashtags: [], // Add appropriate value
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      } as PostProps;
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}