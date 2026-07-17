import {
  concursoCollection,
  disciplinaCollection,
  flashcardCollection,
} from "@/src/services/firebase";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
import { Disciplina } from "@/src/types/disciplina.types";
import { FlashcardReview } from "@/src/types/flashcard.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FlashcardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [flashcard, setFlashcard] = useState<FlashcardReview | null>(null);
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [nivelDominio, setNivelDominio] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [allFlashcards, setAllFlashcards] = useState<FlashcardReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);


 useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // 🔥 Busca o flashcard específico do Firestore
        const flashcardDoc = await getDoc(
          doc(flashcardCollection, id as string)
        );

        if (!flashcardDoc.exists()) {
          Alert.alert("Erro", "Flashcard não encontrado");
          router.back();
          return;
        }

        const flashcardData = {
          id: flashcardDoc.id,
          ...flashcardDoc.data(),
        } as FlashcardReview;

        // 🔥 Busca concurso e disciplina
        const [concursoDoc, disciplinaDoc] = await Promise.all([
          getDoc(doc(concursoCollection, flashcardData.concursoId)),
          getDoc(doc(disciplinaCollection, flashcardData.disciplinaId)),
        ]);

        // 🔥 Busca todos os flashcards da mesma disciplina para navegação
        const allFlashcardsSnapshot = await getDocs(
          query(
            flashcardCollection,
            where("disciplinaId", "==", flashcardData.disciplinaId),
            where("active", "==", true)
          )
        );

        const flashcardsList: FlashcardReview[] = [];
        allFlashcardsSnapshot.forEach((doc) => {
          flashcardsList.push({
            id: doc.id,
            ...doc.data(),
          } as FlashcardReview);
        });

        // Encontra o índice do flashcard atual
        const index = flashcardsList.findIndex((f) => f.id === id);

        setFlashcard(flashcardData);
        setConcurso(concursoDoc.exists() ? ({ id: concursoDoc.id, ...concursoDoc.data() } as Concurso) : null);
        setDisciplina(disciplinaDoc.exists() ? ({ id: disciplinaDoc.id, ...disciplinaDoc.data() } as Disciplina) : null);
        setNivelDominio(flashcardData.nivelDominio || 0);
        setAllFlashcards(flashcardsList);
        setCurrentIndex(index !== -1 ? index : 0);

        // 🔥 Atualiza o título da tela
        // navigation.setOptions({
        //   title: flashcardData.pergunta.length > 25 
        //     ? flashcardData.pergunta.substring(0, 25) + '...' 
        //     : flashcardData.pergunta,
        // });
      } catch (error) {
        console.error("Erro ao carregar flashcard:", error);
        Alert.alert("Erro", "Falha ao carregar o flashcard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleProximo = () => {
    if (currentIndex < allFlashcards.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextFlashcard = allFlashcards[nextIndex];
      router.push(`/flashcards/${nextFlashcard.id}`);
    } else {
      Alert.alert("🎉", "Você revisou todos os flashcards desta disciplina!");
    }
  };

  const handleAnterior = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevFlashcard = allFlashcards[prevIndex];
      router.push(`/flashcards/${prevFlashcard.id}`);
    } else {
      Alert.alert("ℹ️", "Este é o primeiro flashcard");
    }
  };


  const handleShare = async () => {
    if (!flashcard) return;
    try {
      await Share.share({
        message: `📚 ${flashcard.pergunta}\n\n📝 Resposta: ${flashcard.resposta}\n\n📖 Disciplina: ${disciplina?.nome || ""}\n📋 Concurso: ${concurso?.nome || ""}`,
        title: "Flashcard - FlashConcurseiro",
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  

  const handleNivelDominio = (nivel: 0 | 1 | 2 | 3 | 4 | 5) => {
    setNivelDominio(nivel);
    Alert.alert(
      "Progresso Atualizado",
      `Nível de domínio: ${getNivelLabel(nivel)}`,
      [{ text: "OK" }]
    );
    // 🔥 Salva no Firestore
    try {
      // Atualiza o documento do flashcard com o novo nível de domínio
      updateDoc(doc(flashcardCollection, flashcard!.id), {
        nivelDominio: nivel,
        updatedAt: new Date().toISOString(),
      });
      console.log("📊 Nível de domínio atualizado:", nivel);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  };

  const getNivelLabel = (nivel: number): string => {
    const labels: Record<number, string> = {
      0: "Nunca visto",
      1: "Iniciante",
      2: "Básico",
      3: "Intermediário",
      4: "Avançado",
      5: "Dominado",
    };
    return labels[nivel] || "Desconhecido";
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!flashcard) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFound}>Flashcard não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Progresso na disciplina */}
      {allFlashcards.length > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {allFlashcards.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentIndex + 1) / allFlashcards.length) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.badges}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(flashcard.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(flashcard.status)}
              </Text>
            </View>
            <Text style={styles.dificuldadeText}>
              {getDificuldadeStars(flashcard.dificuldade)}
            </Text>
          </View>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareText}>📤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>
            📖 {disciplina?.nome || "Disciplina"}
          </Text>
          <Text style={styles.metaText}>
            📋 {concurso?.nome || "Concurso"}
          </Text>
          <Text style={styles.metaText}>
            🔄 {flashcard.revisoes || 0} revisões
          </Text>
        </View>
      </View>

      {/* Pergunta */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>❓ Pergunta</Text>
        <Text style={styles.questionText}>{flashcard.pergunta}</Text>
      </View>

      {/* Botão Mostrar Resposta */}
      <TouchableOpacity
        style={styles.revealButton}
        onPress={() => setMostrarResposta(!mostrarResposta)}
      >
        <Text style={styles.revealButtonText}>
          {mostrarResposta ? "🙈 Ocultar Resposta" : "👁️ Mostrar Resposta"}
        </Text>
      </TouchableOpacity>

      {/* Resposta */}
      {mostrarResposta && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>📝 Resposta</Text>
          <Text style={styles.answerText}>{flashcard.resposta}</Text>

          {flashcard.dica && (
            <View style={styles.tipContainer}>
              <Text style={styles.tipLabel}>💡 Dica</Text>
              <Text style={styles.tipText}>{flashcard.dica}</Text>
            </View>
          )}
        </View>
      )}

      {/* Nível de Domínio */}
      <View style={styles.dominioContainer}>
        <Text style={styles.dominioLabel}>📊 Nível de Domínio</Text>
        <Text style={styles.dominioAtual}>
          Atual:{" "}
          <Text style={styles.dominioAtualValue}>
            {getNivelLabel(nivelDominio)}
          </Text>
        </Text>
        <View style={styles.dominioButtons}>
          {[0, 1, 2, 3, 4, 5].map((nivel) => (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.dominioButton,
                nivelDominio === nivel && styles.dominioButtonActive,
              ]}
              onPress={() => handleNivelDominio(nivel as 0 | 1 | 2 | 3 | 4 | 5)}
            >
              <Text
                style={[
                  styles.dominioButtonText,
                  nivelDominio === nivel && styles.dominioButtonTextActive,
                ]}
              >
                {nivel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.dominioLabels}>
          <Text style={styles.dominioLabelText}>Iniciante</Text>
          <Text style={styles.dominioLabelText}>Dominado</Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={handleAnterior}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary[500] }]}>
            ⬅️ Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={() => {
            setMostrarResposta(false);
            Alert.alert("✅ Revisão", "Flashcard marcado como revisado!");
            // 🔥 Incrementa o contador de revisões
            // updateDoc(doc(flashcardCollection, flashcard.id), {
            //   revisoes: (flashcard.revisoes || 0) + 1,
            //   ultimaRevisao: new Date().toISOString(),
            //   updatedAt: new Date().toISOString(),
            // });
          }}
        >
          <Text style={styles.actionButtonText}>✅ Revisar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={handleProximo}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary[500] }]}>
            Próximo ➡️
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tags */}
      {flashcard.tags && flashcard.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>🏷️ Tags</Text>
          <View style={styles.tagsWrapper}>
            {flashcard.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  notFound: {
    fontSize: 16,
    color: colors.gray[500],
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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
  shareButton: {
    padding: spacing.sm,
  },
  shareText: {
    fontSize: 22,
  },
  metaInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    gap: spacing.md,
  },
  metaText: {
    fontSize: 13,
    color: colors.gray[500],
  },
  questionContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary[500],
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.gray[800],
    lineHeight: 28,
  },
  revealButton: {
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  revealButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  answerContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.green[600],
    marginBottom: spacing.sm,
  },
  answerText: {
    fontSize: 18,
    color: colors.gray[800],
    lineHeight: 26,
  },
  tipContainer: {
    backgroundColor: colors.orange[500],
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  tipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.orange[600],
    marginBottom: 4,
  },
  tipText: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  dominioContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  dominioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: spacing.xs,
  },
  dominioAtual: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: spacing.md,
  },
  dominioAtualValue: {
    fontWeight: "600",
    color: colors.primary[500],
  },
  dominioButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  dominioButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  dominioButtonActive: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[500],
  },
  dominioButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[500],
  },
  dominioButtonTextActive: {
    color: colors.primary[500],
  },
  dominioLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  dominioLabelText: {
    fontSize: 11,
    color: colors.gray[400],
  },
  actionsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    ...shadows.sm,
  },
  actionButtonPrimary: {
    backgroundColor: colors.green[500],
  },
  actionButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  tagsContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing["3xl"],
    ...shadows.sm,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  tagText: {
    fontSize: 13,
    color: colors.primary[600],
  },
  progressContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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
});
