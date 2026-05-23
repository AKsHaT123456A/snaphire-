import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { Colors } from "@/theme/colors";

export default function SplashScreen() {
  const router = useRouter();
  const { token, role, profileComplete, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (!token) {
        router.replace("/onboarding");
      } else if (!profileComplete) {
        router.replace(role === "worker" ? "/auth/worker-setup" : "/auth/employer-setup");
      } else {
        router.replace(role === "worker" ? "/(worker)/home" : "/(employer)/home");
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
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: { alignItems: "center", marginBottom: 20 },
  logoIcon: { fontSize: 64, marginBottom: 8 },
  logoText: {
    fontSize: 42,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    marginBottom: 4,
  },
  taglineEn: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
  },
});
