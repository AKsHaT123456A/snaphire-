import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { INDIAN_CITIES } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import api from "@/services/api";

const INDUSTRIES = [
  "Construction", "Real Estate", "Manufacturing", "Logistics",
  "Hospitality", "Agriculture", "Retail", "Other",
];

export default function EmployerSetupScreen() {
  const router = useRouter();
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);
  const setEmployerProfile = useProfileStore((s) => s.setEmployerProfile);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Required", "Please enter your name");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/employers/profile", {
        name,
        company_name: company,
        industry,
        city,
        latitude: 28.6139,
        longitude: 77.2090,
      });
      setEmployerProfile(res.data);
      setProfileComplete(true);
      router.replace("/(employer)/home");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Set up your{"\n"}employer profile</Text>
          <Text style={styles.subtitle}>Help workers know who they're working for</Text>

          <Input label="Your Name" placeholder="Suresh Sharma" value={name} onChangeText={setName} />
          <Input label="Company Name (optional)" placeholder="Sharma Constructions" value={company} onChangeText={setCompany} />

          <Text style={styles.sectionLabel}>Industry</Text>
          <View style={styles.grid}>
            {INDUSTRIES.map((ind) => (
              <TouchableOpacity
                key={ind}
                style={[styles.chip, industry === ind && styles.chipSelected]}
                onPress={() => setIndustry(ind)}
              >
                <Text style={[styles.chipText, industry === ind && styles.chipTextSelected]}>{ind}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>City</Text>
          <View style={styles.grid}>
            {INDIAN_CITIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, city === c && styles.chipSelected]}
                onPress={() => setCity(c)}
              >
                <Text style={[styles.chipText, city === c && styles.chipTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Button title="Create Profile" onPress={handleSubmit} loading={loading} size="lg" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "900", color: Colors.dark, marginBottom: 8, lineHeight: 34 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 28 },
  sectionLabel: { fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  chipTextSelected: { color: Colors.white },
  footer: { marginTop: 8 },
});
