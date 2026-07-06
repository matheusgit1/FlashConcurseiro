// import { colors } from "@/styles/theme";
import { colors } from "@/src/styles/theme";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const TabIcon = ({
  icon,
  color,
  focused,
}: {
  icon: string;
  color: string;
  focused: boolean;
}) => (
  <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
    <Text style={[styles.icon, { color }]}>{icon}</Text>
    {focused && <View style={styles.activeDot} />}
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[100],
          // height: 75,
          paddingBottom: 16,
          paddingTop: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
          justifyContent: "center",
          alignItems: "center",
        },
        // tabBarShowLabel: true,r
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginTop: 2,
          alignItems: "center",
          justifyContent: "center",
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: colors.gray[800],
        },
        headerShadowVisible: false,
        // tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          headerShown: false,
          // statusBarStyle: "dark",
          // statusBarAnimation: "fade",
          // statusBarTranslucent: true,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🏠" color={color} focused={focused} />
          ),
          // tabBarLabel: "Início",
          tabBarShowLabel: true,
        }}
      />
      <Tabs.Screen
        name="concursos/index"
        options={{
          title: "Concursos",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📚" color={color} focused={focused} />
          ),
          tabBarLabel: "Concursos",
          // tabBarShowLabel: true,
        }}
      />
      <Tabs.Screen
        name="flashcards/index"
        options={{
          title: "Flashcards",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🃏" color={color} focused={focused} />
          ),
          tabBarLabel: "Flashcards",
          tabBarShowLabel: true,
        }}
      />
      <Tabs.Screen
        name="estatisticas/index"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📊" color={color} focused={focused} />
          ),
          tabBarLabel: "Stats",
          tabBarShowLabel: true,
        }}
      />
      <Tabs.Screen
        name="perfil/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="👤" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="flashcards/revisao"
        options={{
          title: "Revisão",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="🔁" color={color} focused={focused} />
          ),
          // href: null, // 👈 Isso oculta a rota da tab bar
          // tabBarButton: () => null, // 👈 Alternativa para ocultar
        }}
      />
      <Tabs.Screen
        name="flashcards/[id]"
        options={{
          title: "Flashcard",
          headerShown: false,
          href: null,
          // href: null, // 👈 Isso oculta a rota da tab bar
          // tabBarButton: () => null, // 👈 Alternativa para ocultar
        }}
      />

      <Tabs.Screen
        name="concursos/[id]"
        options={{
          title: "Concurso",
          href: null,
          headerShown: false,
          headerStyle: {},
          // href: null, // 👈 Isso oculta a rota da tab bar
          // tabBarButton: () => null, // 👈 Alternativa para ocultar
        }}
      />
      <Tabs.Screen
        name="disciplinas/[id]"
        options={{
          title: "Disciplina",
          href: null,
          // tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    position: "relative",
  },
  iconWrapperActive: {
    // Efeito extra quando ativo
  },
  icon: {
    fontSize: 26,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary[500],
    marginTop: 2,
  },
});
