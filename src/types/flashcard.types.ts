export interface Flashcard {
  id: string;
  pergunta: string;
  resposta: string;
  dica?: string;
  concursoId: string;
  disciplinaId: string;
  dificuldade: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  tipo: "texto" | "imagem" | "audio";
  midiaUrl?: string;
  revisoes: number;
  ultimaRevisao?: string;
  proximaRevisao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardReview extends Flashcard {
  status: "new" | "learning" | "review" | "mastered";
  acertos: number;
  erros: number;
  nivelDominio: 0 | 1 | 2 | 3 | 4 | 5;
}

export type Dificuldade = 1 | 2 | 3 | 4 | 5;
