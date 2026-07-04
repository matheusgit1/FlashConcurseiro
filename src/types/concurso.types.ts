export interface Concurso {
  id: string;
  nome: string;
  descricao: string;
  instituicao: string;
  nivel: 'fundamental' | 'medio' | 'superior';
  ano: number;
  disciplinas: string[]; // IDs das disciplinas
  totalFlashcards: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ConcursoNivel = 'fundamental' | 'medio' | 'superior';