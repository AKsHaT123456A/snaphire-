import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/theme/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  title, onPress, loading, disabled, variant = "primary", size = "md", style, fullWidth = true,
}: ButtonProps) {
  const bg = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    outline: "transparent",
    ghost: "transparent",
    danger: Colors.error,
  }[variant];

  const textColor = variant === "outline" ? Colors.primary
    : variant === "ghost" ? Colors.primary
    : Colors.white;

  const borderColor = variant === "outline" ? Colors.primary : "transparent";

  const padding = { sm: 10, md: 14, lg: 18 }[size];
  const fontSize = { sm: 13, md: 15, lg: 17 }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor, paddingVertical: padding, borderWidth: variant === "outline" ? 1.5 : 0 },
        fullWidth && { width: "100%" },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
