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
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FlashcardsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    concurso?: string;
    disciplina?: string;
  }>();

  const [flashcards, setFlashcards] = useState<FlashcardReview[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<
    FlashcardReview[]
  >([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConcurso, setSelectedConcurso] = useState<string>(
    params.concurso || "",
  );
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>(
    params.disciplina || "",
  );
  const [filterDificuldade, setFilterDificuldade] = useState<number | null>(
    null,
  );

  const loadData = async () => {
    try {
      // Carrega todos os dados em paralelo
      const [flashcardsData, concursosData, disciplinasData] =
        await Promise.all([
          mockFlashcardService.getForReview(),
          mockConcursoService.getAll(),
          mockDisciplinaService.getAll(),
        ]);

      setFlashcards(flashcardsData as FlashcardReview[]);
      setConcursos(concursosData);
      setDisciplinas(disciplinasData);

      // Aplica filtros iniciais
      applyFilters(
        flashcardsData as FlashcardReview[],
        params.concurso,
        params.disciplina,
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (
    data: FlashcardReview[],
    concursoId?: string,
    disciplinaId?: string,
  ) => {
    let filtered = [...data];

    // Filtro por concurso
    if (concursoId || selectedConcurso) {
      const id = concursoId || selectedConcurso;
      filtered = filtered.filter((f) => f.concursoId === id);
    }

    // Filtro por disciplina
    if (disciplinaId || selectedDisciplina) {
      const id = disciplinaId || selectedDisciplina;
      filtered = filtered.filter((f) => f.disciplinaId === id);
    }

    // Filtro por dificuldade
    if (filterDificuldade) {
      filtered = filtered.filter((f) => f.dificuldade === filterDificuldade);
    }

    // Filtro por busca (pergunta)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (f) =>
          f.pergunta.toLowerCase().includes(term) ||
          f.resposta.toLowerCase().includes(term),
      );
    }

    setFilteredFlashcards(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters(flashcards);
  }, [searchTerm, selectedConcurso, selectedDisciplina, filterDificuldade]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      new: "Novo",
      learning: "Aprendendo",
      review: "Revisão",
      mastered: "Dominado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      new: "#9CA3AF",
      learning: "#F59E0B",
      review: "#3B82F6",
      mastered: "#10B981",
    };
    return colors[status] || "#9CA3AF";
  };

  const getDificuldadeStars = (dificuldade: number): string => {
    return "⭐".repeat(dificuldade);
  };

  const getConcursoNome = (concursoId: string): string => {
    const concurso = concursos.find((c) => c.id === concursoId);
    return concurso?.nome || concursoId;
  };

  const getDisciplinaNome = (disciplinaId: string): string => {
    const disciplina = disciplinas.find((d) => d.id === disciplinaId);
    return disciplina?.nome || disciplinaId;
  };

  const getDisciplinaIcon = (disciplinaId: string): string => {
    const disciplina = disciplinas.find((d) => d.id === disciplinaId);
    return disciplina?.icone || "📄";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedConcurso("");
    setSelectedDisciplina("");
    setFilterDificuldade(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar flashcards..."
          placeholderTextColor={colors.gray[400]}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedConcurso &&
              !selectedDisciplina &&
              !filterDificuldade &&
              styles.filterChipActive,
          ]}
          onPress={clearFilters}
        >
          <Text
            style={[
              styles.filterChipText,
              !selectedConcurso &&
                !selectedDisciplina &&
                !filterDificuldade &&
                styles.filterChipTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedConcurso && styles.filterChipActive,
          ]}
          onPress={() => {
            if (selectedConcurso) {
              setSelectedConcurso("");
            } else {
              // Mostra um alerta ou abre um modal para selecionar concurso
              // Por enquanto, vamos apenas limpar ou definir um valor fixo para demo
              setSelectedConcurso("bb_2025");
            }
          }}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedConcurso && styles.filterChipTextActive,
            ]}
          >
            {selectedConcurso
              ? getConcursoNome(selectedConcurso).substring(0, 15)
              : "📚 Concurso"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedDisciplina && styles.filterChipActive,
          ]}
          onPress={() => {
            if (selectedDisciplina) {
              setSelectedDisciplina("");
            } else {
              setSelectedDisciplina("portugues");
            }
          }}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedDisciplina && styles.filterChipTextActive,
            ]}
          >
            {selectedDisciplina
              ? getDisciplinaIcon(selectedDisciplina) +
                " " +
                getDisciplinaNome(selectedDisciplina).substring(0, 12)
              : "📖 Disciplina"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            // filterDificuldade && styles.filterChipActive,
          ]}
          onPress={() => {
            if (filterDificuldade) {
              setFilterDificuldade(null);
            } else {
              setFilterDificuldade(3);
            }
          }}
        >
          <Text
            style={[
              styles.filterChipText,
              // filterDificuldade && styles.filterChipTextActive,
            ]}
          >
            {filterDificuldade ? `⭐ ${filterDificuldade}` : "⭐ Dificuldade"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredFlashcards.length} flashcards
          {flashcards.length !== filteredFlashcards.length &&
            ` (de ${flashcards.length})`}
        </Text>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={styles.clearFiltersText}>Limpar filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Flashcards */}
      <FlatList
        data={filteredFlashcards}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🃏</Text>
            <Text style={styles.emptyTitle}>Nenhum flashcard encontrado</Text>
            <Text style={styles.emptyDescription}>
              Tente ajustar os filtros ou buscar por outro termo
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/flashcards/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardBadges}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
                <Text style={styles.dificuldadeText}>
                  {getDificuldadeStars(item.dificuldade)}
                </Text>
              </View>
              <Text style={styles.revisoesText}>{item.revisoes} revisões</Text>
            </View>

            <Text style={styles.pergunta} numberOfLines={3}>
              {item.pergunta}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>
                  {getDisciplinaIcon(item.disciplinaId)}{" "}
                  {getDisciplinaNome(item.disciplinaId)}
                </Text>
              </View>
              <Text style={styles.concursoText}>
                {getConcursoNome(item.concursoId)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  searchInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.gray[800],
  },
  filtersContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
  },
  filterChipText: {
    fontSize: 13,
    color: colors.gray[600],
  },
  filterChipTextActive: {
    color: colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  statsText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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
  dificuldadeText: {
    fontSize: 12,
  },
  revisoesText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  pergunta: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.gray[800],
    lineHeight: 22,
    marginVertical: spacing.xs,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: colors.gray[500],
  },
  concursoText: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing["3xl"],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[700],
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.gray[400],
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
