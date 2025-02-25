import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert(process.env.FIREBASE_ADMIN_JSON as string),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export const adminAuth = getAuth();
export const adminDb = getFirestore("villavix-db")