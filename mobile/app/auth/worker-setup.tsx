import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SKILL_CATEGORIES, INDIAN_CITIES } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import api from "@/services/api";

export default function WorkerSetupScreen() {
  const router = useRouter();
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);
  const setWorkerProfile = useProfileStore((s) => s.setWorkerProfile);

  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("0");
  const [wage, setWage] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !skill || !wage) {
      Alert.alert("Required", "Please fill name, skill, and daily wage");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/workers/profile", {
        name,
        skill_category: skill,
        experience_years: parseInt(experience) || 0,
        daily_wage: parseFloat(wage),
        city,
        bio,
        languages: ["Hindi"],
        latitude: 28.6139,
        longitude: 77.2090,
      });
      setWorkerProfile(res.data);
      setProfileComplete(true);
      router.replace("/(worker)/home");
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
          <Text style={styles.title}>Set up your{"\n"}worker profile</Text>
          <Text style={styles.subtitle}>This helps employers find and hire you</Text>

          <Input label="Full Name" placeholder="Ramesh Kumar" value={name} onChangeText={setName} />
          <Input label="Daily Wage (₹)" placeholder="700" keyboardType="numeric" value={wage} onChangeText={setWage} prefix="₹" />
          <Input label="Experience (years)" placeholder="2" keyboardType="numeric" value={experience} onChangeText={setExperience} />
          <Input label="Bio (optional)" placeholder="Experienced mason with 5 years in residential construction..." value={bio} onChangeText={setBio} multiline numberOfLines={3} />

          <Text style={styles.sectionLabel}>Select Your Skill</Text>
          <View style={styles.skillGrid}>
            {SKILL_CATEGORIES.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.skillChip, skill === s.value && styles.skillChipSelected]}
                onPress={() => setSkill(s.value)}
              >
                <Text style={styles.skillIcon}>{s.icon}</Text>
                <Text style={[styles.skillLabel, skill === s.value && styles.skillLabelSelected]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>City</Text>
          <View style={styles.cityGrid}>
            {INDIAN_CITIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.cityChip, city === c && styles.cityChipSelected]}
                onPress={() => setCity(c)}
              >
                <Text style={[styles.cityText, city === c && styles.cityTextSelected]}>{c}</Text>
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
  skillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  skillChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  skillChipSelected: { borderColor: Colors.primary, backgroundColor: "#FFF3E0" },
  skillIcon: { fontSize: 18 },
  skillLabel: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  skillLabelSelected: { color: Colors.primary },
  cityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  cityChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  cityText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  cityTextSelected: { color: Colors.white },
  footer: { marginTop: 8 },
});
