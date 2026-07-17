import dotenv from "dotenv";
import path from "path";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const envPath = path.resolve(process.cwd(), "..", ".env");
dotenv.config({ path: envPath });

const firebaseEnv = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

console.log("🔥 Iniciando script de população de flashcards...");
console.log(
  firebaseEnv.apiKey
    ? "🔑 Firebase API Key encontrada."
    : "🚫 Firebase API Key nao encontrada.",
);

if (!firebaseEnv.apiKey || !firebaseEnv.projectId) {
  console.warn(
    "⚠️ Variáveis de ambiente do Firebase não foram encontradas. Verifique o arquivo .env na raiz do projeto.",
  );
}


const firebaseConfig = {
  apiKey: firebaseEnv.apiKey || "SEU_API_KEY",
  authDomain: firebaseEnv.authDomain || "SEU_PROJETO.firebaseapp.com",
  projectId: firebaseEnv.projectId || "SEU_PROJECT_ID",
  storageBucket: firebaseEnv.storageBucket || "SEU_PROJETO.appspot.com",
  messagingSenderId: firebaseEnv.messagingSenderId || "SEU_SENDER_ID",
  appId: firebaseEnv.appId || "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// IDs das disciplinas
const DISCIPLINAS = {
  portugues: "Gvvc3VldfUdDpbNqlaXB",
  legislacaoEtica: "HYlx0JTAvCnAI8mgSjSj",
  legislacaoMPES: "RZUibOXooJbkWQpJnN9N",
  analiseEstatica: "Z1sygCq1rXOrl2cwD6jL",
  laudosPericia: "fZqx8mcxSaC41WepidRT",
  rlm: "g3MQWYbUaKx4R5fwm5WQ",
};

const CONCURSO_ID = "9GW9Wof634ChgxxIH3ol";

// ============================================================
// 1. LÍNGUA PORTUGUESA
// ============================================================
const flashcardsPortugues = [
  {
    pergunta: "Quais são os princípios institucionais do Ministério Público?",
    resposta: "Unidade, indivisibilidade e independência funcional.",
    dica: "Art. 2º da Lei Orgânica do MPES (LC 95/1997).",
    tags: ["principios", "lei-organica"],
  },
  {
    pergunta: "Qual a diferença entre gênero textual narrativo e descritivo?",
    resposta:
      "Narrativo conta uma história com personagens, tempo e enredo. Descritivo enumera características de seres, objetos ou ambientes.",
    dica: "Narrativo = ação; Descritivo = qualidade.",
  },
  {
    pergunta: "O que é a crase e quando deve ser utilizada?",
    resposta:
      'Crase é a fusão da preposição "a" com o artigo "a(s)". Deve ser usada antes de palavra feminina determinada.',
    dica: 'Substitua "à" por "ao" para testar.',
  },
  {
    pergunta: 'Qual a regra de concordância para "mais de um"?',
    resposta: 'O verbo fica no singular: "Mais de um aluno chegou."',
    dica: "A FGV adora explorar essa exceção.",
  },
  {
    pergunta: 'O que é a contrapositiva de "p → q"?',
    resposta: 'A contrapositiva é "¬q → ¬p".',
    dica: "Se chove, o chão molha. Se o chão não molha, não chove.",
  },
  {
    pergunta: "Quais são os conectivos lógicos e seus símbolos?",
    resposta:
      "Conjunção (∧), Disjunção inclusiva (∨), Disjunção exclusiva (∨), Condicional (→), Bicondicional (↔), Negação (¬ ou ~).",
    dica: 'Lembre: "e", "ou", "se...então", "se e somente se", "não".',
  },
  {
    pergunta: "Como se estrutura um texto argumentativo?",
    resposta:
      "Introdução (tese), Desenvolvimento (argumentos) e Conclusão (reafirmação da tese).",
    dica: "A FGV cobra a função de cada segmento.",
  },
  {
    pergunta: "O que são figuras de linguagem como metáfora e comparação?",
    resposta:
      'Metáfora é comparação implícita (ex: "A vida é um palco"). Comparação é explícita com "como" ou "tal qual" (ex: "Ela é como uma flor").',
    dica: "Metáfora não tem conectivo comparativo.",
  },
  {
    pergunta: "Qual a diferença entre próclise, ênclise e mesóclise?",
    resposta:
      "Próclise: pronome antes do verbo (ex: Não me toque). Ênclise: pronome depois (ex: Toque-me). Mesóclise: pronome no meio (ex: Far-lhe-ei).",
    dica: "Palavras negativas, conjunções subordinativas e advérbios atraem próclise.",
  },
  {
    pergunta: "O que é variação linguística diatópica?",
    resposta: "Variação geográfica: regionalismos.",
    dica: 'Ex: "mandioca" no Norte e "aipim" no Sul.',
  },
];

// ============================================================
// 2. RACIOCÍNIO LÓGICO-MATEMÁTICO (RLM)
// ============================================================
const flashcardsRLM = [
  {
    pergunta: "O que é uma proposição na lógica?",
    resposta:
      "Sentença declarativa que pode ser classificada como verdadeira (V) ou falsa (F), nunca ambas.",
    dica: "Não são proposições: interrogativas, exclamativas, imperativas.",
  },
  {
    pergunta: 'Qual a negação da proposição "Todo A é B"?',
    resposta: '"Algum A não é B".',
    dica: 'Negação de "todo" = "algum não".',
  },
  {
    pergunta: 'Qual a negação de "Algum A é B"?',
    resposta: '"Nenhum A é B".',
    dica: 'Negação de "algum" = "nenhum".',
  },
  {
    pergunta: "Qual a fórmula da regra de três simples direta?",
    resposta: "a/b = c/d ⇒ a × d = b × c.",
    dica: "Grandezas diretamente proporcionais.",
  },
  {
    pergunta: "Como calcular a porcentagem acumulada de dois aumentos?",
    resposta:
      "Multiplica-se os fatores: (1 + p1/100) × (1 + p2/100) - 1 × 100.",
    dica: "Não somar percentuais!",
  },
  {
    pergunta: "Qual a diferença entre Permutação, Arranjo e Combinação?",
    resposta:
      "Permutação: todos os elementos (n!). Arranjo: ordem importa (n!/(n-p)!). Combinação: ordem não importa (n!/(p!(n-p)!)).",
    dica: "Arranjo = ordem importa; Combinação = ordem não importa.",
  },
  {
    pergunta: "Qual a fórmula da probabilidade condicional?",
    resposta: "P(A|B) = P(A ∩ B) / P(B).",
    dica: "Probabilidade de A acontecer dado que B aconteceu.",
  },
  {
    pergunta: "Qual a soma dos ângulos internos de um triângulo?",
    resposta: "180 graus.",
    dica: "Todo triângulo tem 180°.",
  },
  {
    pergunta: "O que é desvio padrão?",
    resposta:
      "Medida de dispersão que indica o quanto os dados se afastam da média.",
    dica: "Quanto maior o desvio padrão, mais heterogêneos os dados.",
  },
  {
    pergunta: "Como calcular a mediana de um conjunto de dados?",
    resposta:
      "Ordenar os dados. Se n ímpar: termo central. Se n par: média dos dois termos centrais.",
    dica: "A mediana divide o conjunto em duas metades iguais.",
  },
];

// ============================================================
// 3. LEGISLAÇÃO E CÓDIGO DE ÉTICA DO MPES
// ============================================================
const flashcardsLegislacaoMPES = [
  {
    pergunta: "Qual a função do Ministério Público segundo a CF/88?",
    resposta:
      "Instituição permanente, essencial à função jurisdicional do Estado, incumbindo-lhe a defesa da ordem jurídica, do regime democrático e dos interesses sociais e individuais indisponíveis.",
    dica: "Art. 127 da CF/88.",
  },
  {
    pergunta: "Quais os princípios institucionais do MPES?",
    resposta: "Unidade, indivisibilidade e independência funcional.",
    dica: "Art. 2º da LC 95/1997.",
  },
  {
    pergunta: "Qual o órgão de cúpula do MPES?",
    resposta: "Procuradoria-Geral de Justiça (PGJ).",
    dica: "Chefia, direção superior e representação.",
  },
  {
    pergunta: "Quais são as garantias dos membros do MP?",
    resposta: "Vitaliciedade, inamovibilidade e irredutibilidade de subsídios.",
    dica: "Art. 128 da CF/88.",
  },
  {
    pergunta: "O que diz a Lei Orgânica do MPES (LC 95/1997) em seu Art. 1º?",
    resposta:
      "O MPES é instituição permanente, essencial à função jurisdicional do Estado, incumbindo-lhe a defesa da ordem jurídica, do regime democrático e dos interesses sociais e individuais indisponíveis.",
    dica: "Praticamente uma cópia do art. 127 da CF.",
  },
  {
    pergunta: "Qual o período do Planejamento Estratégico do MPES vigente?",
    resposta: "2024-2032 (Portaria PGJ nº 362/2024).",
    dica: "Substituiu a Portaria 8565/2017.",
  },
  {
    pergunta: "Qual Resolução instituiu o Código de Ética do MP?",
    resposta: "Resolução CNMP nº 261/2023.",
    dica: "Vigente para todos os membros do Ministério Público.",
  },
  {
    pergunta: "O que é a LGPD e qual sua principal finalidade?",
    resposta:
      "Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018). Estabelece regras para tratamento de dados pessoais.",
    dica: "Princípios: finalidade, necessidade, transparência.",
  },
  {
    pergunta: "Quais são os direitos do titular de dados na LGPD (Art. 18)?",
    resposta:
      "Confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade.",
    dica: "O titular pode solicitar a qualquer momento.",
  },
  {
    pergunta: "O que é o MOTec?",
    resposta:
      "Manual de Orientações Técnicas de Contratações de TI do MPES, instituído pela Resolução CNMP nº 283/2024.",
    dica: "Orientação obrigatória para contratações de TI no MP.",
  },
];

// ============================================================
// 4. ANÁLISE ESTÁTICA, ARQUITETURA DE SOFTWARE E QUALIDADE
// ============================================================
const flashcardsAnaliseEstatica = [
  {
    pergunta: "O que é Clean Code?",
    resposta:
      "Filosofia de desenvolvimento de software que visa criar código fácil de ler, entender e manter.",
    dica: "Popularizado por Robert C. Martin (Uncle Bob).",
  },
  {
    pergunta: "O que é análise estática de código (SAST)?",
    resposta:
      "Processo de examinar o código sem executá-lo para identificar bugs, vulnerabilidades, code smells e problemas de segurança.",
    dica: "Detecção precoce de defeitos.",
  },
  {
    pergunta: "O que o SonarQube detecta?",
    resposta: "Bugs, Vulnerabilidades e Code Smells (BVC).",
    dica: "Lembre: BVC - Bugs, Vulnerabilidades, Code Smells.",
  },
  {
    pergunta: "O que é Quality Gate no SonarQube?",
    resposta:
      "Critério mínimo que o código deve atender para ser aprovado no processo de qualidade.",
    dica: "Portão de qualidade.",
  },
  {
    pergunta: "Qual a diferença entre Arquitetura 3 Camadas e MVC?",
    resposta:
      "3 Camadas é separação física/lógica (Apresentação, Aplicação, Dados). MVC é separação conceitual (Model, View, Controller).",
    dica: "O MVC é um subpadrão aplicado na camada de aplicação.",
  },
  {
    pergunta: "Qual a diferença entre SOAP e REST?",
    resposta:
      "SOAP é protocolo rígido baseado em XML. REST é estilo arquitetural flexível, com suporte a JSON.",
    dica: "REST é stateless; SOAP pode ser stateful.",
  },
  {
    pergunta: "O que é interoperabilidade de sistemas?",
    resposta:
      "Capacidade de diferentes sistemas trocarem informações e utilizá-las de forma eficaz.",
    dica: "Independente de hardware, SO ou linguagem.",
  },
  {
    pergunta: "Qual a diferença entre Verificação e Validação?",
    resposta:
      'Verificação: "Construímos o sistema certo?" (revisões estáticas). Validação: "Construímos o sistema certo?" (testes com usuário).',
    dica: "Verifica o código, valida o software em execução.",
  },
  {
    pergunta:
      "Cite três características de qualidade de software (ISO/IEC 25010)",
    resposta:
      "Funcionalidade, Confiabilidade, Usabilidade, Eficiência, Manutenibilidade, Portabilidade.",
    dica: "A ISO/IEC 25010 define essas características.",
  },
  {
    pergunta: "O que é arquitetura SOA (Service-Oriented Architecture)?",
    resposta:
      "Organiza aplicações em torno de serviços autônomos, reutilizáveis e interoperáveis.",
    dica: "Base para evolução para microserviços.",
  },
];

// ============================================================
// 5. LAUDOS E DOCUMENTAÇÃO TÉCNICA
// ============================================================
const flashcardsLaudos = [
  {
    pergunta: "Qual a diferença entre Laudo Técnico e Parecer Técnico?",
    resposta:
      "Laudo é descritivo e probatório (fatos, dados). Parecer é opinativo e conclusivo (juízo de valor).",
    dica: "Laudo = diagnóstico; Parecer = recomendação.",
  },
  {
    pergunta: "Quais os elementos obrigatórios de um laudo técnico?",
    resposta:
      "Identificação, qualificação do perito, objeto, descrição do problema, metodologia, resultados, discussão, conclusão, recomendações.",
    dica: "Art. 473 do CPC.",
  },
  {
    pergunta: "O que diz o art. 473 do CPC sobre laudos periciais?",
    resposta:
      "Exige: exposição do objeto, análise técnico-científica, indicação da metodologia e respostas conclusivas a todos os quesitos.",
    dica: "Sem esses itens, o laudo pode ser impugnado.",
  },
  {
    pergunta: "O que deve conter a seção de Metodologia em um laudo técnico?",
    resposta:
      "Descrição dos procedimentos, testes, ferramentas e técnicas utilizadas.",
    dica: "Garante a reprodutibilidade da análise.",
  },
  {
    pergunta: "Qual a importância da conclusão em um laudo técnico?",
    resposta:
      "Fornecer respostas objetivas e conclusivas aos quesitos formulados.",
    dica: "A conclusão é a parte mais aguardada do laudo.",
  },
];

// ============================================================
// 6. LEGISLAÇÃO E ASPECTOS ÉTICOS (Geral)
// ============================================================
const flashcardsLegislacaoEtica = [
  {
    pergunta: "O que é sigilo profissional em TI?",
    resposta:
      "Dever do profissional de não divulgar informações confidenciais a que tenha acesso no exercício de sua função.",
    dica: "Inclui dados pessoais, segredos industriais, resultados de pentest.",
  },
  {
    pergunta: "O que é a Lei 14.133/2021?",
    resposta: "Nova Lei de Licitações e Contratos Administrativos.",
    dica: "Revogou a Lei 8.666/1993, Lei do Pregão e RDC.",
  },
  {
    pergunta:
      "Quais modalidades de licitação foram extintas pela Lei 14.133/2021?",
    resposta: "Tomada de Preços e Convite.",
    dica: "Pregão, Concorrência, Concurso e Leilão foram mantidos.",
  },
  {
    pergunta:
      "Qual a nova modalidade de licitação criada pela Lei 14.133/2021?",
    resposta: "Diálogo Competitivo (para contratações complexas).",
    dica: "Permite negociação com os licitantes.",
  },
  {
    pergunta:
      "Qual Resolução instituiu o Modelo Nacional de Interoperabilidade (MNI)?",
    resposta: "Resolução Conjunta CNJ/CNMP nº 3/2013.",
    dica: "Visa interoperabilidade entre sistemas do Judiciário e MP.",
  },
  {
    pergunta: "O que a Resolução CNMP nº 283/2024 disciplina?",
    resposta:
      "Contratação de soluções de Tecnologia da Informação no âmbito do MP.",
    dica: "Substituiu a Resolução CNMP nº 102/2013.",
  },
  {
    pergunta:
      "Quais as fases do processo de contratação de TI conforme a Resolução CNMP nº 283/2024?",
    resposta: "Início, Planejamento, Seleção e Gestão (IPSG).",
    dica: "Lembre: I - P - S - G.",
  },
];

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================
async function populateFlashcards() {
  console.log("🚀 Iniciando população de flashcards...");
  console.log(`📋 Concurso ID: ${CONCURSO_ID}`);

  try {
    await signInAnonymously(auth);
    console.log("✅ Autenticado anonimamente no Firebase.");
  } catch (error) {
    console.error("❌ Falha ao autenticar no Firebase:", error);
  }

  const allFlashcards = [
    ...flashcardsPortugues.map((f) => ({
      ...f,
      disciplinaId: DISCIPLINAS.portugues,
      concursoId: CONCURSO_ID,
      dificuldade: 3,
      tipo: "texto",
      revisoes: 0,
      status: "new",
      acertos: 0,
      erros: 0,
      nivelDominio: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...flashcardsRLM.map((f) => ({
      ...f,
      disciplinaId: DISCIPLINAS.rlm,
      concursoId: CONCURSO_ID,
      dificuldade: 3,
      tipo: "texto",
      revisoes: 0,
      status: "new",
      acertos: 0,
      erros: 0,
      nivelDominio: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...flashcardsLegislacaoMPES.map((f) => ({
      ...f,
      disciplinaId: DISCIPLINAS.legislacaoMPES,
      concursoId: CONCURSO_ID,
      dificuldade: 4,
      tipo: "texto",
      revisoes: 0,
      status: "new",
      acertos: 0,
      erros: 0,
      nivelDominio: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...flashcardsAnaliseEstatica.map((f) => ({
      ...f,
      disciplinaId: DISCIPLINAS.analiseEstatica,
      concursoId: CONCURSO_ID,
      dificuldade: 4,
      tipo: "texto",
      revisoes: 0,
      status: "new",
      acertos: 0,
      erros: 0,
      nivelDominio: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...flashcardsLaudos.map((f) => ({
      ...f,
      disciplinaId: DISCIPLINAS.laudosPericia,
      concursoId: CONCURSO_ID,
      dificuldade: 3,
      tipo: "texto",
      revisoes: 0,
      status: "new",
      acertos: 0,
      erros: 0,
      nivelDominio: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    ...flashcardsLegislacaoEtica.map((f) => ({
      ...f,
      disciplinaId: DISCIPLINAS.legislacaoEtica,
      concursoId: CONCURSO_ID,
      dificuldade: 4,
      tipo: "texto",
      revisoes: 0,
      status: "new",
      acertos: 0,
      erros: 0,
      nivelDominio: 0,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  ];

  console.log(
    `📝 Total de flashcards a serem inseridos: ${allFlashcards.length}`,
  );

  let count = 0;
  const batchSize = 20; // Firestore limita a 500 por operação

  for (let i = 0; i < allFlashcards.length; i += batchSize) {
    const batch = allFlashcards.slice(i, i + batchSize);
    const promises = batch.map((flashcard) =>
      addDoc(collection(db, "flashcards"), flashcard),
    );

    try {
      await Promise.all(promises);
      count += batch.length;
      console.log(
        `✅ ${count}/${allFlashcards.length} flashcards inseridos...`,
      );
    } catch (error) {
      console.error("❌ Erro ao inserir lote:", error);

      if (
        error?.code === "permission-denied" ||
        error?.message?.includes("permission")
      ) {
        console.error(
          "💡 O Firestore bloqueou a escrita. Garanta que as regras permitam writes para usuários autenticados e faça deploy delas.",
        );
      }
    }
  }

  console.log("🎉 População concluída!");
  console.log(`📊 Total: ${count} flashcards inseridos.`);
}

// Executa o script
populateFlashcards().catch(console.error);
