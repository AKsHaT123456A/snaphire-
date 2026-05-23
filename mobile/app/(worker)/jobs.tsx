import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity, ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SKILL_CATEGORIES } from "@/constants";
import { useProfileStore } from "@/store/profileStore";
import api from "@/services/api";
import { Job } from "@/types";

export default function WorkerJobsScreen() {
  const router = useRouter();
  const { workerProfile } = useProfileStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [urgentOnly, setUrgentOnly] = useState(false);

  const load = useCallback(async () => {
    try {
      const lat = workerProfile?.latitude || 28.6139;
      const lng = workerProfile?.longitude || 77.2090;
      let url = `/jobs/nearby?lat=${lat}&lng=${lng}&radius_km=25`;
      if (skillFilter) url += `&skill=${skillFilter}`;
      if (urgentOnly) url += `&urgent_only=true`;
      const res = await api.get(url);
      setJobs(res.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [skillFilter, urgentOnly, workerProfile]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Jobs</Text>
        <TouchableOpacity
          style={[styles.urgentBtn, urgentOnly && styles.urgentBtnActive]}
          onPress={() => setUrgentOnly(!urgentOnly)}
        >
          <Text style={[styles.urgentText, urgentOnly && styles.urgentTextActive]}>🔥 Urgent</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        <TouchableOpacity
          style={[styles.filterChip, !skillFilter && styles.filterChipActive]}
          onPress={() => setSkillFilter(null)}
        >
          <Text style={[styles.filterText, !skillFilter && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {SKILL_CATEGORIES.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[styles.filterChip, skillFilter === s.value && styles.filterChipActive]}
            onPress={() => setSkillFilter(skillFilter === s.value ? null : s.value)}
          >
            <Text style={styles.filterText}>{s.icon} {s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No jobs found"
          subtitle="No jobs match your filters right now. Try expanding your search or check back later."
          ctaLabel="Clear Filters"
          onCta={() => { setSkillFilter(null); setUrgentOnly(false); }}
        />
      ) : (
        <FlashList
          data={jobs}
          estimatedItemSize={160}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <JobCard
                job={item}
                onPress={() => router.push({ pathname: "/(worker)/job-detail", params: { id: item.id } })}
              />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  urgentBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  urgentBtnActive: { backgroundColor: Colors.error, borderColor: Colors.error },
  urgentText: { fontSize: 13, fontWeight: "700", color: Colors.dark },
  urgentTextActive: { color: Colors.white },
  filterScroll: { maxHeight: 52 },
  filterContent: { paddingHorizontal: 20, gap: 8, paddingBottom: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  filterTextActive: { color: Colors.white },
  list: { padding: 20 },
  cardWrapper: {},
});
