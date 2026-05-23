import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { WorkerCard } from "../../components/WorkerCard";
import { HireCard } from "../../components/HireCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { useProfileStore } from "../../store/profileStore";
import api from "../../services/api";
import { WorkerProfile, Hire, Job } from "../../types";
import { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EmployerHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { employerProfile, setEmployerProfile } = useProfileStore();
  const [nearbyWorkers, setNearbyWorkers] = useState<WorkerProfile[]>([]);
  const [activeHires, setActiveHires] = useState<Hire[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [profileRes, hiresRes] = await Promise.all([api.get("/employers/profile/me"), api.get("/hires/my")]);
      setEmployerProfile(profileRes.data);
      setActiveHires((hiresRes.data as Hire[]).filter((h) => !["payment_done", "rejected", "cancelled"].includes(h.status)));
      const { latitude = 28.6139, longitude = 77.2090 } = profileRes.data;
      const workersRes = await api.get(`/workers/nearby?lat=${latitude}&lng=${longitude}&radius_km=15`);
      setNearbyWorkers(workersRes.data.slice(0, 4));
    } catch {}
    setLoading(false); setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen message="Loading your dashboard..." />;

  const name = employerProfile?.name || "Employer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{name} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>{employerProfile?.total_hires || 0}</Text><Text style={styles.statLabel}>Total Hires</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{activeHires.length}</Text><Text style={styles.statLabel}>Active</Text></View>
        </View>

        <TouchableOpacity style={styles.postCta} onPress={() => (navigation as any).navigate("Post Job")}>
          <Text style={styles.postCtaIcon}>➕</Text>
          <View><Text style={styles.postCtaTitle}>Post a New Job</Text><Text style={styles.postCtaSubtitle}>Find workers in minutes</Text></View>
          <Text style={styles.postCtaArrow}>→</Text>
        </TouchableOpacity>

        {activeHires.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Hires</Text>
            {activeHires.slice(0, 3).map((hire) => (
              <HireCard key={hire.id} hire={hire} role="employer" onPress={() => navigation.navigate("EmployerHireDetail", { id: hire.id })} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workers Near You</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate("Workers")}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          {nearbyWorkers.length === 0 ? (
            <EmptyState icon="👷" title="No workers nearby yet" subtitle="Workers will appear here as they register in your area." ctaLabel="Browse Workers" onCta={() => (navigation as any).navigate("Workers")} />
          ) : (
            nearbyWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} onPress={() => navigation.navigate("WorkerProfileDetail", { id: worker.id })} onHire={() => navigation.navigate("WorkerProfileDetail", { id: worker.id })} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  name: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  notifIcon: { fontSize: 20 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  postCta: { marginHorizontal: 20, marginBottom: 24, backgroundColor: Colors.primary, borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  postCtaIcon: { fontSize: 28 },
  postCtaTitle: { fontSize: 16, fontWeight: "800", color: Colors.white },
  postCtaSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  postCtaArrow: { marginLeft: "auto", fontSize: 20, color: Colors.white },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: Colors.dark },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
});
