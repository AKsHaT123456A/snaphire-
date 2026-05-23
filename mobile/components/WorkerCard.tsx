import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { Badge } from "./ui/Badge";
import { SKILL_CATEGORIES } from "@/constants";
import { WorkerProfile } from "@/types";

interface WorkerCardProps {
  worker: WorkerProfile;
  onPress: () => void;
  onHire?: () => void;
}

export function WorkerCard({ worker, onPress, onHire }: WorkerCardProps) {
  const skill = SKILL_CATEGORIES.find((s) => s.value === worker.skill_category);
  const initials = (worker.name || "W").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{worker.name || "Worker"}</Text>
            {worker.is_verified && <Text style={styles.verified}>✓</Text>}
          </View>
          <Text style={styles.skill}>{skill?.icon} {skill?.label || worker.skill_category}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>⭐ {worker.rating.toFixed(1)} ({worker.total_reviews})</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{worker.experience_years}yr exp</Text>
            {worker.distance_km !== undefined && (
              <>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.metaText}>
                  {worker.distance_km < 1 ? `${(worker.distance_km * 1000).toFixed(0)}m` : `${worker.distance_km.toFixed(1)}km`}
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.wage}>₹{worker.daily_wage.toLocaleString("en-IN")}</Text>
          <Text style={styles.wageLabel}>/day</Text>
          <View style={[styles.availDot, { backgroundColor: worker.is_available ? Colors.success : Colors.gray400 }]} />
        </View>
      </View>
      {worker.city && <Text style={styles.city}>📍 {worker.city}</Text>}
      {onHire && (
        <TouchableOpacity style={styles.hireBtn} onPress={onHire}>
          <Text style={styles.hireBtnText}>Hire Now</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  avatarText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  name: { fontSize: 15, fontWeight: "700", color: Colors.dark },
  verified: { fontSize: 12, color: Colors.success, fontWeight: "700" },
  skill: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  meta: { flexDirection: "row", alignItems: "center", marginTop: 4, flexWrap: "wrap" },
  metaText: { fontSize: 12, color: Colors.textMuted },
  dot: { fontSize: 12, color: Colors.textMuted, marginHorizontal: 4 },
  right: { alignItems: "flex-end" },
  wage: { fontSize: 16, fontWeight: "700", color: Colors.primary },
  wageLabel: { fontSize: 10, color: Colors.textMuted },
  availDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  city: { fontSize: 12, color: Colors.textSecondary, marginTop: 8 },
  hireBtn: {
    marginTop: 10, backgroundColor: Colors.primary,
    borderRadius: 10, paddingVertical: 10, alignItems: "center",
  },
  hireBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
});
