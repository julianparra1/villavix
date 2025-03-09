import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/clientApp";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
interface AuthState {
  user: User | null;
  userRole: string | null;
  loading: boolean;
}

const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult(true);
          setUserRole(idTokenResult.claims.role as string || "ciudadano");
          document.cookie = `sessionToken=${idTokenResult.token}; path=/`;      
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      } else {
        setUser(null);
        setUserRole(null);
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userRole, loading };
};

export default useAuth;
