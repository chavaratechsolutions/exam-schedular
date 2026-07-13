"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export type Role = "dir" | "hod" | "staff" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  department?: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  authError?: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthError(null);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            if (data.role === "staff") {
              if (data.designation === "Assistant Professor" || data.designation === "Associate Professor") {
                setUser(currentUser);
                setRole(data.role as Role);
                setDepartment(data.department || null);
              } else {
                await firebaseSignOut(auth);
                setUser(null);
                setRole(null);
                setDepartment(null);
                setAuthError("Access denied: Unauthorized designation.");
              }
            } else {
              setUser(currentUser);
              setRole(data.role as Role);
              setDepartment(data.department || null);
            }
          } else {
            setUser(currentUser);
            setRole("hod"); // Default fallback
            setDepartment(null);
          }
        } catch (error) {
          console.error("Error fetching user role", error);
          setUser(currentUser);
          setRole("hod");
          setDepartment(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setDepartment(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, department, loading, signOut, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
