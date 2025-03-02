'use server'

import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Type for post data
export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
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
    await postRef.set({
      title,
      content,
      imageUrl: imageUrl || null,
      authorId: decodedClaims.uid,
      authorName: decodedClaims.name || 'Usuario',
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

// Server action to fetch posts using Admin SDK
export async function getPosts() {
  try {
    const postsSnapshot = await adminDb.collection('posts')
      .orderBy('createdAt', 'desc')
      .get();
    
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        authorName: data.authorName || 'Usuario',
        authorEmail: data.authorEmail,
        // Convert Firestore Timestamp to ISO string, handling potential null values
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      } as Post;
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
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
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        authorName: data.authorName || 'Usuario',
        authorEmail: data.authorEmail,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      } as Post;
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}