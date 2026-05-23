import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";
import { Notification } from "@/types";

const TYPE_ICONS: Record<string, string> = {
  hire_request: "🤝",
  payment: "💰",
  job_update: "📋",
  notification: "🔔",
};

export function NotificationCard({ notif }: { notif: Notification }) {
  const icon = TYPE_ICONS[notif.type || "notification"] || "🔔";
  const timeAgo = getTimeAgo(notif.created_at);

  return (
    <View style={[styles.card, !notif.is_read && styles.unread]}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{notif.title}</Text>
        <Text style={styles.body}>{notif.body}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
      {!notif.is_read && <View style={styles.dot} />}
    </View>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    alignItems: "flex-start",
  },
  unread: { backgroundColor: "#FFF8F0" },
  iconBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.gray100, alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  icon: { fontSize: 18 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  body: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  time: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 4 },
});
