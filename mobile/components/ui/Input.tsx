import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Colors } from "@/theme/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
}

export function Input({ label, error, prefix, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error ? styles.inputError : styles.inputNormal]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.dark, marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    minHeight: 52,
  },
  inputNormal: { borderColor: Colors.border },
  inputError: { borderColor: Colors.error },
  prefix: { fontSize: 16, color: Colors.textSecondary, marginRight: 6 },
  input: { flex: 1, fontSize: 16, color: Colors.dark, paddingVertical: 12 },
  error: { fontSize: 12, color: Colors.error, marginTop: 4 },
});
