import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "./store/authStore";

// Auth screens
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import RoleSelectScreen from "./screens/auth/RoleSelectScreen";
import PhoneScreen from "./screens/auth/PhoneScreen";
import OTPScreen from "./screens/auth/OTPScreen";
import WorkerSetupScreen from "./screens/auth/WorkerSetupScreen";
import EmployerSetupScreen from "./screens/auth/EmployerSetupScreen";

// Tab navigators
import WorkerTabs from "./navigation/WorkerTabs";
import EmployerTabs from "./navigation/EmployerTabs";

// Shared detail screens
import JobDetailScreen from "./screens/shared/JobDetailScreen";
import WorkerHireDetailScreen from "./screens/worker/HireDetailScreen";
import EmployerHireDetailScreen from "./screens/employer/HireDetailScreen";
import WorkerProfileDetailScreen from "./screens/employer/WorkerProfileDetailScreen";
import NotificationsScreen from "./screens/shared/NotificationsScreen";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  RoleSelect: undefined;
  Phone: { role: string };
  OTP: { phone: string; role: string };
  WorkerSetup: undefined;
  EmployerSetup: undefined;
  WorkerTabs: undefined;
  EmployerTabs: undefined;
  JobDetail: { id: string };
  WorkerHireDetail: { id: string };
  EmployerHireDetail: { id: string };
  WorkerProfileDetail: { id: string };
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
            <Stack.Screen name="Phone" component={PhoneScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="WorkerSetup" component={WorkerSetupScreen} />
            <Stack.Screen name="EmployerSetup" component={EmployerSetupScreen} />
            <Stack.Screen name="WorkerTabs" component={WorkerTabs} />
            <Stack.Screen name="EmployerTabs" component={EmployerTabs} />
            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
            <Stack.Screen name="WorkerHireDetail" component={WorkerHireDetailScreen} />
            <Stack.Screen name="EmployerHireDetail" component={EmployerHireDetailScreen} />
            <Stack.Screen name="WorkerProfileDetail" component={WorkerProfileDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
