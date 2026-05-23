import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/services/api";

export default function PhoneScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { phone: `+91${cleaned}`, role });
      router.push({ pathname: "/auth/otp", params: { phone: `+91${cleaned}`, role } });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.emoji}>{role === "worker" ? "👷" : "🏗️"}</Text>
          <Text style={styles.title}>Enter your{"\n"}mobile number</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to confirm your number
          </Text>

          <View style={styles.inputWrapper}>
            <Input
              label="Mobile Number"
              prefix="+91"
              placeholder="98765 43210"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(t) => { setPhone(t.replace(/\D/g, "")); setError(""); }}
              error={error}
            />
          </View>

          <View style={styles.demoNote}>
            <Text style={styles.demoText}>🔐 Demo mode: OTP will always be 123456</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Send OTP"
            onPress={handleSend}
            loading={loading}
            disabled={phone.length < 10}
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  back: { marginBottom: 32 },
  backText: { fontSize: 16, color: Colors.primary, fontWeight: "600" },
  content: { flex: 1 },
  emoji: { fontSize: 56, marginBottom: 20 },
  title: { fontSize: 30, fontWeight: "900", color: Colors.dark, marginBottom: 10, lineHeight: 36 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 32, lineHeight: 22 },
  inputWrapper: { marginBottom: 8 },
  demoNote: {
    backgroundColor: "#FFF3E0",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  demoText: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  footer: { paddingBottom: 32 },
});
