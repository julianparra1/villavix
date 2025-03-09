import { auth, db } from '@/lib/firebase/clientApp';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const authService = {
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      await fetch('/api/auth/setClaims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userCredential.user.uid }),
      });

      return { user: userCredential.user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(
    email: string, 
    password: string, 
    name: string, 
    lastname: string, 
    genero: string, 
    birthdate: string,
    age: number
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${name} ${lastname}`
      });
      
      // Create user document with all fields
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        lastname,
        genero,
        birthdate,
        age,
        role: 'ciudadano',
        createdAt: new Date().toISOString()
      });

      const token = await userCredential.user.getIdToken();

      await fetch('/api/auth/setClaims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userCredential.user.uid }),
      });

      return { user: userCredential.user, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
  }
};