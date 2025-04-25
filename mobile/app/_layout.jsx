import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useEffect, useState, useCallback } from "react";
import "../lib/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, token, isCheckingAuth } = useAuthStore();
  const { theme, colors, loadPreferencesFromStorage } = useThemeStore();

  const [isAppReady, setIsAppReady] = useState(false);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    async function prepareData() {
      try {
        await Promise.all([
          loadPreferencesFromStorage(),
          checkAuth(),
        ]);
      } catch (e) {
        console.warn("Error loading initial app data:", e);
      } finally {
        setIsInitialDataLoaded(true);
      }
    }

    prepareData();
  }, []);

  useEffect(() => {
    const fontsReady = fontsLoaded || fontError;
    if (fontsReady && isInitialDataLoaded) {
      console.log("App is fully ready (fonts & data).");
      setIsAppReady(true);
    }
  }, [fontsLoaded, fontError, isInitialDataLoaded]);

  useEffect(() => {
    if (!isAppReady) {
      console.log("App not ready, skipping navigation check.");
      return;
    }
    if (isCheckingAuth) {
        console.log("Auth check still in progress, delaying navigation check slightly.");
        return;
    }

    console.log("App is ready, checking navigation...");

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = !!token;

    console.log(`Navigation Check: isSignedIn=${isSignedIn}, inAuthGroup=${inAuthGroup}, segments=`, segments);

    if (!isSignedIn && !inAuthGroup) {
      console.log("Redirecting to /signup");
      router.replace("/signup");
    } else if (isSignedIn && inAuthGroup) {
      console.log("Redirecting to /(tabs)");
      router.replace("/(tabs)");
    } else {
      console.log("No navigation redirect needed.");
    }
  }, [isAppReady, token, segments, router, isCheckingAuth]);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      console.log("Hiding SplashScreen because isAppReady is true.");
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady || !colors) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <SafeScreen style={{ backgroundColor: colors.background }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen 
            name="edit-review/[id]"
            options={{
              headerShown: true,
              title: 'Edit Review',
              headerStyle: { backgroundColor: colors.cardBackground },
              headerTintColor: colors.textPrimary,
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal',
            }}
          />
        </Stack>
      </SafeScreen>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}
