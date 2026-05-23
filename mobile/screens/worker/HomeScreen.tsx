import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { JobCard } from "../../components/JobCard";
import { HireCard } from "../../components/HireCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { useProfileStore } from "../../store/profileStore";
import api from "../../services/api";
import { Job, Hire } from "../../types";
import { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WorkerHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { workerProfile, setWorkerProfile } = useProfileStore();
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [activeHires, setActiveHires] = useState<Hire[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [profileRes, hiresRes] = await Promise.all([api.get("/workers/profile/me"), api.get("/hires/my")]);
      setWorkerProfile(profileRes.data);
      const allHires: Hire[] = hiresRes.data;
      setActiveHires(allHires.filter((h) => !["payment_done", "rejected", "cancelled"].includes(h.status)));
      const { latitude = 28.6139, longitude = 77.2090 } = profileRes.data;
      const jobsRes = await api.get(`/jobs/nearby?lat=${latitude}&lng=${longitude}&radius_km=20`);
      setNearbyJobs(jobsRes.data.slice(0, 5));
    } catch {}
    setLoading(false); setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen message="Loading your dashboard..." />;

  const name = workerProfile?.name || "Worker";
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
          <View style={styles.statCard}><Text style={styles.statValue}>{workerProfile?.completed_jobs || 0}</Text><Text style={styles.statLabel}>Jobs Done</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>⭐ {(workerProfile?.rating || 0).toFixed(1)}</Text><Text style={styles.statLabel}>Rating</Text></View>
          <View style={[styles.statCard, { backgroundColor: workerProfile?.is_available ? "#E8F5E9" : "#FFEBEE" }]}>
            <Text style={styles.statValue}>{workerProfile?.is_available ? "🟢" : "🔴"}</Text>
            <Text style={styles.statLabel}>{workerProfile?.is_available ? "Available" : "Busy"}</Text>
          </View>
        </View>

        {activeHires.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Jobs</Text>
            {activeHires.map((hire) => (
              <HireCard key={hire.id} hire={hire} role="worker" onPress={() => navigation.navigate("WorkerHireDetail", { id: hire.id })} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jobs Near You</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate("Jobs")}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          {nearbyJobs.length === 0 ? (
            <EmptyState icon="🔍" title="No jobs nearby yet" subtitle="Be the first! Employers in your area will post jobs here." ctaLabel="Browse All Jobs" onCta={() => (navigation as any).navigate("Jobs")} />
          ) : (
            nearbyJobs.map((job) => (
              <JobCard key={job.id} job={job} onPress={() => navigation.navigate("JobDetail", { id: job.id })} />
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
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: Colors.dark },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
});
