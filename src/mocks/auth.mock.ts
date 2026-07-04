export interface UsuarioMock {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

export interface LoginResponse {
  user: UsuarioMock;
  token: string;
}

const MOCK_USERS: UsuarioMock[] = [
  {
    id: 'user_1',
    nome: 'João Silva',
    email: 'joao@email.com',
    avatar: '👨‍💻',
  },
  {
    id: 'user_2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    avatar: '👩‍💻',
  },
];

// Simulação de delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    await delay(1000);
    
    // Mock: aceita qualquer email/senha, mas verifica se existe
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    if (senha.length < 3) {
      throw new Error('Senha inválida');
    }
    
    return {
      user,
      token: `mock_token_${Date.now()}_${user.id}`,
    };
  },
  
  register: async (nome: string, email: string, senha: string): Promise<LoginResponse> => {
    await delay(1200);
    
    // Verifica se já existe
    if (MOCK_USERS.find(u => u.email === email)) {
      throw new Error('Email já cadastrado');
    }
    
    const newUser: UsuarioMock = {
      id: `user_${Date.now()}`,
      nome,
      email,
      avatar: '🆕',
    };
    
    return {
      user: newUser,
      token: `mock_token_${Date.now()}_${newUser.id}`,
    };
  },
  
  logout: async () => {
    await delay(300);
    return { success: true };
  },
  
  getCurrentUser: async (): Promise<UsuarioMock | null> => {
    await delay(200);
    return MOCK_USERS[0]; // Retorna o primeiro usuário
  },
};

// Contexto de autenticação mock
export const MOCK_AUTH_CONTEXT = {
  user: MOCK_USERS[0],
  isAuthenticated: true,
  isLoading: false,
};