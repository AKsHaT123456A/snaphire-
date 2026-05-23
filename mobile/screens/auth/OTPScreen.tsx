import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import api from "../../services/api";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "OTP">;

export default function OTPScreen({ navigation, route }: Props) {
  const { phone, role } = route.params;
  const setAuth = useAuthStore((s) => s.setAuth);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otp: code, role });
      const { access_token, user_id, role: userRole, profile_complete } = res.data;
      await setAuth(access_token, user_id, userRole, profile_complete);
      if (!profile_complete) {
        navigation.replace(userRole === "worker" ? "WorkerSetup" : "EmployerSetup");
      } else {
        navigation.replace(userRole === "worker" ? "WorkerTabs" : "EmployerTabs");
      }
    } catch (e: any) {
      Alert.alert("Invalid OTP", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Verify your{"\n"}number</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to{"\n"}<Text style={styles.phone}>{phone}</Text></Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { if (r) inputs.current[i] = r; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : {}]}
              value={digit}
              onChangeText={(v) => handleChange(v.replace(/\D/g, "").slice(-1), i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity onPress={() => { if (timer === 0) { api.post("/auth/send-otp", { phone, role }); setTimer(30); } }} style={styles.resend}>
          <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </Text>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Text style={styles.hintText}>💡 Demo: Use 123456 as OTP</Text>
        </View>

        <View style={styles.footer}>
          <Button title="Verify & Continue" onPress={handleVerify} loading={loading} disabled={otp.join("").length < 6} size="lg" />
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
  emoji: { fontSize: 56, marginBottom: 20 },
  title: { fontSize: 30, fontWeight: "900", color: Colors.dark, marginBottom: 10, lineHeight: 36 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 32, lineHeight: 22 },
  phone: { fontWeight: "700", color: Colors.dark },
  otpRow: { flexDirection: "row", gap: 10, marginBottom: 24, justifyContent: "center" },
  otpBox: { width: 48, height: 56, borderRadius: 12, borderWidth: 2, borderColor: Colors.border, fontSize: 22, fontWeight: "700", color: Colors.dark, backgroundColor: Colors.white },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: "#FFF8F0" },
  resend: { alignItems: "center", marginBottom: 20 },
  resendText: { fontSize: 14, color: Colors.primary, fontWeight: "600" },
  resendDisabled: { color: Colors.textMuted },
  hint: { backgroundColor: "#FFF3E0", borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: Colors.primary, marginBottom: 24 },
  hintText: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  footer: { marginTop: "auto", paddingBottom: 32 },
});
