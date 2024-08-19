import TimerProvider from "@/context/TimerContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
// import { loadUser } from "./(redux)/authSlice";

// this will prevent the splash screen from auto hiding until loading all the assets is complete
SplashScreen.preventAutoHideAsync();
export default function Structure() {

  const [fontsLoaded, error] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      return; // Optionally handle the error here
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);


  if (!fontsLoaded) {
    return null;
  }

  return (
      <SafeAreaProvider>
        <TimerProvider>
          <Stack>
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/register" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="meditate/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(modal)/adjust-meditation-duration"
              options={{ headerShown: false, presentation: "modal" }}
            />
          </Stack>
        </TimerProvider>
      </SafeAreaProvider>

  );
}
