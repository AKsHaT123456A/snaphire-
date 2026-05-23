import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { HireCard } from "@/components/HireCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import api from "@/services/api";
import { Hire } from "@/types";

export default function EmployerHiresScreen() {
  const router = useRouter();
  const [hires, setHires] = useState<Hire[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"active" | "all">("active");

  const load = useCallback(async () => {
    try {
      const res = await api.get("/hires/my");
      setHires(res.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  const filtered = filter === "active"
    ? hires.filter((h) => !["payment_done", "rejected", "cancelled"].includes(h.status))
    : hires;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Hires</Text>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "active" && styles.filterBtnActive]}
          onPress={() => setFilter("active")}
        >
          <Text style={[styles.filterText, filter === "active" && styles.filterTextActive]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "all" && styles.filterBtnActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>All History</Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🤝"
          title={filter === "active" ? "No active hires" : "No hire history yet"}
          subtitle={filter === "active"
            ? "Browse workers and send hire requests to get started."
            : "Your complete hiring history will appear here."}
          ctaLabel="Find Workers"
          onCta={() => router.push("/(employer)/workers")}
        />
      ) : (
        <FlashList
          data={filtered}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <HireCard
                hire={item}
                role="employer"
                onPress={() => router.push({ pathname: "/(employer)/hire-detail", params: { id: item.id } })}
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  filterRow: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 8 },
  filterBtn: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: Colors.dark },
  filterTextActive: { color: Colors.white },
  list: { padding: 20 },
  cardWrapper: {},
});
