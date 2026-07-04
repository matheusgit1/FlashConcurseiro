import { mockConcursoService } from "@/src/mocks/concursos.mock";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
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
// import { mockConcursoService } from '@/mocks/concursos.mock';
// import { Concurso } from '@/types/concurso.types';
// import { colors, spacing, shadows } from '@/styles/theme';

export default function ConcursosListScreen() {
  const router = useRouter();
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await mockConcursoService.getAll();
      setConcursos(data);
    } catch (error) {
      console.error("Erro ao carregar concursos:", error);
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
      {concursos.map((concurso) => (
        <TouchableOpacity
          key={concurso.id}
          style={styles.card}
          onPress={() => router.push(`/concursos/${concurso.id}` as any)}
        >
          <Text style={styles.title}>{concurso.nome}</Text>
          <Text style={styles.instituicao}>{concurso.instituicao}</Text>
          <View style={styles.footer}>
            <Text style={styles.meta}>
              {concurso.nivel.toUpperCase()} • {concurso.ano}
            </Text>
            <Text style={styles.flashcards}>
              {concurso.totalFlashcards} flashcards
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[800],
  },
  instituicao: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  meta: {
    fontSize: 12,
    color: colors.gray[400],
  },
  flashcards: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: "500",
  },
});
