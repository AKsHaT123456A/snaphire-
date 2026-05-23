import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";

export default function RoleSelectScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<"worker" | "employer" | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>⚡ SnapHire</Text>
          <Text style={styles.title}>I am a...</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.roleCard, selected === "worker" && styles.roleCardSelected]}
            onPress={() => setSelected("worker")}
            activeOpacity={0.85}
          >
            <Text style={styles.roleIcon}>👷</Text>
            <Text style={styles.roleTitle}>Worker</Text>
            <Text style={styles.roleDesc}>
              Find daily wage jobs near you. Mason, Carpenter, Electrician and more.
            </Text>
            {selected === "worker" && <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, selected === "employer" && styles.roleCardSelected]}
            onPress={() => setSelected("employer")}
            activeOpacity={0.85}
          >
            <Text style={styles.roleIcon}>🏗️</Text>
            <Text style={styles.roleTitle}>Employer</Text>
            <Text style={styles.roleDesc}>
              Post jobs and hire skilled workers nearby. Fast, verified, reliable.
            </Text>
            {selected === "employer" && <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => router.push({ pathname: "/auth/phone", params: { role: selected! } })}
            disabled={!selected}
            size="lg"
          />
          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  header: { marginBottom: 40 },
  logo: { fontSize: 22, fontWeight: "900", color: Colors.primary, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "900", color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary },
  cards: { gap: 16, marginBottom: 40 },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    position: "relative",
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF8F0",
  },
  roleIcon: { fontSize: 48, marginBottom: 12 },
  roleTitle: { fontSize: 22, fontWeight: "800", color: Colors.dark, marginBottom: 8 },
  roleDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  checkmark: {
    position: "absolute", top: 16, right: 16,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
  },
  checkmarkText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  footer: { marginTop: "auto" },
  terms: { fontSize: 11, color: Colors.textMuted, textAlign: "center", marginTop: 12, lineHeight: 16 },
});
