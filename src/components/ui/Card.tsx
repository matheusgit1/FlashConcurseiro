// import { borderRadius, colors, shadows } from "@/styles/theme";
import { borderRadius, colors, shadows, spacing } from "@/src/styles/theme";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
}

export function Card({ children, style, variant = "default" }: CardProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          ...shadows.md,
          backgroundColor: colors.white,
        };
      case "outlined":
        return {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.gray[200],
        };
      default:
        return {
          backgroundColor: colors.white,
        };
    }
  };

  return (
    <View style={[styles.container, getVariantStyle(), style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
});
