import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { HIRE_STATUS_LABELS, HIRE_STATUS_COLORS } from "../../constants";
import api from "../../services/api";
import { Hire } from "../../types";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "WorkerHireDetail">;

const WORKER_ACTIONS: Record<string, { next: string; label: string; variant?: string }[]> = {
  pending: [{ next: "accepted", label: "Accept Job" }, { next: "rejected", label: "Decline", variant: "outline" }],
  accepted: [{ next: "on_the_way", label: "I'm On My Way" }],
  on_the_way: [{ next: "started", label: "Work Started" }],
  started: [{ next: "completed", label: "Mark Completed" }],
};

export default function WorkerHireDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [hire, setHire] = useState<Hire | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get("/hires/my").then((r) => { setHire(r.data.find((h: Hire) => h.id === id) || null); }).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/hires/${id}/status`, { status });
      setHire(res.data);
    } catch (e: any) { Alert.alert("Error", e.message); }
    finally { setUpdating(false); }
  };

  if (loading) return <LoadingScreen />;
  if (!hire) return null;

  const statusColor = HIRE_STATUS_COLORS[hire.status] || Colors.gray400;
  const statusLabel = HIRE_STATUS_LABELS[hire.status] || hire.status;
  const actions = WORKER_ACTIONS[hire.status] || [];
  const statuses = ["pending", "accepted", "on_the_way", "started", "completed", "payment_done"];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.topTitle}>Job Details</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <View style={styles.statusCard}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
            <Text style={styles.jobTitle}>{hire.job_title || "Job"}</Text>
            <Text style={styles.employer}>👤 {hire.employer_name || "Employer"}</Text>
          </View>
          <View style={styles.detailCard}>
            {[{ label: "Agreed Wage", value: `₹${hire.agreed_wage.toLocaleString("en-IN")}/day` }, { label: "Hire Date", value: new Date(hire.created_at).toLocaleDateString("en-IN") }].map((r) => (
              <View key={r.label} style={styles.detailRow}><Text style={styles.detailLabel}>{r.label}</Text><Text style={styles.detailValue}>{r.value}</Text></View>
            ))}
          </View>
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Progress</Text>
            {statuses.map((s, i) => {
              const isDone = i <= statuses.indexOf(hire.status);
              return (
                <View key={s} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, isDone && styles.timelineDotDone]} />
                  <Text style={[styles.timelineLabel, isDone && styles.timelineLabelDone]}>{HIRE_STATUS_LABELS[s] || s}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      {actions.length > 0 && (
        <View style={styles.footer}>
          {actions.map((action) => (
            <Button key={action.next} title={action.label} onPress={() => updateStatus(action.next)} loading={updating} variant={(action.variant as any) || "primary"} style={{ marginBottom: 8 }} />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  back: { fontSize: 16, color: Colors.primary, fontWeight: "600", width: 60 },
  topTitle: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  scroll: { flex: 1 },
  container: { padding: 20 },
  statusCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  statusText: { fontSize: 14, fontWeight: "700" },
  jobTitle: { fontSize: 20, fontWeight: "800", color: Colors.dark, textAlign: "center", marginBottom: 6 },
  employer: { fontSize: 14, color: Colors.textSecondary },
  detailCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  timelineCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16 },
  timelineTitle: { fontSize: 14, fontWeight: "700", color: Colors.dark, marginBottom: 16 },
  timelineItem: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.gray200, marginRight: 12 },
  timelineDotDone: { backgroundColor: Colors.primary },
  timelineLabel: { fontSize: 14, color: Colors.textMuted },
  timelineLabelDone: { color: Colors.dark, fontWeight: "600" },
  footer: { padding: 20, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
});
