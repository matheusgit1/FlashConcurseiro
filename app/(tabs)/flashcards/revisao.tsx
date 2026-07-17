import { concursoCollection, disciplinaCollection, flashcardCollection } from "@/src/services/firebase";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
import { Disciplina } from "@/src/types/disciplina.types";
import { FlashcardReview } from "@/src/types/flashcard.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

export default function RevisaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    concurso?: string;
    disciplina?: string;
  }>();

  const [flashcards, setFlashcards] = useState<FlashcardReview[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    acertos: 0,
    erros: 0,
    total: 0,
  });

  // Animações
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    }),
  ).current;

  const likeOpacity = useRef(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 4],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    }),
  ).current;

  const dislikeOpacity = useRef(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp",
    }),
  ).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipe("left");
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const loadData = async () => {
    try {

      const [flashcardsSnapshot, concursosSnapshot, disciplinasSnapshot] =
        await Promise.all([
          getDocs(
            query(flashcardCollection, where("active", "==", true))
          ),
          getDocs(
            query(concursoCollection, where("active", "==", true))
          ),
          getDocs(
            query(
              disciplinaCollection,
              where("active", "==", true),
              orderBy("ordem", "asc")
            )
          ),
        ]);

      const flashcardsData: FlashcardReview[] = [];
      flashcardsSnapshot.forEach((doc) => {
        const data = doc.data();
        flashcardsData.push({
          id: doc.id,
          pergunta: data.pergunta,
          resposta: data.resposta,
          dica: data.dica,
          concursoId: data.concursoId,
          disciplinaId: data.disciplinaId,
          dificuldade: data.dificuldade || 1,
          tags: data.tags || [],
          tipo: data.tipo || "texto",
          midiaUrl: data.midiaUrl,
          revisoes: data.revisoes || 0,
          ultimaRevisao: data.ultimaRevisao,
          proximaRevisao: data.proximaRevisao,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          status: data.status || "new",
          acertos: data.acertos || 0,
          erros: data.erros || 0,
          nivelDominio: data.nivelDominio || 0,
        } as FlashcardReview);
      });

      const concursosData: Concurso[] = [];
      concursosSnapshot.forEach((doc) => {
        const data = doc.data();
        concursosData.push({
          id: doc.id,
          nome: data.nome,
          descricao: data.descricao,
          instituicao: data.instituicao,
          nivel: data.nivel,
          ano: data.ano,
          disciplinas: data.disciplinas || [],
          totalFlashcards: data.totalFlashcards || 0,
          active: data.active || false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Concurso);
      });

      const disciplinasData: Disciplina[] = [];
      disciplinasSnapshot.forEach((doc) => {
        const data = doc.data();
        disciplinasData.push({
          id: doc.id,
          nome: data.nome,
          icone: data.icone,
          cor: data.cor,
          descricao: data.descricao,
          ordem: data.ordem || 0,
          createdAt: data.createdAt,
        } as Disciplina);
      });

      // Filtros
      let filteredFlashcards = flashcardsData;
      if (params.concurso) {
        filteredFlashcards = filteredFlashcards.filter(
          (f: FlashcardReview) => f.concursoId === params.concurso,
        );
      }
      if (params.disciplina) {
        filteredFlashcards = filteredFlashcards.filter(
          (f: FlashcardReview) => f.disciplinaId === params.disciplina,
        );
      }

      // Embaralhar para revisão
      filteredFlashcards = filteredFlashcards.sort(() => Math.random() - 0.5);

      setFlashcards(filteredFlashcards);
      setConcursos(concursosData);
      setDisciplinas(disciplinasData);
      setCurrentIndex(0);
      setConcluido(false);
      setEstatisticas({ acertos: 0, erros: 0, total: filteredFlashcards.length });
    } catch (error) {
      console.error("Erro ao carregar flashcards:", error);
      Alert.alert("Erro", "Falha ao carregar flashcards para revisão");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.concurso, params.disciplina]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const isCorrect = direction === "right";
    const currentCard = flashcards[currentIndex];

    if (!currentCard) return;

    // Atualiza estatísticas
    setEstatisticas((prev) => ({
      ...prev,
      acertos: isCorrect ? prev.acertos + 1 : prev.acertos,
      erros: isCorrect ? prev.erros : prev.erros + 1,
    }));

    try {
      const cardRef = doc(flashcardCollection, currentCard.id);
      const newAcertos = (currentCard.acertos || 0) + (isCorrect ? 1 : 0);
      const newErros = (currentCard.erros || 0) + (isCorrect ? 0 : 1);
      const newRevisoes = (currentCard.revisoes || 0) + 1;
      
      // Calcula novo status baseado no desempenho
      let newStatus = currentCard.status;
      const taxaAcerto = newAcertos / (newAcertos + newErros);
      
      if (newRevisoes >= 3 && taxaAcerto >= 0.8) {
        newStatus = "mastered";
      } else if (newRevisoes >= 1 && taxaAcerto >= 0.6) {
        newStatus = "review";
      } else if (newRevisoes >= 1) {
        newStatus = "learning";
      }

      await updateDoc(cardRef, {
        acertos: newAcertos,
        erros: newErros,
        revisoes: newRevisoes,
        ultimaRevisao: new Date().toISOString(),
        status: newStatus,
        nivelDominio: Math.round(taxaAcerto * 100),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar flashcard:", error);
    }

    // Reseta posição
    position.setValue({ x: 0, y: 0 });

    // Próximo card
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setMostrarResposta(false);
    } else {
      setConcluido(true);
    }
  };

  const handleButtonPress = (direction: "left" | "right") => {
    // Anima o card na direção escolhida
    Animated.spring(position, {
      toValue: {
        x: direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
        y: 0,
      },
      friction: 4,
      useNativeDriver: false,
    }).start(() => {
      handleSwipe(direction);
    });
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

  const reiniciarRevisao = () => {
    setCurrentIndex(0);
    setConcluido(false);
    setEstatisticas({ acertos: 0, erros: 0, total: flashcards.length });
    // Embaralha novamente
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setMostrarResposta(false);
    position.setValue({ x: 0, y: 0 });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Preparando revisão...</Text>
      </View>
    );
  }

  if (flashcards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎯</Text>
        <Text style={styles.emptyTitle}>Nada para revisar</Text>
        <Text style={styles.emptyDescription}>
          Você já revisou todos os flashcards disponíveis.
          {"\n"}Volte mais tarde para novas revisões!
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.back()}
        >
          <Text style={styles.emptyButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (concluido) {
    const taxaAcerto =
      estatisticas.total > 0
        ? Math.round((estatisticas.acertos / estatisticas.total) * 100)
        : 0;

    return (
      <ScrollView
        style={styles.concluidoContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.concluidoHeader}>
          <Text style={styles.concluidoIcon}>🎉</Text>
          <Text style={styles.concluidoTitle}>Revisão Concluída!</Text>
          <Text style={styles.concluidoSubtitle}>
            Você revisou todos os flashcards
          </Text>
        </View>

        <View style={styles.concluidoStats}>
          <View style={styles.concluidoStat}>
            <Text
              style={[styles.concluidoStatNumber, { color: colors.green[500] }]}
            >
              {estatisticas.acertos}
            </Text>
            <Text style={styles.concluidoStatLabel}>Acertos</Text>
          </View>
          <View style={styles.concluidoStat}>
            <Text
              style={[styles.concluidoStatNumber, { color: colors.red[500] }]}
            >
              {estatisticas.erros}
            </Text>
            <Text style={styles.concluidoStatLabel}>Erros</Text>
          </View>
          <View style={styles.concluidoStat}>
            <Text
              style={[
                styles.concluidoStatNumber,
                { color: colors.primary[500] },
              ]}
            >
              {estatisticas.total}
            </Text>
            <Text style={styles.concluidoStatLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.concluidoTaxa}>
          <Text style={styles.concluidoTaxaLabel}>Taxa de Acerto</Text>
          <Text style={styles.concluidoTaxaValor}>{taxaAcerto}%</Text>
          <View style={styles.concluidoBarra}>
            <View
              style={[
                styles.concluidoBarraFill,
                {
                  width: `${Math.min(taxaAcerto, 100)}%`,
                  backgroundColor:
                    taxaAcerto >= 70
                      ? colors.green[500]
                      : taxaAcerto >= 40
                        ? colors.orange[500]
                        : colors.red[500],
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.concluidoButtons}>
          <TouchableOpacity
            style={styles.reiniciarButton}
            onPress={reiniciarRevisao}
          >
            <Text style={styles.reiniciarButtonText}>🔄 Revisar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => router.back()}
          >
            <Text style={styles.voltarButtonText}>📚 Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <View style={styles.container}>
      {/* Progresso */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {flashcards.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / flashcards.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Card Principal */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotate },
            ],
          },
        ]}
      >
        {/* Indicadores de Swipe */}
        <Animated.Text
          style={[
            styles.swipeIndicator,
            styles.swipeLike,
            { opacity: likeOpacity },
          ]}
        >
          ✅
        </Animated.Text>
        <Animated.Text
          style={[
            styles.swipeIndicator,
            styles.swipeDislike,
            { opacity: dislikeOpacity },
          ]}
        >
          ❌
        </Animated.Text>

        {/* Status e Dificuldade */}
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(currentCard.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(currentCard.status)}
            </Text>
          </View>
          <Text style={styles.dificuldadeText}>
            {getDificuldadeStars(currentCard.dificuldade)}
          </Text>
        </View>

        {/* Pergunta */}
        <View style={styles.cardQuestion}>
          <Text style={styles.cardQuestionLabel}>❓ Pergunta</Text>
          <Text style={styles.cardQuestionText}>{currentCard.pergunta}</Text>
        </View>

        {/* Resposta */}
        {mostrarResposta && (
          <View style={styles.cardAnswer}>
            <Text style={styles.cardAnswerLabel}>📝 Resposta</Text>
            <Text style={styles.cardAnswerText}>{currentCard.resposta}</Text>
            {currentCard.dica && (
              <View style={styles.cardTip}>
                <Text style={styles.cardTipLabel}>💡 Dica</Text>
                <Text style={styles.cardTipText}>{currentCard.dica}</Text>
              </View>
            )}
          </View>
        )}

        {/* Botão Mostrar Resposta */}
        {!mostrarResposta && (
          <TouchableOpacity
            style={styles.revealButton}
            onPress={() => setMostrarResposta(true)}
          >
            <Text style={styles.revealButtonText}>👁️ Mostrar Resposta</Text>
          </TouchableOpacity>
        )}

        {/* Meta Info */}
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>
            {getDisciplinaNome(currentCard.disciplinaId)}
          </Text>
          <Text style={styles.cardMetaText}>
            {getConcursoNome(currentCard.concursoId)}
          </Text>
        </View>
      </Animated.View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonErro]}
          onPress={() => handleButtonPress("left")}
        >
          <Text style={styles.actionButtonText}>❌</Text>
          <Text style={[styles.actionButtonLabel, { color: colors.red[500] }]}>
            Errei
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonAcerto]}
          onPress={() => handleButtonPress("right")}
        >
          <Text style={styles.actionButtonText}>✅</Text>
          <Text
            style={[styles.actionButtonLabel, { color: colors.green[500] }]}
          >
            Acertei
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dica de Swipe */}
      <Text style={styles.swipeHint}>← Deslize para responder →</Text>
    </View>
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
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing["2xl"],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing["2xl"],
  },
  emptyButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressText: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.lg,
    position: "relative",
  },
  swipeIndicator: {
    position: "absolute",
    top: 40,
    fontSize: 48,
    zIndex: 10,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  swipeLike: {
    right: 20,
  },
  swipeDislike: {
    left: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  dificuldadeText: {
    fontSize: 14,
  },
  cardQuestion: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  cardQuestionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary[500],
    marginBottom: spacing.sm,
  },
  cardQuestionText: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.gray[800],
    lineHeight: 30,
  },
  cardAnswer: {
    backgroundColor: colors.green[500],
    padding: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  cardAnswerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.green[600],
    marginBottom: spacing.xs,
  },
  cardAnswerText: {
    fontSize: 18,
    color: colors.gray[800],
    lineHeight: 26,
  },
  cardTip: {
    backgroundColor: colors.orange[500],
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  cardTipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.orange[600],
  },
  cardTipText: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 20,
  },
  revealButton: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  revealButtonText: {
    color: colors.primary[600],
    fontSize: 16,
    fontWeight: "600",
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    marginTop: spacing.sm,
  },
  cardMetaText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 2,
  },
  actionButtonErro: {
    backgroundColor: colors.red[500],
    borderColor: colors.red[200],
  },
  actionButtonAcerto: {
    backgroundColor: colors.green[500],
    borderColor: colors.green[200],
  },
  actionButtonText: {
    fontSize: 24,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  swipeHint: {
    textAlign: "center",
    color: colors.gray[400],
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  // Concluído
  concluidoContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
    paddingHorizontal: spacing.lg,
  },
  concluidoHeader: {
    alignItems: "center",
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["2xl"],
  },
  concluidoIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  concluidoTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.gray[800],
  },
  concluidoSubtitle: {
    fontSize: 16,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  concluidoStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadows.sm,
    marginBottom: spacing.lg,
  },
  concluidoStat: {
    alignItems: "center",
  },
  concluidoStatNumber: {
    fontSize: 32,
    fontWeight: "700",
  },
  concluidoStatLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  concluidoTaxa: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadows.sm,
    marginBottom: spacing.lg,
  },
  concluidoTaxaLabel: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: "center",
  },
  concluidoTaxaValor: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.primary[500],
    textAlign: "center",
    marginVertical: spacing.sm,
  },
  concluidoBarra: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  concluidoBarraFill: {
    height: "100%",
    borderRadius: 4,
  },
  concluidoButtons: {
    gap: spacing.md,
  },
  reiniciarButton: {
    backgroundColor: colors.primary[500],
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
  },
  reiniciarButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  voltarButton: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  voltarButtonText: {
    color: colors.gray[600],
    fontSize: 16,
    fontWeight: "500",
  },
});
