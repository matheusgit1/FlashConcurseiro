import React, { createContext, useContext, useEffect, useState } from "react";
import { mockAuthService, UsuarioMock } from "../mocks/auth.mock";
// import { UsuarioMock, mockAuthService, MOCK_AUTH_CONTEXT } from '@/mocks/auth.mock';

interface AuthContextData {
  user: UsuarioMock | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UsuarioMock | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há usuário logado (mock)
    const loadUser = async () => {
      try {
        const currentUser = await mockAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await mockAuthService.login(email, senha);
      setUser(response.user);
      // Armazenar token (mock)
      // localStorage.setItem("@auth_token", response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await mockAuthService.logout();
      setUser(null);
      localStorage.removeItem("@auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await mockAuthService.register(nome, email, senha);
      setUser(response.user);
      localStorage.setItem("@auth_token", response.token);
    } finally {
      setIsLoading(false);
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
