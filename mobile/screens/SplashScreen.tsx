import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";
import { Colors } from "../theme/colors";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const { token, role, profileComplete, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (!token) {
        navigation.replace("Onboarding");
      } else if (!profileComplete) {
        navigation.replace(role === "worker" ? "WorkerSetup" : "EmployerSetup");
      } else {
        navigation.replace(role === "worker" ? "WorkerTabs" : "EmployerTabs");
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isLoading, token, role, profileComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoIcon}>⚡</Text>
        <Text style={styles.logoText}>SnapHire</Text>
      </View>
      <Text style={styles.tagline}>Kaam milao, kal nahi — abhi</Text>
      <Text style={styles.taglineEn}>Find work. Hire fast. Right now.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  logoBox: { alignItems: "center", marginBottom: 20 },
  logoIcon: { fontSize: 64, marginBottom: 8 },
  logoText: { fontSize: 42, fontWeight: "900", color: Colors.white, letterSpacing: -1 },
  tagline: { fontSize: 16, color: "rgba(255,255,255,0.85)", fontWeight: "600", marginBottom: 4 },
  taglineEn: { fontSize: 13, color: "rgba(255,255,255,0.65)" },
});
