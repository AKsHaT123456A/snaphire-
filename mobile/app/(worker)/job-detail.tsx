import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SKILL_CATEGORIES } from "@/constants";
import api from "@/services/api";
import { Job } from "@/types";

export default function WorkerJobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((r) => setJob(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!job) return;
    Alert.alert(
      "Apply for this job?",
      `Wage: ₹${job.daily_wage}/day\nDuration: ${job.duration_days} day(s)`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Apply",
          onPress: async () => {
            setApplying(true);
            try {
              // Worker applies — employer will send hire request
              Alert.alert("Applied!", "Your interest has been noted. The employer will contact you.");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            } finally {
              setApplying(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingScreen />;
  if (!job) return null;

  const skill = SKILL_CATEGORIES.find((s) => s.value === job.skill_category);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{skill?.icon || "💼"}</Text>
              </View>
              <View style={styles.heroInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.employer}>{job.employer_name || "Employer"}</Text>
                {job.employer_company && <Text style={styles.company}>{job.employer_company}</Text>}
              </View>
            </View>
            <View style={styles.tags}>
              {job.is_urgent && <Badge label="URGENT" bg={Colors.error} />}
              {job.is_immediate && <Badge label="Immediate Start" bg="#FFF3E0" color={Colors.primary} />}
              {job.safety_equipment && <Badge label="Safety Gear Provided" bg="#E8F5E9" color={Colors.success} />}
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>₹{job.daily_wage.toLocaleString("en-IN")}</Text>
              <Text style={styles.statLbl}>Daily Wage</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{job.duration_days} day{job.duration_days > 1 ? "s" : ""}</Text>
              <Text style={styles.statLbl}>Duration</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{job.workers_needed}</Text>
              <Text style={styles.statLbl}>Workers Needed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>₹{(job.daily_wage * job.duration_days).toLocaleString("en-IN")}</Text>
              <Text style={styles.statLbl}>Total Earning</Text>
            </View>
          </View>

          {job.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Job Description</Text>
              <Text style={styles.description}>{job.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>
              📍 {job.city || "Location not specified"}
              {job.address ? `\n${job.address}` : ""}
            </Text>
            {job.distance_km !== undefined && (
              <Text style={styles.distance}>
                {job.distance_km < 1 ? `${(job.distance_km * 1000).toFixed(0)}m` : `${job.distance_km.toFixed(1)}km`} from your location
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posted</Text>
            <Text style={styles.postedDate}>{new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Apply for this Job" onPress={handleApply} loading={applying} size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  back: { fontSize: 16, color: Colors.primary, fontWeight: "600" },
  scroll: { flex: 1 },
  container: { padding: 20 },
  heroCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  heroTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  iconBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  icon: { fontSize: 28 },
  heroInfo: { flex: 1 },
  jobTitle: { fontSize: 20, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  employer: { fontSize: 14, color: Colors.textSecondary },
  company: { fontSize: 13, color: Colors.textMuted },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1, minWidth: "45%", backgroundColor: Colors.white, borderRadius: 14,
    padding: 14, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statVal: { fontSize: 18, fontWeight: "800", color: Colors.primary, marginBottom: 4 },
  statLbl: { fontSize: 11, color: Colors.textMuted },
  section: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 8 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  locationText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  distance: { fontSize: 13, color: Colors.primary, fontWeight: "600", marginTop: 6 },
  postedDate: { fontSize: 14, color: Colors.textSecondary },
  footer: { padding: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
});
