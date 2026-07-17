import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";

interface AuthContextData {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          nome: firebaseUser.displayName || "Usuário",
          email: firebaseUser.email,
          avatar: "👤",
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(() => true);
    try {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);

      // Para capturar o resultado após o retorno à página:
      getRedirectResult(auth)
        .then((result: any) => {
          if (result) {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential!.accessToken;
            const user = result.user;
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error);
    } finally {
      setIsLoading(() => false);
    }
  };

  const login = async (email: string, senha: string) => {
    setIsLoading(() => true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Usuário logado:", response, response.user);
      setUser(() => ({
        id: response.user.uid,
        nome: response.user.displayName || "Usuário",
        email: response.user.email || email,
        avatar: "👤",
      }));
      // Armazenar token (mock)
      // localStorage.setItem("@auth_token", response.token);
      // await AsyncStorage.setItem("@Flash:lastEmail", email);
      // await AsyncStorage.setItem("@Flash:lastLogin", new Date().toISOString());
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Falha no login");
    } finally {
      setIsLoading(() => false);
    }
  };

  const logout = async () => {
    setIsLoading(() => true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setIsLoading(() => false);
    }
  };

  const register = async (nome: string, email: string, senha: string) => {
    setIsLoading(() => true);
    try {
      // Registration should be implemented with createUserWithEmailAndPassword
      // For now, this is a placeholder
      throw new Error("Registro não implementado");
    } finally {
      setIsLoading(() => false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
