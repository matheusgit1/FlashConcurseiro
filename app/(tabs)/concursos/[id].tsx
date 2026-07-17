import {
  concursoCollection,
  disciplinaCollection,
  flashcardCollection,
} from "@/src/services/firebase";
import { colors, shadows, spacing } from "@/src/styles/theme";
import { Concurso } from "@/src/types/concurso.types";
import { Disciplina } from "@/src/types/disciplina.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConcursoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalFlashcards, setTotalFlashcards] = useState<number>(0);
  console.log("Concurso ID:", id);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const [concursoSnapshot, disciplinasSnapshot, flashcardsSnapshot] =
          await Promise.all([
     
            getDocs(
              query(
                concursoCollection,
                where("id", "==", id.trim()),
                where("active", "==", true),
              ),
            ),

            getDocs(
              query(
                disciplinaCollection,
                where("active", "==", true),
                orderBy("ordem", "asc"),
              ),
            ),
       
            getDocs(
              query(flashcardCollection, where("concursoId", "==", id.trim())),
            ),
          ]);

        console.log(
          "Concurso Snapshot:",
          concursoSnapshot.docs.map((doc) => doc.data()),
        );
        console.log(
          "Disciplinas Snapshot:",
          disciplinasSnapshot.docs.map((doc) => doc.data()),
        );
        console.log(
          "Flashcards Snapshot:",
          flashcardsSnapshot.docs.map((doc) => doc.data()),
        );

      
        let concursoData: Concurso = {
          id: "",
          nome: "",
          descricao: "",
          instituicao: "",
          nivel: "fundamental",
          ano: 0,
          disciplinas: [],
          totalFlashcards: 0,
          active: false,
        };
        concursoSnapshot.forEach((doc) => {
          const data = doc.data();
          concursoData = {
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
          } as Concurso;
        });

        if (!concursoData) {
          setLoading(false);
          return;
        }

     
        const disciplinasData: Disciplina[] = [];
        const disciplinasIds = concursoData.disciplinas || [];

        disciplinasSnapshot.forEach((doc) => {
          const data = doc.data();
          if (disciplinasIds.includes(doc.id)) {
            disciplinasData.push({
              id: doc.id,
              nome: data.nome,
              icone: data.icone,
              cor: data.cor,
              descricao: data.descricao,
              ordem: data.ordem,
              createdAt: data.createdAt,
            } as Disciplina);
          }
        });

 
        disciplinasData.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

        let total = 0;
        flashcardsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.concursoId === id) {
            total++;
          }
        });

        setConcurso(concursoData);
        setDisciplinas(disciplinasData);
        setTotalFlashcards(total);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!concurso) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFound}>Concurso não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{concurso.nome}</Text>
        <Text style={styles.instituicao}>{concurso.instituicao}</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{concurso.nivel}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.gray[100] }]}>
            <Text style={[styles.tagText, { color: colors.gray[600] }]}>
              {concurso.ano}
            </Text>
          </View>
        </View>
        <Text style={styles.descricao}>{concurso.descricao}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{disciplinas.length}</Text>
            <Text style={styles.statLabel}>Disciplinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{totalFlashcards}</Text>
            <Text style={styles.statLabel}>Flashcards</Text>
          </View>
        </View>
      </View>

      {/* Disciplinas */}
      <Text style={styles.sectionTitle}>Disciplinas</Text>
      {disciplinas.map((disciplina) => (
        <TouchableOpacity
          key={disciplina.id}
          style={styles.disciplinaItem}
          onPress={() =>
            router.push(
              `/flashcards?concurso=${concurso.id}&disciplina=${disciplina.id}`,
            )
          }
        >
          <View style={styles.disciplinaIconContainer}>
            <Text style={styles.disciplinaIcon}>{disciplina.icone}</Text>
          </View>
          <View style={styles.disciplinaContent}>
            <Text style={styles.disciplinaNome}>{disciplina.nome}</Text>
            <Text style={styles.disciplinaDescricao}>
              {disciplina.descricao}
            </Text>
          </View>
          {/* <Text style={styles.disciplinaCount}>{flashcards}</Text> */}
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
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.gray[800],
  },
  instituicao: {
    fontSize: 16,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  tags: {
    flexDirection: "row",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary[600],
    fontWeight: "500",
  },
  descricao: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.md,
    lineHeight: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  disciplinaItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  },
  disciplinaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    backgroundColor: colors.gray[100],
  },
  disciplinaIcon: {
    fontSize: 24,
  },
  disciplinaContent: {
    flex: 1,
  },
  disciplinaNome: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.gray[800],
  },
  disciplinaDescricao: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  disciplinaCount: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: "500",
  },
});
