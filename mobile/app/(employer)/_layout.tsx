import { Tabs } from "expo-router";
import { Colors } from "@/theme/colors";
import { Text, View } from "react-native";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: focused ? 24 : 20 }}>{emoji}</Text>
    </View>
  );
}

export default function EmployerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="workers"
        options={{ title: "Workers", tabBarIcon: ({ focused }) => <TabIcon emoji="👷" focused={focused} /> }}
      />
      <Tabs.Screen
        name="post-job"
        options={{ title: "Post Job", tabBarIcon: ({ focused }) => <TabIcon emoji="➕" focused={focused} /> }}
      />
      <Tabs.Screen
        name="hires"
        options={{ title: "Hires", tabBarIcon: ({ focused }) => <TabIcon emoji="🤝" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tabs>
  );
}
