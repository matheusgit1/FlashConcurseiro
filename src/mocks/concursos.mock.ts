// import { Concurso } from '@/types/concurso.types';

import { Concurso } from "../types/concurso.types";

export const MOCK_CONCURSOS: Concurso[] = [
  {
    id: "bb_2025",
    nome: "Banco do Brasil 2025",
    descricao: "Concurso para escriturário - Edital 2025",
    instituicao: "Banco do Brasil",
    nivel: "medio",
    ano: 2025,
    disciplinas: [
      "portugues",
      "matematica",
      "informatica",
      "atualidades",
      "logica",
    ],
    totalFlashcards: 42,
    active: true,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
  },
  {
    id: "caixa_2024",
    nome: "Caixa Econômica 2024",
    descricao: "Concurso para técnico bancário",
    instituicao: "Caixa Econômica Federal",
    nivel: "medio",
    ano: 2024,
    disciplinas: ["portugues", "matematica", "informatica", "atualidades"],
    totalFlashcards: 38,
    active: true,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "trt_sp_2026",
    nome: "TRT SP 2026",
    descricao: "Concurso para técnico judiciário",
    instituicao: "Tribunal Regional do Trabalho - SP",
    nivel: "superior",
    ano: 2026,
    disciplinas: ["portugues", "direito", "informatica", "atualidades"],
    totalFlashcards: 56,
    active: true,
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "sefaz_2025",
    nome: "SEFAZ SP 2025",
    descricao: "Concurso para auditor fiscal",
    instituicao: "Secretaria da Fazenda - SP",
    nivel: "superior",
    ano: 2025,
    disciplinas: ["portugues", "matematica", "direito", "contabilidade"],
    totalFlashcards: 78,
    active: true,
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2025-05-15T10:00:00Z",
  },
  {
    id: "policia_2024",
    nome: "Polícia Federal 2024",
    descricao: "Concurso para delegado e perito",
    instituicao: "Polícia Federal",
    nivel: "superior",
    ano: 2024,
    disciplinas: ["direito", "portugues", "atualidades", "logica"],
    totalFlashcards: 65,
    active: false,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
];

// Serviço mockado
export const mockConcursoService = {
  getAll: () => Promise.resolve(MOCK_CONCURSOS.filter((c) => c.active)),
  getById: (id: string) => {
    const concurso = MOCK_CONCURSOS.find((c) => c.id === id);
    return Promise.resolve(concurso || null);
  },
  getByNivel: (nivel: Concurso["nivel"]) => {
    return Promise.resolve(
      MOCK_CONCURSOS.filter((c) => c.nivel === nivel && c.active),
    );
  },
};
