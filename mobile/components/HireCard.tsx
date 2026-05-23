import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { HIRE_STATUS_LABELS, HIRE_STATUS_COLORS } from "@/constants";
import { Hire } from "@/types";

interface HireCardProps {
  hire: Hire;
  onPress: () => void;
  role: "worker" | "employer";
}

export function HireCard({ hire, onPress, role }: HireCardProps) {
  const statusColor = HIRE_STATUS_COLORS[hire.status] || Colors.gray400;
  const statusLabel = HIRE_STATUS_LABELS[hire.status] || hire.status;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.jobTitle} numberOfLines={1}>{hire.job_title || "Job"}</Text>
          <Text style={styles.person}>
            {role === "worker" ? `👤 ${hire.employer_name || "Employer"}` : `👷 ${hire.worker_name || "Worker"}`}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.wage}>₹{hire.agreed_wage.toLocaleString("en-IN")}/day</Text>
        <Text style={styles.date}>{new Date(hire.created_at).toLocaleDateString("en-IN")}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  left: { flex: 1, marginRight: 10 },
  jobTitle: { fontSize: 15, fontWeight: "700", color: Colors.dark },
  person: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  wage: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  date: { fontSize: 12, color: Colors.textMuted },
});
