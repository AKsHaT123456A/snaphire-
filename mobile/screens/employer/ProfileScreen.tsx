import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EmployerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const logout = useAuthStore((s) => s.logout);
  const { employerProfile } = useProfileStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => { logout(); navigation.replace("RoleSelect"); } },
    ]);
  };

  const initials = (employerProfile?.name || "E").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <Text style={styles.name}>{employerProfile?.name || "Employer"}</Text>
          <Text style={styles.phone}>{employerProfile?.phone || ""}</Text>
          <View style={styles.badges}>
            {employerProfile?.is_verified && <Badge label="✓ Verified" bg={Colors.success} />}
            {employerProfile?.company_name && <Badge label={employerProfile.company_name} bg={Colors.primary} />}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statVal}>{employerProfile?.total_hires || 0}</Text><Text style={styles.statLbl}>Total Hires</Text></View>
          <View style={styles.statBox}><Text style={styles.statVal}>⭐ {(employerProfile?.rating || 0).toFixed(1)}</Text><Text style={styles.statLbl}>Rating</Text></View>
          <View style={styles.statBox}><Text style={styles.statVal}>{employerProfile?.total_reviews || 0}</Text><Text style={styles.statLbl}>Reviews</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Business Details</Text>
          {[
            employerProfile?.company_name && { label: "Company", value: employerProfile.company_name },
            employerProfile?.industry && { label: "Industry", value: employerProfile.industry },
            employerProfile?.city && { label: "City", value: employerProfile.city },
          ].filter(Boolean).map((row: any) => (
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
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.dark, marginBottom: 12 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  actions: { paddingHorizontal: 20, paddingBottom: 40, marginTop: 8 },
});
