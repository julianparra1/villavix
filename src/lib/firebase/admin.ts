import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert(process.env.FIREBASE_ADMIN_JSON as string),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export const adminAuth = getAuth();
export const adminDb = getFirestore("villavix-db")
export const adminStorage = getStorage();