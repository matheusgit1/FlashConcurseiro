// import { mockConcursoService } from "@/mocks/concursos.mock";
// import { mockDisciplinaService } from "@/mocks/disciplinas.mock";
// import { mockFlashcardService } from "@/mocks/flashcards.mock";
// import { colors, shadows, spacing } from "@/styles/theme";
// import { Concurso } from "@/types/concurso.types";
// import { Disciplina } from "@/types/disciplina.types";
// import { FlashcardReview } from "@/types/flashcard.types";
import { mockConcursoService } from "@/src/mocks/concursos.mock";
import { mockDisciplinaService } from "@/src/mocks/disciplinas.mock";
import { mockFlashcardService } from "@/src/mocks/flashcards.mock";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
import { Disciplina } from "@/src/types/disciplina.types";
import { FlashcardReview } from "@/src/types/flashcard.types";
import { useRouter } from "expo-router";
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

export default function EstatisticasScreen() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<FlashcardReview[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState<
    "7d" | "30d" | "90d" | "all"
  >("all");

  const loadData = async () => {
    try {
      const [flashcardsData, concursosData, disciplinasData] =
        await Promise.all([
          mockFlashcardService.getForReview(),
          mockConcursoService.getAll(),
          mockDisciplinaService.getAll(),
        ]);

      setFlashcards(flashcardsData as FlashcardReview[]);
      setConcursos(concursosData);
      setDisciplinas(disciplinasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Cálculo das estatísticas
  const totalFlashcards = flashcards.length;
  const masteredCount = flashcards.filter((f) => f.nivelDominio >= 4).length;
  const learningCount = flashcards.filter(
    (f) => f.status === "learning",
  ).length;
  const newCount = flashcards.filter((f) => f.status === "new").length;
  const reviewCount = flashcards.filter((f) => f.status === "review").length;

  // Taxa de acerto geral (mock)
  const taxaAcertoTotal =
    flashcards.length > 0
      ? Math.round(
          (flashcards.reduce(
            (acc, f) => acc + f.acertos / (f.acertos + f.erros || 1),
            0,
          ) /
            flashcards.length) *
            100,
        )
      : 0;

  // Média de dificuldade
  const mediaDificuldade =
    flashcards.length > 0
      ? (
          flashcards.reduce((acc, f) => acc + f.dificuldade, 0) /
          flashcards.length
        ).toFixed(1)
      : "0";

  // Flashcards por disciplina
  const flashcardsPorDisciplina = disciplinas.map((d) => ({
    ...d,
    count: flashcards.filter((f) => f.disciplinaId === d.id).length,
    mastered: flashcards.filter(
      (f) => f.disciplinaId === d.id && f.nivelDominio >= 4,
    ).length,
  }));

  // Flashcards por concurso
  const flashcardsPorConcurso = concursos.map((c) => ({
    ...c,
    count: flashcards.filter((f) => f.concursoId === c.id).length,
    mastered: flashcards.filter(
      (f) => f.concursoId === c.id && f.nivelDominio >= 4,
    ).length,
  }));

  // Distribuição por dificuldade
  const distribuicaoDificuldade = [1, 2, 3, 4, 5].map((n) => ({
    nivel: n,
    count: flashcards.filter((f) => f.dificuldade === n).length,
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Estatísticas</Text>
        <Text style={styles.subtitle}>Acompanhe seu progresso</Text>
      </View>

      {/* Cards de Resumo */}
      <View style={styles.statsGrid}>
        <View
          style={[styles.statCard, { backgroundColor: colors.primary[50] }]}
        >
          <Text style={[styles.statNumber, { color: colors.primary[500] }]}>
            {totalFlashcards}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.green[500] }]}>
          <Text style={[styles.statNumber, { color: colors.green[500] }]}>
            {masteredCount}
          </Text>
          <Text style={styles.statLabel}>Dominados</Text>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: colors.orange[500] }]}
        >
          <Text style={[styles.statNumber, { color: colors.orange[500] }]}>
            {learningCount}
          </Text>
          <Text style={styles.statLabel}>Aprendendo</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.gray[100] }]}>
          <Text style={[styles.statNumber, { color: colors.gray[600] }]}>
            {newCount}
          </Text>
          <Text style={styles.statLabel}>Novos</Text>
        </View>
      </View>

      {/* Métricas Adicionais */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{taxaAcertoTotal}%</Text>
          <Text style={styles.metricLabel}>Taxa de Acerto</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{mediaDificuldade}</Text>
          <Text style={styles.metricLabel}>Dificuldade Média</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{reviewCount}</Text>
          <Text style={styles.metricLabel}>Pendentes</Text>
        </View>
      </View>

      {/* Distribuição por Disciplina */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Por Disciplina</Text>
        {flashcardsPorDisciplina
          .filter((d) => d.count > 0)
          .sort((a, b) => b.count - a.count)
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.barItem}
              onPress={() => router.push(`/disciplinas/${item.id}`)}
            >
              <View style={styles.barHeader}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barIcon}>{item.icone}</Text>
                  <Text style={styles.barLabel}>{item.nome}</Text>
                </View>
                <Text style={styles.barCount}>
                  {item.mastered}/{item.count}
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(item.mastered / item.count) * 100}%`,
                      backgroundColor: item.cor,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
      </View>

      {/* Distribuição por Concurso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Por Concurso</Text>
        {flashcardsPorConcurso
          .filter((c) => c.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.barItem}
              onPress={() => router.push(`/concursos/${item.id}`)}
            >
              <View style={styles.barHeader}>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={styles.barCount}>
                  {item.mastered}/{item.count}
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(item.mastered / item.count) * 100}%`,
                      backgroundColor: colors.primary[400],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        {flashcardsPorConcurso.filter((c) => c.count > 0).length === 0 && (
          <Text style={styles.emptyText}>Nenhum flashcard encontrado</Text>
        )}
      </View>

      {/* Distribuição por Dificuldade */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Por Dificuldade</Text>
        <View style={styles.dificuldadeContainer}>
          {distribuicaoDificuldade.map((item) => {
            const percent =
              totalFlashcards > 0 ? (item.count / totalFlashcards) * 100 : 0;
            return (
              <View key={item.nivel} style={styles.dificuldadeItem}>
                <Text style={styles.dificuldadeLabel}>
                  {"⭐".repeat(item.nivel)}
                </Text>
                <View style={styles.dificuldadeTrack}>
                  <View
                    style={[
                      styles.dificuldadeFill,
                      {
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor:
                          item.nivel <= 2
                            ? colors.green[500]
                            : item.nivel <= 3
                              ? colors.orange[500]
                              : colors.red[500],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dificuldadeCount}>{item.count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Status dos Flashcards */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>🔄 Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#9CA3AF" }]} />
            <Text style={styles.statusLabel}>Novos</Text>
            <Text style={styles.statusValue}>{newCount}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#F59E0B" }]} />
            <Text style={styles.statusLabel}>Aprendendo</Text>
            <Text style={styles.statusValue}>{learningCount}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#3B82F6" }]} />
            <Text style={styles.statusLabel}>Revisão</Text>
            <Text style={styles.statusValue}>{reviewCount}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: "#10B981" }]} />
            <Text style={styles.statusLabel}>Dominados</Text>
            <Text style={styles.statusValue}>{masteredCount}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.gray[800],
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 2,
  },
  metricsContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.gray[800],
  },
  metricLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
  },
  section: {
    marginBottom: spacing.lg,
  },
  lastSection: {
    marginBottom: spacing["3xl"],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  barItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  barLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  barIcon: {
    fontSize: 18,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    flex: 1,
  },
  barCount: {
    fontSize: 12,
    color: colors.gray[500],
    fontWeight: "500",
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  emptyText: {
    textAlign: "center",
    color: colors.gray[400],
    fontSize: 14,
    paddingVertical: spacing.md,
  },
  dificuldadeContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.sm,
  },
  dificuldadeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  dificuldadeLabel: {
    fontSize: 14,
    minWidth: 60,
  },
  dificuldadeTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  dificuldadeFill: {
    height: "100%",
    borderRadius: 4,
  },
  dificuldadeCount: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[600],
    minWidth: 30,
    textAlign: "right",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.sm,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[600],
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
  },
});
