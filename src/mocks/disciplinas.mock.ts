// import { Disciplina, DisciplinaCompleta } from '@/types/disciplina.types';
import { Disciplina, DisciplinaCompleta } from '../types/disciplina.types';
import { MOCK_CONCURSOS } from './concursos.mock';

export const MOCK_DISCIPLINAS: Disciplina[] = [
  {
    id: 'portugues',
    nome: 'Português',
    icone: '📝',
    cor: '#4F46E5',
    descricao: 'Gramática, interpretação de textos, redação oficial',
    ordem: 1,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'matematica',
    nome: 'Matemática',
    icone: '🔢',
    cor: '#10B981',
    descricao: 'Matemática básica, financeira, estatística',
    ordem: 2,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'informatica',
    nome: 'Informática',
    icone: '💻',
    cor: '#F59E0B',
    descricao: 'Conceitos de hardware, software, redes e segurança',
    ordem: 3,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'atualidades',
    nome: 'Atualidades',
    icone: '📰',
    cor: '#EF4444',
    descricao: 'Política, economia, sociedade, cultura e ciência',
    ordem: 4,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'logica',
    nome: 'Raciocínio Lógico',
    icone: '🧠',
    cor: '#8B5CF6',
    descricao: 'Lógica proposicional, argumentação, sequências',
    ordem: 5,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'direito',
    nome: 'Direito',
    icone: '⚖️',
    cor: '#6B7280',
    descricao: 'Direito constitucional, administrativo, penal',
    ordem: 6,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'contabilidade',
    nome: 'Contabilidade',
    icone: '📊',
    cor: '#14B8A6',
    descricao: 'Contabilidade geral, pública, tributária',
    ordem: 7,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

// Calcular progresso mockado
const getRandomProgress = () => Math.floor(Math.random() * 100);
const getRandomFlashcardCount = (disciplinaId: string) => {
  const counts: Record<string, number> = {
    portugues: 25,
    matematica: 20,
    informatica: 15,
    atualidades: 18,
    logica: 12,
    direito: 30,
    contabilidade: 10,
  };
  return counts[disciplinaId] || 10;
};

export const mockDisciplinaService = {
  getAll: () => Promise.resolve(MOCK_DISCIPLINAS),
  getById: (id: string) => {
    const disciplina = MOCK_DISCIPLINAS.find(d => d.id === id);
    return Promise.resolve(disciplina || null);
  },
  getCompletas: (): Promise<DisciplinaCompleta[]> => {
    const completas = MOCK_DISCIPLINAS.map(d => ({
      ...d,
      totalFlashcards: getRandomFlashcardCount(d.id),
      progresso: getRandomProgress(),
      ultimaRevisao: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    }));
    return Promise.resolve(completas);
  },
  getByConcursoId: (concursoId: string) => {
    const concurso = MOCK_CONCURSOS.find(c => c.id === concursoId);
    if (!concurso) return Promise.resolve([]);
    
    const disciplinas = MOCK_DISCIPLINAS.filter(d => 
      concurso.disciplinas.includes(d.id)
    );
    return Promise.resolve(disciplinas);
  },
};