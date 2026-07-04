import { borderRadius, colors, spacing } from "@/src/styles/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
// import { colors, borderRadius, spacing } from '@/styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "medium",
  style,
  textStyle,
}: ButtonProps) {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: colors.gray[200],
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary[500],
        };
      case "danger":
        return {
          backgroundColor: colors.red[500],
        };
      default:
        return {
          backgroundColor: colors.primary[500],
        };
    }
  };

  const getVariantTextStyles = (): TextStyle => {
    switch (variant) {
      case "outline":
        return {
          color: colors.primary[500],
        };
      default:
        return {
          color: colors.white,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        };
      case "large":
        return {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
        };
      default:
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        };
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case "small":
        return { fontSize: 14 };
      case "large":
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getVariantStyles(),
        getSizeStyles(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary[500] : colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            getVariantTextStyles(),
            getTextSize(),
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  text: {
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
