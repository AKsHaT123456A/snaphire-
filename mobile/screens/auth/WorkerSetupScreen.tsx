import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { SKILL_CATEGORIES, INDIAN_CITIES } from "../../constants";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import api from "../../services/api";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "WorkerSetup">;

export default function WorkerSetupScreen({ navigation }: Props) {
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);
  const setWorkerProfile = useProfileStore((s) => s.setWorkerProfile);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("0");
  const [wage, setWage] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    Delhi: { lat: 28.6139, lng: 77.2090 }, Mumbai: { lat: 19.0760, lng: 72.8777 },
    Bengaluru: { lat: 12.9716, lng: 77.5946 }, Pune: { lat: 18.5204, lng: 73.8567 },
    Lucknow: { lat: 26.8467, lng: 80.9462 }, Jaipur: { lat: 26.9124, lng: 75.7873 },
    Hyderabad: { lat: 17.3850, lng: 78.4867 }, Chennai: { lat: 13.0827, lng: 80.2707 },
    Kolkata: { lat: 22.5726, lng: 88.3639 }, Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  };

  const handleSubmit = async () => {
    if (!name || !skill || !wage) { Alert.alert("Required", "Please fill name, skill, and daily wage"); return; }
    setLoading(true);
    const coords = CITY_COORDS[city] || { lat: 28.6139, lng: 77.2090 };
    try {
      const res = await api.post("/workers/profile", { name, skill_category: skill, experience_years: parseInt(experience) || 0, daily_wage: parseFloat(wage), city, bio, languages: ["Hindi"], latitude: coords.lat, longitude: coords.lng });
      setWorkerProfile(res.data);
      setProfileComplete(true);
      navigation.replace("WorkerTabs");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Set up your{"\n"}worker profile</Text>
          <Text style={styles.subtitle}>This helps employers find and hire you</Text>
          <Input label="Full Name" placeholder="Ramesh Kumar" value={name} onChangeText={setName} />
          <Input label="Daily Wage (₹)" placeholder="700" keyboardType="numeric" value={wage} onChangeText={setWage} prefix="₹" />
          <Input label="Experience (years)" placeholder="2" keyboardType="numeric" value={experience} onChangeText={setExperience} />
          <Input label="Bio (optional)" placeholder="Experienced mason with 5 years in residential construction..." value={bio} onChangeText={setBio} multiline numberOfLines={3} />

          <Text style={styles.sectionLabel}>Select Your Skill</Text>
          <View style={styles.grid}>
            {SKILL_CATEGORIES.map((s) => (
              <TouchableOpacity key={s.value} style={[styles.skillChip, skill === s.value && styles.skillChipSelected]} onPress={() => setSkill(s.value)}>
                <Text style={styles.skillIcon}>{s.icon}</Text>
                <Text style={[styles.skillLabel, skill === s.value && styles.skillLabelSelected]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>City</Text>
          <View style={styles.cityGrid}>
            {INDIAN_CITIES.map((c) => (
              <TouchableOpacity key={c} style={[styles.cityChip, city === c && styles.cityChipSelected]} onPress={() => setCity(c)}>
                <Text style={[styles.cityText, city === c && styles.cityTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Create Profile" onPress={handleSubmit} loading={loading} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "900", color: Colors.dark, marginBottom: 8, lineHeight: 34 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 28 },
  sectionLabel: { fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  skillChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  skillChipSelected: { borderColor: Colors.primary, backgroundColor: "#FFF3E0" },
  skillIcon: { fontSize: 18 },
  skillLabel: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  skillLabelSelected: { color: Colors.primary },
  cityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 },
  cityChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  cityChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  cityText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  cityTextSelected: { color: Colors.white },
});
