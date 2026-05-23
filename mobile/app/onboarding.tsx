import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "⚡",
    title: "Kaam milao, abhi",
    subtitle: "Find daily wage work near you in minutes. No middlemen. No delays.",
    bg: Colors.primary,
  },
  {
    id: "2",
    icon: "🗺️",
    title: "Nearby. Always.",
    subtitle: "See jobs and workers on the map. Hire or get hired within your area.",
    bg: "#1A1A2E",
  },
  {
    id: "3",
    icon: "💰",
    title: "Fair Pay. Fast.",
    subtitle: "Transparent wages. Instant payment tracking. No surprises.",
    bg: "#2D6A4F",
  },
  {
    id: "4",
    icon: "🤝",
    title: "Trusted Network",
    subtitle: "Verified workers. Rated employers. Build your reputation with every job.",
    bg: "#7B2D8B",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const next = () => {
    if (current < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      router.replace("/auth/role-select");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg, width }]}>
            <Text style={styles.slideIcon}>{item.icon}</Text>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === current && styles.dotActive]}
            />
          ))}
        </View>

        <Button
          title={current === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={next}
          size="lg"
        />

        {current < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => router.replace("/auth/role-select")} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 40,
  },
  slideIcon: { fontSize: 80, marginBottom: 32 },
  slideTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 38,
  },
  slideSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 24,
  },
  bottom: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  dots: { flexDirection: "row", justifyContent: "center", marginBottom: 20, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gray200 },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  skip: { alignItems: "center", marginTop: 14 },
  skipText: { fontSize: 14, color: Colors.textMuted },
});
