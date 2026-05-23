import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Colors } from "@/theme/colors";
import { useProfileStore } from "@/store/profileStore";
import { SKILL_CATEGORIES } from "@/constants";
import api from "@/services/api";
import { Job } from "@/types";

// Map is rendered as a visual list since react-native-maps requires native build
export default function WorkerMapScreen() {
  const { workerProfile } = useProfileStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lat = workerProfile?.latitude || 28.6139;
    const lng = workerProfile?.longitude || 77.2090;
    api.get(`/jobs/nearby?lat=${lat}&lng=${lng}&radius_km=25`)
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Jobs Near You</Text>
        <Text style={styles.subtitle}>📍 {workerProfile?.city || "Your location"}</Text>
      </View>

      {/* Map placeholder with visual representation */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapBg}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={styles.mapText}>{jobs.length} jobs within 25km</Text>
          <View style={styles.mapPins}>
            {jobs.slice(0, 6).map((job, i) => {
              const skill = SKILL_CATEGORIES.find((s) => s.value === job.skill_category);
              return (
                <View key={job.id} style={[styles.pin, { left: `${15 + (i % 3) * 30}%` as any, top: `${20 + Math.floor(i / 3) * 40}%` as any }]}>
                  <Text style={styles.pinEmoji}>{skill?.icon || "📍"}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Jobs on Map</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {jobs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No jobs found nearby</Text>
          </View>
        ) : (
          jobs.map((job) => {
            const skill = SKILL_CATEGORIES.find((s) => s.value === job.skill_category);
            return (
              <View key={job.id} style={styles.mapJobCard}>
                <Text style={styles.mapJobIcon}>{skill?.icon || "💼"}</Text>
                <View style={styles.mapJobInfo}>
                  <Text style={styles.mapJobTitle}>{job.title}</Text>
                  <Text style={styles.mapJobMeta}>
                    ₹{job.daily_wage}/day · {job.distance_km?.toFixed(1)}km away
                  </Text>
                </View>
                {job.is_urgent && (
                  <View style={styles.urgentDot} />
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  mapPlaceholder: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, overflow: "hidden" },
  mapBg: {
    height: 200, backgroundColor: "#E8F4FD",
    alignItems: "center", justifyContent: "center",
    borderRadius: 20, position: "relative",
  },
  mapEmoji: { fontSize: 40, marginBottom: 8 },
  mapText: { fontSize: 14, color: Colors.textSecondary, fontWeight: "600" },
  mapPins: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  pin: { position: "absolute", width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  pinEmoji: { fontSize: 20 },
  listHeader: { paddingHorizontal: 20, marginBottom: 8 },
  listTitle: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  list: { flex: 1, paddingHorizontal: 20 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
  mapJobCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8,
  },
  mapJobIcon: { fontSize: 24, marginRight: 12 },
  mapJobInfo: { flex: 1 },
  mapJobTitle: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  mapJobMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  urgentDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.error },
});
