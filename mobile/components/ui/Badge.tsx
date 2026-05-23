import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  size?: "sm" | "md";
}

export function Badge({ label, color = Colors.white, bg = Colors.primary, size = "sm" }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color, fontSize: size === "sm" ? 10 : 12 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
