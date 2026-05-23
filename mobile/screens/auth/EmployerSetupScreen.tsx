import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { INDIAN_CITIES } from "../../constants";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import api from "../../services/api";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "EmployerSetup">;

const INDUSTRIES = ["Construction", "Real Estate", "Manufacturing", "Logistics", "Hospitality", "Agriculture", "Retail", "Other"];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.2090 }, Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 }, Pune: { lat: 18.5204, lng: 73.8567 },
  Lucknow: { lat: 26.8467, lng: 80.9462 }, Jaipur: { lat: 26.9124, lng: 75.7873 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 }, Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 }, Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

export default function EmployerSetupScreen({ navigation }: Props) {
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete);
  const setEmployerProfile = useProfileStore((s) => s.setEmployerProfile);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) { Alert.alert("Required", "Please enter your name"); return; }
    setLoading(true);
    const coords = CITY_COORDS[city] || { lat: 28.6139, lng: 77.2090 };
    try {
      const res = await api.post("/employers/profile", { name, company_name: company, industry, city, latitude: coords.lat, longitude: coords.lng });
      setEmployerProfile(res.data);
      setProfileComplete(true);
      navigation.replace("EmployerTabs");
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
          <Text style={styles.title}>Set up your{"\n"}employer profile</Text>
          <Text style={styles.subtitle}>Help workers know who they're working for</Text>
          <Input label="Your Name" placeholder="Suresh Sharma" value={name} onChangeText={setName} />
          <Input label="Company Name (optional)" placeholder="Sharma Constructions" value={company} onChangeText={setCompany} />

          <Text style={styles.sectionLabel}>Industry</Text>
          <View style={styles.grid}>
            {INDUSTRIES.map((ind) => (
              <TouchableOpacity key={ind} style={[styles.chip, industry === ind && styles.chipSelected]} onPress={() => setIndustry(ind)}>
                <Text style={[styles.chipText, industry === ind && styles.chipTextSelected]}>{ind}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>City</Text>
          <View style={styles.grid}>
            {INDIAN_CITIES.map((c) => (
              <TouchableOpacity key={c} style={[styles.chip, city === c && styles.chipSelected]} onPress={() => setCity(c)}>
                <Text style={[styles.chipText, city === c && styles.chipTextSelected]}>{c}</Text>
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
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  chipTextSelected: { color: Colors.white },
});
