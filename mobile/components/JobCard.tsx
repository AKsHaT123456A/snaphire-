import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { Badge } from "./ui/Badge";
import { SKILL_CATEGORIES } from "@/constants";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export function JobCard({ job, onPress }: JobCardProps) {
  const skill = SKILL_CATEGORIES.find((s) => s.value === job.skill_category);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{skill?.icon || "💼"}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
          <Text style={styles.employer} numberOfLines={1}>
            {job.employer_name || "Employer"} {job.employer_company ? `• ${job.employer_company}` : ""}
          </Text>
        </View>
        {job.is_urgent && (
          <Badge label="URGENT" bg={Colors.error} />
        )}
      </View>

      <View style={styles.tags}>
        <Badge label={skill?.label || job.skill_category} bg={Colors.gray100} color={Colors.dark} />
        {job.is_immediate && (
          <Badge label="Immediate" bg="#FFF3E0" color={Colors.primary} />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹{job.daily_wage.toLocaleString("en-IN")}</Text>
          <Text style={styles.statLabel}>per day</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{job.duration_days}d</Text>
          <Text style={styles.statLabel}>duration</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{job.workers_needed}</Text>
          <Text style={styles.statLabel}>workers</Text>
        </View>
        {job.distance_km !== undefined && (
          <>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{job.distance_km < 1 ? `${(job.distance_km * 1000).toFixed(0)}m` : `${job.distance_km.toFixed(1)}km`}</Text>
              <Text style={styles.statLabel}>away</Text>
            </View>
          </>
        )}
      </View>

      {job.city && (
        <Text style={styles.location}>📍 {job.city}{job.address ? ` • ${job.address}` : ""}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  icon: { fontSize: 22 },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: Colors.dark },
  employer: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  tags: { flexDirection: "row", gap: 6, marginBottom: 12, flexWrap: "wrap" },
  footer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.gray50, borderRadius: 10, padding: 10 },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 15, fontWeight: "700", color: Colors.dark },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  divider: { width: 1, height: 28, backgroundColor: Colors.border },
  location: { fontSize: 12, color: Colors.textSecondary, marginTop: 8 },
});
