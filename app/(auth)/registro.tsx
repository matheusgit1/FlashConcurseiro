import { useAuth } from "@/src/contexts/AuthContext";
import { colors, spacing } from "@/src/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { colors, spacing } from '@/styles/theme';

export default function RegistroScreen() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validarCampos = (): boolean => {
    if (!nome.trim() || nome.trim().length < 3) {
      Alert.alert("Erro", "Nome deve ter pelo menos 3 caracteres");
      return false;
    }

    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      Alert.alert("Erro", "Digite um email válido");
      return false;
    }

    if (!senha || senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleRegistro = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    try {
      // 🔥 Mock do registro - será substituído pelo Firebase
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simula sucesso
      Alert.alert(
        "✅ Conta criada!",
        `Bem-vindo(a) ${nome}! Sua conta foi criada com sucesso.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // setLoading(true);
    try {
      // 🔥 Mock do Google - será substituído pelo Firebase
      await loginWithGoogle();
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // Alert.alert("✅ Google", "Login com Google realizado com sucesso!", [
      //   {
      //     text: "OK",
      //     onPress: () => router.replace("/(tabs)/home"),
      //   },
      // ]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha no login com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Comece a estudar com flashcards</Text>
        </View>

        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>👤 Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.gray[400]}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📧 Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.gray[400]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.gray[400]}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setMostrarSenha(!mostrarSenha)}
                disabled={loading}
              >
                <Text style={styles.passwordToggleText}>
                  {mostrarSenha ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>✅ Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a senha novamente"
              placeholderTextColor={colors.gray[400]}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarSenha}
              editable={!loading}
            />
          </View>

          {/* Botão Registrar */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegistro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          {/* Botão Google */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.googleIcon}>🔵</Text>
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>

          {/* Link para Login */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            disabled={loading}
          >
            <Text style={styles.loginLink}>
              Já tem conta?{" "}
              <Text style={styles.loginLinkHighlight}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Versão */}
        <Text style={styles.version}>Versão 1.0.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["2xl"],
  },
  header: {
    marginBottom: spacing["2xl"],
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.gray[900],
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: "center",
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.sm,
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
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  passwordToggleText: {
    fontSize: 20,
  },
  registerButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: 10,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    paddingHorizontal: spacing.md,
    color: colors.gray[400],
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[200],
    gap: spacing.sm,
  },
  googleIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.gray[700],
  },
  loginLink: {
    textAlign: "center",
    color: colors.gray[500],
    fontSize: 15,
    marginTop: spacing.md,
  },
  loginLinkHighlight: {
    color: colors.primary[500],
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    color: colors.gray[400],
    fontSize: 12,
    marginTop: spacing["2xl"],
  },
});
