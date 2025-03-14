'use server';

import { adminAuth, adminDb, adminStorage } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { remark } from 'remark';
import html from 'remark-html';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Type for post data
export interface PostProps {
  id: string;
  title: string;
  authorName: string;
  imageuser?: string | null;
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

/// Server action to create post using Admin SDK
export async function createPost(postData: {
  title: string;
  content: string;
  hashtags?: string[];
  imageUrl?: string;
}) {
  try {
    // Get the current user's session
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      throw new Error('No authenticated session');
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const { title, content, hashtags = [], imageUrl = null } = postData;

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
      imageUrl,
      content,
      hashtags,
      createdAt: new Date().toISOString() // This will be updated with server timestamp
    };

    await postRef.set({
      ...post,
      authorId: decodedClaims.uid,
      authorEmail: decodedClaims.email,
      createdAt: FieldValue.serverTimestamp()
    });

    revalidatePath('/home');
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
      if (!data || !data.createdAt) {
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
        title: data?.title || '',
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

export async function getRecentPostsWithSummary(limit = 5, lastPostId?: string, searchQuery?: string) {
  try {
    // Iniciar la consulta base
    let query = adminDb.collection('posts')
      .orderBy('createdAt', 'desc');
    
      if (searchQuery && searchQuery.startsWith('#')) {
        const hashtag = searchQuery.toLowerCase();
        query = query.where('hashtags', 'array-contains', hashtag);
      }
      
    
    if (lastPostId) {
      const lastDoc = await adminDb.collection('posts').doc(lastPostId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }
    
    const postsSnapshot = await query.get();
    
    // Procesar los posts
    let posts = postsSnapshot.docs.map(doc => {
      // ...existing mapping code...
      const data = doc.data();
      
      // Manejar diferentes tipos de createdAt
      let createdAtISO;
      if (!data || !data.createdAt) {
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
        imageuser: '',
        imageUrl: data.imageUrl || null,
        content: data.content || '',
        hashtags: Array.isArray(data.hashtags) ? [...data.hashtags] : [],
        createdAt: createdAtISO
      };
    });
    
    // Filter posts by search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTermLower = searchQuery.toLowerCase();
      posts = posts.filter(post => 
        post.content.toLowerCase().includes(searchTermLower) || 
        post.title.toLowerCase().includes(searchTermLower) ||
        (post.hashtags && post.hashtags.some(tag => 
          tag.toLowerCase().includes(searchTermLower)
        ))
      );
    }
    
    const hasMore = postsSnapshot.docs.length === limit;
    
    // Generar un resumen general solo si hay posts
    let generalSummary = '';
    let contentHtml = '';
    if (posts.length > 0) {
      try {
        // ...existing summary generation code...
        const postSeparator = "@@@";
        const prompt = `
          Eres un asistente de IA que ayuda a los funcionarios de gobierno en una comunidad en línea que conecta con las quejas de los ciudadanos.
          No incluyas titulos.
          Basado en los siguientes posts recientes, 
          donde cada post está separado por un '${postSeparator}' carácter, 
          crea un resumen conciso donde incluyas los puntos clave de las quejas (en forma de puntos) de los usuarios que capturen los temas principales discutidos. Evita usar expresiones como "en resumen" o "en conclusión".
          
          Aquí están los posts: ${posts.map(post => 
            `TÍTULO: ${post.title} 
             CONTENIDO: ${post.content}`
          ).join(postSeparator)}
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        generalSummary = response.text();

        const processedContent = await remark()
          .use(html)
          .process(generalSummary);
        if (processedContent){
          contentHtml = processedContent.toString();
        }
      } catch (error) {
        console.error('Error generando resumen con Gemini:', error);
        contentHtml = 'No se pudo generar un resumen automático.';
      }
    } else {
      contentHtml = searchQuery 
        ? 'No se encontraron publicaciones para esta búsqueda.'
        : 'No hay publicaciones recientes para resumir.';
    }
    
    return { posts, hasMore, contentHtml };
  } catch (error) {
    console.error('Error fetching posts or generating summary:', error);
    return { posts: [], hasMore: false, contentHtml: 'Error al procesar las publicaciones recientes.' };
  }
}

export async function getRecentPosts(limit = 5, lastPostId?: string) {
  try {
    // Calcular la fecha de hace 2 días
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Iniciar la consulta base con el filtro de fecha
    let query = adminDb.collection('posts')
      .where('createdAt', '>=', twoDaysAgo)  // Filtrar posts de los últimos 2 días
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    // Aplicar paginación si se proporciona un lastPostId
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

// Pin a post (add to user's pinnedPosts array)
export async function pinPost(postId: string) {
  try {
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      return { success: false, message: "User not authenticated" };
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const userDocRef = adminDb.collection('users').doc(decodedClaims.uid);
    
    // Get current user document
    const userDoc = await userDocRef.get();
    
    // Create the user document if it doesn't exist
    if (!userDoc.exists) {
      await userDocRef.set({
        email: decodedClaims.email,
        name: decodedClaims.name || 'Usuario',
        pinnedPosts: [postId]
      });
    } else {
      // Update existing document by adding postId to pinnedPosts array
      await userDocRef.update({
        pinnedPosts: FieldValue.arrayUnion(postId)
      });
    }
    
    return { success: true, message: "Post pinned successfully" };
  } catch (error) {
    console.error("Error pinning post:", error);
    return { success: false, message: "Failed to pin post" };
  }
}

// Unpin a post (remove from user's pinnedPosts array)
export async function unpinPost(postId: string) {
  try {
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      return { success: false, message: "User not authenticated" };
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const userDocRef = adminDb.collection('users').doc(decodedClaims.uid);
    
    // Remove postId from pinnedPosts array
    await userDocRef.update({
      pinnedPosts: FieldValue.arrayRemove(postId)
    });
    
    return { success: true, message: "Post unpinned successfully" };
  } catch (error) {
    console.error("Error unpinning post:", error);
    return { success: false, message: "Failed to unpin post" };
  }
}

// Check if a post is pinned by current user
export async function isPostPinned(postId: string) {
  try {
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      return false;
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const userDocRef = adminDb.collection('users').doc(decodedClaims.uid);
    const userDoc = await userDocRef.get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData && userData.pinnedPosts && userData.pinnedPosts.includes(postId);
    }
    
    return false;
  } catch (error) {
    console.error("Error checking pinned status:", error);
    return false;
  }
}

// Get all pinned posts for current user
export async function getPinnedPosts() {
  try {
    const sessionCookie = (await cookies()).get('sessionToken')?.value;
    if (!sessionCookie) {
      return { posts: [], success: false };
    }

    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie);
    const userDocRef = adminDb.collection('users').doc(decodedClaims.uid);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists || !userDoc.data()?.pinnedPosts) {
      return { posts: [], success: true };
    }
    
    const userData = userDoc.data();
    const pinnedPostIds = userData ? userData.pinnedPosts : [];
    
    if (pinnedPostIds.length === 0) {
      return { posts: [], success: true };
    }
    
    // Get the actual posts from their IDs
    const postsPromises = pinnedPostIds.map(async (id: string) => {
      const postDoc = await adminDb.collection('posts').doc(id).get();
      if (!postDoc.exists) return null;
      
      const data = postDoc.data();
      let createdAtISO;
      
      if (!data || !data.createdAt) {
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
        id: postDoc.id,
        title: data?.title || '',
        authorName: data?.authorName || 'Usuario',
        imageuser: '',
        imageUrl: data?.imageUrl || null,
        content: data?.content || '',
        hashtags: Array.isArray(data?.hashtags) ? [...data.hashtags] : [],
        createdAt: createdAtISO,
        isPinned: true
      };
    });
    
    const postsResults = await Promise.all(postsPromises);
    const posts = postsResults.filter(post => post !== null);
    
    return { posts, success: true };
  } catch (error) {
    console.error("Error getting pinned posts:", error);
    return { posts: [], success: false };
  }
}