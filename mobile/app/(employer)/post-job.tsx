import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SKILL_CATEGORIES, INDIAN_CITIES } from "@/constants";
import { useProfileStore } from "@/store/profileStore";
import api from "@/services/api";

export default function PostJobScreen() {
  const router = useRouter();
  const { employerProfile } = useProfileStore();

  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("");
  const [workers, setWorkers] = useState("1");
  const [wage, setWage] = useState("");
  const [duration, setDuration] = useState("1");
  const [city, setCity] = useState(employerProfile?.city || "");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImmediate, setIsImmediate] = useState(true);
  const [safetyEquipment, setSafetyEquipment] = useState(false);
  const [loading, setLoading] = useState(false);

  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    Delhi: { lat: 28.6139, lng: 77.2090 },
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Bengaluru: { lat: 12.9716, lng: 77.5946 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Lucknow: { lat: 26.8467, lng: 80.9462 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
    Hyderabad: { lat: 17.3850, lng: 78.4867 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  };

  const handlePost = async () => {
    if (!title || !skill || !wage || !city) {
      Alert.alert("Required", "Please fill title, skill, wage, and city");
      return;
    }
    setLoading(true);
    const coords = CITY_COORDS[city] || { lat: 28.6139, lng: 77.2090 };
    try {
      await api.post("/jobs/", {
        title,
        skill_category: skill,
        workers_needed: parseInt(workers) || 1,
        daily_wage: parseFloat(wage),
        duration_days: parseInt(duration) || 1,
        latitude: coords.lat,
        longitude: coords.lng,
        city,
        address,
        description,
        is_urgent: isUrgent,
        is_immediate: isImmediate,
        safety_equipment: safetyEquipment,
      });
      Alert.alert("Job Posted!", "Workers nearby will see your job.", [
        { text: "OK", onPress: () => router.replace("/(employer)/home") },
      ]);
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
          <Text style={styles.title}>Post a Job</Text>
          <Text style={styles.subtitle}>Fill in the details to find the right worker</Text>

          <Input label="Job Title" placeholder="e.g. Electrician needed for wiring work" value={title} onChangeText={setTitle} />
          <Input label="Daily Wage (₹)" placeholder="700" keyboardType="numeric" value={wage} onChangeText={setWage} prefix="₹" />

          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Workers Needed" placeholder="1" keyboardType="numeric" value={workers} onChangeText={setWorkers} />
            </View>
            <View style={styles.half}>
              <Input label="Duration (days)" placeholder="1" keyboardType="numeric" value={duration} onChangeText={setDuration} />
            </View>
          </View>

          <Input label="Address / Landmark" placeholder="Near Sector 15, Main Road" value={address} onChangeText={setAddress} />
          <Input label="Job Description (optional)" placeholder="Describe the work in detail..." value={description} onChangeText={setDescription} multiline numberOfLines={3} />

          <Text style={styles.sectionLabel}>Select Skill Required</Text>
          <View style={styles.skillGrid}>
            {SKILL_CATEGORIES.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.skillChip, skill === s.value && styles.skillChipSelected]}
                onPress={() => setSkill(s.value)}
              >
                <Text style={styles.skillIcon}>{s.icon}</Text>
                <Text style={[styles.skillLabel, skill === s.value && styles.skillLabelSelected]}>{s.label}</Text>
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

          <View style={styles.togglesCard}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>🔥 Urgent Hiring</Text>
                <Text style={styles.toggleSub}>Mark as urgent to get faster responses</Text>
              </View>
              <Switch value={isUrgent} onValueChange={setIsUrgent} trackColor={{ false: Colors.gray200, true: Colors.error }} thumbColor={Colors.white} />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>⚡ Immediate Start</Text>
                <Text style={styles.toggleSub}>Worker can start today</Text>
              </View>
              <Switch value={isImmediate} onValueChange={setIsImmediate} trackColor={{ false: Colors.gray200, true: Colors.primary }} thumbColor={Colors.white} />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>🦺 Safety Equipment Provided</Text>
                <Text style={styles.toggleSub}>Helmet, gloves, etc. provided</Text>
              </View>
              <Switch value={safetyEquipment} onValueChange={setSafetyEquipment} trackColor={{ false: Colors.gray200, true: Colors.success }} thumbColor={Colors.white} />
            </View>
          </View>

          <View style={styles.footer}>
            <Button title="Post Job" onPress={handlePost} loading={loading} size="lg" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "900", color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 24 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  sectionLabel: { fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 12, marginTop: 8 },
  skillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  skillChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  skillChipSelected: { borderColor: Colors.primary, backgroundColor: "#FFF3E0" },
  skillIcon: { fontSize: 16 },
  skillLabel: { fontSize: 12, fontWeight: "600", color: Colors.dark },
  skillLabelSelected: { color: Colors.primary },
  cityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  cityChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  cityText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  cityTextSelected: { color: Colors.white },
  togglesCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 24 },
  toggleRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  toggleLabel: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  toggleSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  footer: {},
});
