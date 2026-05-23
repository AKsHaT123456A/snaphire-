import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { SKILL_CATEGORIES } from "../../constants";
import api from "../../services/api";
import { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WorkerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const logout = useAuthStore((s) => s.logout);
  const { workerProfile, setWorkerProfile } = useProfileStore();
  const [toggling, setToggling] = useState(false);

  const toggleAvailability = async () => {
    if (!workerProfile) return;
    setToggling(true);
    try {
      const res = await api.put("/workers/profile/me", { is_available: !workerProfile.is_available });
      setWorkerProfile(res.data);
    } catch (e: any) { Alert.alert("Error", e.message); }
    finally { setToggling(false); }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => { logout(); navigation.replace("RoleSelect"); } },
    ]);
  };

  const skill = SKILL_CATEGORIES.find((s) => s.value === workerProfile?.skill_category);
  const initials = (workerProfile?.name || "W").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <Text style={styles.name}>{workerProfile?.name || "Worker"}</Text>
          <Text style={styles.phone}>{workerProfile?.phone || ""}</Text>
          <View style={styles.badges}>
            {workerProfile?.is_verified && <Badge label="✓ Verified" bg={Colors.success} />}
            <Badge label={skill?.label || "Worker"} bg={Colors.primary} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statVal}>{workerProfile?.completed_jobs || 0}</Text><Text style={styles.statLbl}>Jobs Done</Text></View>
          <View style={styles.statBox}><Text style={styles.statVal}>⭐ {(workerProfile?.rating || 0).toFixed(1)}</Text><Text style={styles.statLbl}>Rating</Text></View>
          <View style={styles.statBox}><Text style={styles.statVal}>{workerProfile?.total_reviews || 0}</Text><Text style={styles.statLbl}>Reviews</Text></View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardTitle}>Available for Work</Text>
              <Text style={styles.cardSubtitle}>{workerProfile?.is_available ? "Employers can see and hire you" : "You're currently not visible"}</Text>
            </View>
            <Switch value={workerProfile?.is_available || false} onValueChange={toggleAvailability} trackColor={{ false: Colors.gray200, true: Colors.primary }} thumbColor={Colors.white} disabled={toggling} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Details</Text>
          {[
            { label: "Skill", value: `${skill?.icon || ""} ${skill?.label || "—"}` },
            { label: "Experience", value: `${workerProfile?.experience_years || 0} years` },
            { label: "Daily Wage", value: `₹${(workerProfile?.daily_wage || 0).toLocaleString("en-IN")}` },
            { label: "City", value: workerProfile?.city || "—" },
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Notifications" onPress={() => navigation.navigate("Notifications")} variant="outline" style={{ marginBottom: 10 }} />
          <Button title="Logout" onPress={handleLogout} variant="danger" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: "center", paddingTop: 32, paddingBottom: 24, paddingHorizontal: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarText: { color: Colors.white, fontWeight: "900", fontSize: 28 },
  name: { fontSize: 22, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  phone: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  badges: { flexDirection: "row", gap: 8 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statVal: { fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  statLbl: { fontSize: 11, color: Colors.textMuted },
  card: { marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: Colors.textSecondary },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  actions: { paddingHorizontal: 20, paddingBottom: 40, marginTop: 8 },
});
