import { useAuth } from "@/src/contexts/AuthContext";
import { colors, spacing } from "@/src/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("joao@email.com");
  const [senha, setSenha] = useState("123456");

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await login(email, senha);
      router.replace("/(tabs)/home" as any);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha no login");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FlashConcurseiro</Text>
          <Text style={styles.subtitle}>
            Estude para concursos com flashcards
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.gray[400]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor={colors.gray[400]}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => router.push("/registro")}>
            <Text style={styles.registerLink}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity> */}
        </View>

        <Text style={styles.mockHint}>
          Mock: joao@email.com | qualquer senha
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
  },
  header: {
    marginBottom: spacing["3xl"],
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary[600],
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: "center",
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  registerLink: {
    color: colors.primary[500],
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: 14,
  },
  mockHint: {
    color: colors.gray[400],
    textAlign: "center",
    fontSize: 12,
    marginTop: spacing["3xl"],
  },
});
