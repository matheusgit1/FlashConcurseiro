import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { colors } from "@/src/styles/theme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
// import { AuthProvider } from '@/contexts/AuthContext';

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          {/* Telas de Autenticação */}
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: "fade",
            }}
          />

          {/* Telas principais com Tabs */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animation: "fade",
            }}
          />

          {/* Telas de Detalhe com header personalizado */}
          <Stack.Screen
            name="concursos/[id]"
            options={{
              title: "Detalhe do Concurso",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary[500],
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />

          <Stack.Screen
            name="disciplinas/[id]"
            options={{
              title: "Detalhe da Disciplina",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary[500],
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />

          <Stack.Screen
            name="flashcards/[id]"
            options={{
              title: "Flashcard",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary[500],
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />

          <Stack.Screen
            name="flashcards/index"
            options={{
              title: "Flashcards",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary[500],
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />

          <Stack.Screen
            name="flashcards/revisao"
            options={{
              title: "Revisão",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.green[500],
              },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: {
                fontWeight: "600",
              },
            }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
              headerStyle: {
                backgroundColor: colors.primary[500],
              },
              headerTintColor: "#FFFFFF",
            }}
          />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
