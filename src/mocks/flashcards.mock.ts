// import { Flashcard, FlashcardReview, Dificuldade } from '@/types/flashcard.types';
import {
  Dificuldade,
  Flashcard,
  FlashcardReview,
} from "../types/flashcard.types";
import { MOCK_CONCURSOS } from "./concursos.mock";

// Gerador de flashcards baseados nas disciplinas
const generateFlashcards = (): Flashcard[] => {
  const cards: Flashcard[] = [];
  let idCounter = 1;

  // Português
  const portuguesCards = [
    {
      pergunta: "O que é crase?",
      resposta: 'Fusão da preposição "a" com o artigo "a"',
      dica: 'Substitua "à" por "ao"',
    },
    {
      pergunta: "Quais são as classes gramaticais?",
      resposta: "Substantivo, adjetivo, verbo, advérbio...",
      dica: "Lembre das 10 classes",
    },
    {
      pergunta: "O que é sujeito?",
      resposta: "Termo da oração sobre o qual algo é declarado",
      dica: "Quem pratica a ação?",
    },
    {
      pergunta: "Qual a diferença entre por que e porque?",
      resposta: "Por que = pergunta, porque = explicação",
      dica: 'Substitua por "pelo qual"',
    },
  ];

  // Matemática
  const matematicaCards = [
    {
      pergunta: "Qual a fórmula de juros simples?",
      resposta: "J = C × i × t",
      dica: "J = Juros, C = Capital",
    },
    {
      pergunta: "O que é porcentagem?",
      resposta: "Razão centesimal representada por %",
      dica: "Divida por 100",
    },
    {
      pergunta: "Como calcular regra de três?",
      resposta: "Multiplica cruzado e divide",
      dica: "Grandezas diretamente proporcionais",
    },
    {
      pergunta: "O que é MDC?",
      resposta: "Máximo Divisor Comum",
      dica: "Maior número que divide todos",
    },
  ];

  // Informática
  const informaticaCards = [
    {
      pergunta: "O que é um sistema operacional?",
      resposta: "Software que gerencia hardware e software",
      dica: "Windows, Linux, macOS",
    },
    {
      pergunta: "O que é um firewall?",
      resposta: "Barreira de segurança de rede",
      dica: "Controla tráfego",
    },
    {
      pergunta: "O que é phishing?",
      resposta: "Golpe que tenta obter dados pessoais",
      dica: "Cuidado com emails suspeitos",
    },
  ];

  // Atualidades
  const atualidadesCards = [
    {
      pergunta: "Qual a capital do Brasil?",
      resposta: "Brasília",
      dica: "Plano Piloto",
    },
    {
      pergunta: "Quem é o atual presidente do Brasil?",
      resposta: "Luiz Inácio Lula da Silva",
      dica: "Eleito em 2022",
    },
  ];

  // Raciocínio Lógico
  const logicaCards = [
    {
      pergunta: "O que é uma proposição?",
      resposta: "Oração declarativa com valor de verdade",
      dica: "Verdadeira ou falsa",
    },
    {
      pergunta: 'Qual a negação de "Todo A é B"?',
      resposta: "Algum A não é B",
      dica: "Negação de todo = algum não",
    },
  ];

  // Direito
  const direitoCards = [
    {
      pergunta: "O que é a Constituição?",
      resposta: "Lei fundamental do país",
      dica: "Suprema lei",
    },
    {
      pergunta: "O que são direitos fundamentais?",
      resposta: "Direitos básicos garantidos pela CF",
      dica: "Vida, liberdade, igualdade",
    },
  ];

  const allCards = [
    ...portuguesCards.map((c) => ({ ...c, disciplinaId: "portugues" })),
    ...matematicaCards.map((c) => ({ ...c, disciplinaId: "matematica" })),
    ...informaticaCards.map((c) => ({ ...c, disciplinaId: "informatica" })),
    ...atualidadesCards.map((c) => ({ ...c, disciplinaId: "atualidades" })),
    ...logicaCards.map((c) => ({ ...c, disciplinaId: "logica" })),
    ...direitoCards.map((c) => ({ ...c, disciplinaId: "direito" })),
  ];

  // Distribuir entre concursos
  MOCK_CONCURSOS.forEach((concurso) => {
    const disciplinasDoConcurso = concurso.disciplinas;
    const cardsDoConcurso = allCards.filter((c) =>
      disciplinasDoConcurso.includes(c.disciplinaId),
    );

    // Pegar alguns aleatórios para cada concurso
    const shuffled = [...cardsDoConcurso].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(shuffled.length, 10));

    selected.forEach((card, index) => {
      const dificuldade: Dificuldade = (Math.floor(Math.random() * 5) +
        1) as Dificuldade;
      cards.push({
        id: `flash_${concurso.id}_${idCounter++}`,
        pergunta: card.pergunta,
        resposta: card.resposta,
        dica: card.dica,
        concursoId: concurso.id,
        disciplinaId: card.disciplinaId,
        dificuldade,
        tags: [card.disciplinaId],
        tipo: "texto",
        revisoes: Math.floor(Math.random() * 20),
        ultimaRevisao: new Date(
          Date.now() - Math.random() * 86400000 * 30,
        ).toISOString(),
        createdAt: new Date(
          Date.now() - Math.random() * 86400000 * 60,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  return cards;
};

export const MOCK_FLASHCARDS: Flashcard[] = generateFlashcards();

// Gerar status aleatório para revisão
const getRandomStatus = (): FlashcardReview["status"] => {
  const statuses: FlashcardReview["status"][] = [
    "new",
    "learning",
    "review",
    "mastered",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const mockFlashcardService = {
  getAll: () => Promise.resolve(MOCK_FLASHCARDS),

  getById: (id: string) => {
    const flashcard = MOCK_FLASHCARDS.find((f) => f.id === id);
    return Promise.resolve(flashcard || null);
  },

  getByConcursoId: (concursoId: string) => {
    const flashcards = MOCK_FLASHCARDS.filter(
      (f) => f.concursoId === concursoId,
    );
    return Promise.resolve(flashcards);
  },

  getByDisciplinaId: (disciplinaId: string) => {
    const flashcards = MOCK_FLASHCARDS.filter(
      (f) => f.disciplinaId === disciplinaId,
    );
    return Promise.resolve(flashcards);
  },

  getByConcursoEDisciplina: (concursoId: string, disciplinaId: string) => {
    const flashcards = MOCK_FLASHCARDS.filter(
      (f) => f.concursoId === concursoId && f.disciplinaId === disciplinaId,
    );
    return Promise.resolve(flashcards);
  },

  getForReview: (concursoId?: string) => {
    let flashcards = MOCK_FLASHCARDS;
    if (concursoId) {
      flashcards = flashcards.filter((f) => f.concursoId === concursoId);
    }

    // Converter para FlashcardReview
    const reviews: FlashcardReview[] = flashcards.map((f) => ({
      ...f,
      status: getRandomStatus(),
      acertos: Math.floor(Math.random() * 10),
      erros: Math.floor(Math.random() * 5),
      nivelDominio: Math.floor(Math.random() * 6) as 0 | 1 | 2 | 3 | 4 | 5,
    }));

    return Promise.resolve(reviews);
  },
};

// Função auxiliar para contar flashcards por disciplina
export const countFlashcardsByDisciplina = (disciplinaId: string): number => {
  return MOCK_FLASHCARDS.filter((f) => f.disciplinaId === disciplinaId).length;
};

// Função auxiliar para contar flashcards por concurso
export const countFlashcardsByConcurso = (concursoId: string): number => {
  return MOCK_FLASHCARDS.filter((f) => f.concursoId === concursoId).length;
};
