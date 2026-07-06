import { useAuth } from "@/src/contexts/AuthContext";
import { mockConcursoService } from "@/src/mocks/concursos.mock";
import { mockDisciplinaService } from "@/src/mocks/disciplinas.mock";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
import { DisciplinaCompleta } from "@/src/types/disciplina.types";
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

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [concursosData, disciplinasData] = await Promise.all([
        mockConcursoService.getAll(),
        mockDisciplinaService.getCompletas(),
      ]);
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
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome} 👋</Text>
          <Text style={styles.subGreeting}>Vamos estudar hoje?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.avatar || "👤"}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{concursos.length}</Text>
          <Text style={styles.statLabel}>Concursos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.green[500] }]}>
            0
          </Text>
          <Text style={styles.statLabel}>Em andamento</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.orange[500] }]}>
            {disciplinas.length}
          </Text>
          <Text style={styles.statLabel}>Disciplinas</Text>
        </View>
      </View>

      {/* Disciplinas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disciplinas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {disciplinas.slice(0, 6).map((disciplina) => (
            <TouchableOpacity
              key={disciplina.id}
              style={styles.disciplinaCard}
              onPress={() => router.push(`/disciplinas/${disciplina.id}`)}
            >
              <Text style={styles.disciplinaIcon}>{disciplina.icone}</Text>
              <Text style={styles.disciplinaNome}>{disciplina.nome}</Text>
              <Text style={styles.disciplinaCount}>
                {disciplina.totalFlashcards}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Concursos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Concursos</Text>
          <TouchableOpacity onPress={() => router.push("/concursos")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {concursos.slice(0, 3).map((concurso) => (
          <TouchableOpacity
            key={concurso.id}
            style={styles.concursoCard}
            onPress={() => router.push(`/concursos/${concurso.id}`)}
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
    </ScrollView>
  );
}

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.gray[800],
  },
  subGreeting: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing["2xl"],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[800],
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: "500",
  },
  disciplinaCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginRight: spacing.md,
    minWidth: 80,
    ...shadows.sm,
  },
  disciplinaIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  disciplinaNome: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.gray[700],
    textAlign: "center",
  },
  disciplinaCount: {
    fontSize: 11,
    color: colors.gray[400],
    marginTop: spacing.xs,
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
    marginTop: spacing.xs,
  },
  concursoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
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
});
