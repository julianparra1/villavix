import { db } from '@/lib/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.role || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};
