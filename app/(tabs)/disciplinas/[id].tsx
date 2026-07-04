// import { mockConcursoService } from "@/mocks/concursos.mock";
// import { mockDisciplinaService } from "@/mocks/disciplinas.mock";
// import { mockFlashcardService } from "@/mocks/flashcards.mock";
// import { colors, shadows, spacing } from "@/styles/theme";
// import { Concurso } from "@/types/concurso.types";
// import { DisciplinaCompleta } from "@/types/disciplina.types";
// import { FlashcardReview } from "@/types/flashcard.types";
import { mockConcursoService } from "@/src/mocks/concursos.mock";
import { mockDisciplinaService } from "@/src/mocks/disciplinas.mock";
import { mockFlashcardService } from "@/src/mocks/flashcards.mock";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
import { DisciplinaCompleta } from "@/src/types/disciplina.types";
import { FlashcardReview } from "@/src/types/flashcard.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DisciplinaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [disciplina, setDisciplina] = useState<DisciplinaCompleta | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardReview[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!id) return;

    try {
      const [disciplinaData, flashcardsData, concursosData] = await Promise.all(
        [
          mockDisciplinaService
            .getCompletas()
            .then((ds) => ds.find((d) => d.id === id)),
          mockFlashcardService.getByDisciplinaId(id),
          mockConcursoService.getAll(),
        ],
      );

      setDisciplina(disciplinaData || null);
      setFlashcards(flashcardsData as FlashcardReview[]);

      // Filtrar concursos que têm essa disciplina
      const concursosComDisciplina = concursosData.filter((c) =>
        c.disciplinas.includes(id),
      );
      setConcursos(concursosComDisciplina);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!disciplina) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFound}>Disciplina não encontrada</Text>
      </View>
    );
  }

  // Estatísticas
  const totalFlashcards = flashcards.length;
  const masteredCount = flashcards.filter((f) => f.nivelDominio >= 4).length;
  const learningCount = flashcards.filter(
    (f) => f.status === "learning",
  ).length;
  const newCount = flashcards.filter((f) => f.status === "new").length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header da Disciplina */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: disciplina.cor + "20" },
          ]}
        >
          <Text style={styles.icon}>{disciplina.icone}</Text>
        </View>
        <Text style={styles.title}>{disciplina.nome}</Text>
        <Text style={styles.description}>{disciplina.descricao}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalFlashcards}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.green[500] }]}>
            {masteredCount}
          </Text>
          <Text style={styles.statLabel}>Dominados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.orange[500] }]}>
            {learningCount}
          </Text>
          <Text style={styles.statLabel}>Aprendendo</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statNumber,
              { color: colors.blue[500] || "#3B82F6" },
            ]}
          >
            {newCount}
          </Text>
          <Text style={styles.statLabel}>Novos</Text>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.primary[500] },
          ]}
          onPress={() =>
            router.push(`/flashcards?disciplina=${disciplina.id}` as any)
          }
        >
          <Text style={styles.actionButtonText}>📚 Ver Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.green[500] }]}
          onPress={() =>
            router.push(`/flashcards/revisao?disciplina=${disciplina.id}`)
          }
        >
          <Text style={styles.actionButtonText}>🔄 Revisar</Text>
        </TouchableOpacity>
      </View>

      {/* Concursos que têm essa disciplina */}
      {concursos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Concursos</Text>
          {concursos.map((concurso) => (
            <TouchableOpacity
              key={concurso.id}
              style={styles.concursoCard}
              onPress={() => router.push(`/concursos/${concurso.id}` as any)}
            >
              <Text style={styles.concursoNome}>{concurso.nome}</Text>
              <Text style={styles.concursoInstituicao}>
                {concurso.instituicao}
              </Text>
              <View style={styles.concursoFooter}>
                <Text style={styles.concursoMeta}>
                  {concurso.nivel.toUpperCase()} • {concurso.ano}
                </Text>
                <Text style={styles.concursoFlashcards}>
                  {concurso.totalFlashcards} flashcards
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Últimos Flashcards */}
      {flashcards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🃏 Últimos Flashcards</Text>
          {flashcards.slice(0, 5).map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.flashcardCard}
              onPress={() => router.push(`/flashcards/${card.id}` as any)}
            >
              <View style={styles.flashcardHeader}>
                <Text style={styles.flashcardPergunta} numberOfLines={2}>
                  {card.pergunta}
                </Text>
                <View style={[styles.statusBadge, getStatusStyle(card.status)]}>
                  <Text style={styles.statusText}>
                    {getStatusLabel(card.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.flashcardFooter}>
                <Text style={styles.flashcardDificuldade}>
                  {"⭐".repeat(card.dificuldade)}
                </Text>
                <Text style={styles.flashcardRevisoes}>
                  {card.revisoes} revisões
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Funções auxiliares para status
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    new: "Novo",
    learning: "Aprendendo",
    review: "Revisão",
    mastered: "Dominado",
  };
  return labels[status] || status;
};

const getStatusStyle = (status: string) => {
  const styles: Record<string, any> = {
    new: { backgroundColor: colors.gray[200] },
    learning: { backgroundColor: colors.orange[500] },
    review: { backgroundColor: colors.blue[500] || "#3B82F6" },
    mastered: { backgroundColor: colors.green[500] },
  };
  return styles[status] || styles.new;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
    paddingHorizontal: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  notFound: {
    fontSize: 16,
    color: colors.gray[500],
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing["2xl"],
    borderRadius: 12,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
    ...shadows.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.gray[800],
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 2,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray[500],
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    ...shadows.sm,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  concursoCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  concursoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
  },
  concursoInstituicao: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  concursoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  concursoMeta: {
    fontSize: 12,
    color: colors.gray[400],
  },
  concursoFlashcards: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: "500",
  },
  flashcardCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  flashcardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  flashcardPergunta: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.gray[800],
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.white,
  },
  flashcardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  flashcardDificuldade: {
    fontSize: 12,
  },
  flashcardRevisoes: {
    fontSize: 12,
    color: colors.gray[400],
  },
});
