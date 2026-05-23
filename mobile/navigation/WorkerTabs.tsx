import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Colors } from "../theme/colors";

import WorkerHomeScreen from "../screens/worker/HomeScreen";
import WorkerJobsScreen from "../screens/worker/JobsScreen";
import WorkerMapScreen from "../screens/worker/MapScreen";
import WorkerWalletScreen from "../screens/worker/WalletScreen";
import WorkerProfileScreen from "../screens/worker/ProfileScreen";

const Tab = createBottomTabNavigator();

function Icon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 18 }}>{emoji}</Text>;
}

export default function WorkerTabs() {
  return (
    <Tab.Navigator
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
      <Tab.Screen name="Home" component={WorkerHomeScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Jobs" component={WorkerJobsScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="💼" focused={focused} /> }} />
      <Tab.Screen name="Map" component={WorkerMapScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="🗺️" focused={focused} /> }} />
      <Tab.Screen name="Wallet" component={WorkerWalletScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="💰" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={WorkerProfileScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}
