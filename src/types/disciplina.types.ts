export interface Disciplina {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  descricao: string;
  ordem: number;
  createdAt?: string;
}

export interface DisciplinaCompleta extends Disciplina {
  totalFlashcards: number;
  progresso: number; // 0-100
  ultimaRevisao?: string;
}