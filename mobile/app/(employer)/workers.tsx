import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { WorkerCard } from "@/components/WorkerCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SKILL_CATEGORIES } from "@/constants";
import { useProfileStore } from "@/store/profileStore";
import api from "@/services/api";
import { WorkerProfile } from "@/types";

export default function EmployerWorkersScreen() {
  const router = useRouter();
  const { employerProfile } = useProfileStore();
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const lat = employerProfile?.latitude || 28.6139;
      const lng = employerProfile?.longitude || 77.2090;
      let url = `/workers/nearby?lat=${lat}&lng=${lng}&radius_km=20`;
      if (skillFilter) url += `&skill=${skillFilter}`;
      const res = await api.get(url);
      setWorkers(res.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [skillFilter, employerProfile]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Workers</Text>
        <Text style={styles.subtitle}>{workers.length} available nearby</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        <TouchableOpacity
          style={[styles.filterChip, !skillFilter && styles.filterChipActive]}
          onPress={() => setSkillFilter(null)}
        >
          <Text style={[styles.filterText, !skillFilter && styles.filterTextActive]}>All Skills</Text>
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

      {workers.length === 0 ? (
        <EmptyState
          icon="👷"
          title="No workers found"
          subtitle="No available workers match your filters. Try a different skill or expand your search area."
          ctaLabel="Clear Filters"
          onCta={() => setSkillFilter(null)}
        />
      ) : (
        <FlashList
          data={workers}
          estimatedItemSize={140}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <WorkerCard
                worker={item}
                onPress={() => router.push({ pathname: "/(employer)/worker-profile", params: { id: item.id } })}
                onHire={() => router.push({ pathname: "/(employer)/worker-profile", params: { id: item.id } })}
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
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
