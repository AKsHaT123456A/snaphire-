import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl,
} from "react-native";
import { Colors } from "@/theme/colors";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import api from "@/services/api";
import { Wallet, Transaction } from "@/types";

export default function WorkerWalletScreen() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [wRes, tRes] = await Promise.all([
        api.get("/wallet/"),
        api.get("/wallet/transactions"),
      ]);
      setWallet(wRes.data);
      setTransactions(tRes.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Wallet</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Earned</Text>
          <Text style={styles.balanceAmount}>₹{(wallet?.total_earned || 0).toLocaleString("en-IN")}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatVal}>₹{(wallet?.balance || 0).toLocaleString("en-IN")}</Text>
              <Text style={styles.balanceStatLbl}>Available</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatVal}>₹{((wallet?.total_earned || 0) - (wallet?.balance || 0)).toLocaleString("en-IN")}</Text>
              <Text style={styles.balanceStatLbl}>Withdrawn</Text>
            </View>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {transactions.length === 0 ? (
            <EmptyState
              icon="💸"
              title="No payments yet"
              subtitle="Complete your first job to see your earnings here."
            />
          ) : (
            transactions.map((txn) => (
              <View key={txn.id} style={styles.txnCard}>
                <View style={[styles.txnIcon, { backgroundColor: txn.type === "credit" ? "#E8F5E9" : "#FFEBEE" }]}>
                  <Text style={styles.txnIconText}>{txn.type === "credit" ? "💰" : "💸"}</Text>
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnDesc}>{txn.description || "Transaction"}</Text>
                  <Text style={styles.txnDate}>{new Date(txn.created_at).toLocaleDateString("en-IN")}</Text>
                </View>
                <Text style={[styles.txnAmount, { color: txn.type === "credit" ? Colors.success : Colors.error }]}>
                  {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  balanceCard: {
    marginHorizontal: 20, marginBottom: 24,
    backgroundColor: Colors.primary, borderRadius: 24, padding: 24,
  },
  balanceLabel: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 4 },
  balanceAmount: { fontSize: 40, fontWeight: "900", color: Colors.white, marginBottom: 20 },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  balanceStat: { flex: 1, alignItems: "center" },
  balanceStatVal: { fontSize: 18, fontWeight: "700", color: Colors.white },
  balanceStatLbl: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  balanceDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.3)" },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 12 },
  txnCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8,
  },
  txnIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 12 },
  txnIconText: { fontSize: 20 },
  txnInfo: { flex: 1 },
  txnDesc: { fontSize: 14, fontWeight: "600", color: Colors.dark },
  txnDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txnAmount: { fontSize: 16, fontWeight: "700" },
});
