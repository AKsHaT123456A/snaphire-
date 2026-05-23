import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Colors } from "../theme/colors";

import EmployerHomeScreen from "../screens/employer/HomeScreen";
import EmployerWorkersScreen from "../screens/employer/WorkersScreen";
import PostJobScreen from "../screens/employer/PostJobScreen";
import EmployerHiresScreen from "../screens/employer/HiresScreen";
import EmployerProfileScreen from "../screens/employer/ProfileScreen";

const Tab = createBottomTabNavigator();

function Icon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 18 }}>{emoji}</Text>;
}

export default function EmployerTabs() {
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
      <Tab.Screen name="Home" component={EmployerHomeScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="🏠" focused={focused} /> }} />
      <Tab.Screen name="Workers" component={EmployerWorkersScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="👷" focused={focused} /> }} />
      <Tab.Screen name="Post Job" component={PostJobScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="➕" focused={focused} /> }} />
      <Tab.Screen name="Hires" component={EmployerHiresScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="🤝" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={EmployerProfileScreen} options={{ tabBarIcon: ({ focused }) => <Icon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}
