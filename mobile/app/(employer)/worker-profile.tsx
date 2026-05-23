import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SKILL_CATEGORIES } from "@/constants";
import api from "@/services/api";
import { WorkerProfile, Job } from "@/types";

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [wage, setWage] = useState("");
  const [note, setNote] = useState("");
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/workers/${id}`),
      api.get("/jobs/my"),
    ]).then(([wRes, jRes]) => {
      setWorker(wRes.data);
      setMyJobs(jRes.data.filter((j: Job) => j.status === "open"));
      setWage(String(wRes.data.daily_wage));
    }).finally(() => setLoading(false));
  }, [id]);

  const handleHire = async () => {
    if (!selectedJob || !wage) {
      Alert.alert("Required", "Select a job and confirm wage");
      return;
    }
    setHiring(true);
    try {
      await api.post("/hires/", {
        job_id: selectedJob,
        worker_id: id,
        agreed_wage: parseFloat(wage),
        note,
      });
      setShowHireModal(false);
      Alert.alert("Hire Request Sent!", "The worker will be notified.", [
        { text: "OK", onPress: () => router.push("/(employer)/hires") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setHiring(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!worker) return null;

  const skill = SKILL_CATEGORIES.find((s) => s.value === worker.skill_category);
  const initials = (worker.name || "W").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Hero */}
          <View style={styles.heroCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.workerName}>{worker.name || "Worker"}</Text>
            <Text style={styles.workerSkill}>{skill?.icon} {skill?.label || worker.skill_category}</Text>
            <View style={styles.badges}>
              {worker.is_verified && <Badge label="✓ Verified" bg={Colors.success} />}
              <Badge
                label={worker.is_available ? "Available Now" : "Busy"}
                bg={worker.is_available ? "#E8F5E9" : "#FFEBEE"}
                color={worker.is_available ? Colors.success : Colors.error}
              />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>⭐ {worker.rating.toFixed(1)}</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{worker.completed_jobs}</Text>
              <Text style={styles.statLbl}>Jobs Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{worker.experience_years}yr</Text>
              <Text style={styles.statLbl}>Experience</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>₹{worker.daily_wage.toLocaleString("en-IN")}</Text>
              <Text style={styles.statLbl}>Per Day</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailCard}>
            {worker.city && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 Location</Text>
                <Text style={styles.detailValue}>{worker.city}</Text>
              </View>
            )}
            {worker.distance_km !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📏 Distance</Text>
                <Text style={styles.detailValue}>{worker.distance_km.toFixed(1)} km away</Text>
              </View>
            )}
            {worker.languages?.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🗣️ Languages</Text>
                <Text style={styles.detailValue}>{worker.languages.join(", ")}</Text>
              </View>
            )}
            {worker.bio && (
              <View style={[styles.detailRow, { flexDirection: "column", alignItems: "flex-start" }]}>
                <Text style={styles.detailLabel}>About</Text>
                <Text style={[styles.detailValue, { marginTop: 6, lineHeight: 20 }]}>{worker.bio}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={worker.is_available ? "Send Hire Request" : "Worker is Busy"}
          onPress={() => setShowHireModal(true)}
          disabled={!worker.is_available}
          size="lg"
        />
      </View>

      {/* Hire Modal */}
      <Modal visible={showHireModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Send Hire Request</Text>
            <Text style={styles.modalSubtitle}>to {worker.name}</Text>

            <Text style={styles.modalLabel}>Select Job</Text>
            {myJobs.length === 0 ? (
              <View style={styles.noJobsBox}>
                <Text style={styles.noJobsText}>No open jobs. Post a job first.</Text>
                <Button title="Post a Job" onPress={() => { setShowHireModal(false); router.push("/(employer)/post-job"); }} variant="outline" size="sm" />
              </View>
            ) : (
              myJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={[styles.jobOption, selectedJob === job.id && styles.jobOptionSelected]}
                  onPress={() => { setSelectedJob(job.id); setWage(String(job.daily_wage)); }}
                >
                  <Text style={styles.jobOptionTitle}>{job.title}</Text>
                  <Text style={styles.jobOptionMeta}>₹{job.daily_wage}/day</Text>
                </TouchableOpacity>
              ))
            )}

            <Input label="Agreed Daily Wage (₹)" value={wage} onChangeText={setWage} keyboardType="numeric" prefix="₹" />
            <Input label="Note (optional)" value={note} onChangeText={setNote} placeholder="Any specific instructions..." />

            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setShowHireModal(false)} variant="outline" style={{ flex: 1, marginRight: 8 }} />
              <Button title="Send Request" onPress={handleHire} loading={hiring} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: Colors.white, borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  avatarText: { color: Colors.white, fontWeight: "900", fontSize: 26 },
  workerName: { fontSize: 22, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  workerSkill: { fontSize: 15, color: Colors.textSecondary, marginBottom: 12 },
  badges: { flexDirection: "row", gap: 8 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statBox: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 12, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statVal: { fontSize: 14, fontWeight: "800", color: Colors.dark, marginBottom: 2 },
  statLbl: { fontSize: 10, color: Colors.textMuted },
  detailCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  detailRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  detailLabel: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  footer: { padding: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: Colors.dark, marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  modalLabel: { fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 10 },
  jobOption: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white, marginBottom: 8,
  },
  jobOptionSelected: { borderColor: Colors.primary, backgroundColor: "#FFF3E0" },
  jobOptionTitle: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  jobOptionMeta: { fontSize: 13, color: Colors.primary, fontWeight: "700" },
  noJobsBox: { alignItems: "center", padding: 16, marginBottom: 16 },
  noJobsText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  modalActions: { flexDirection: "row", marginTop: 8 },
});
