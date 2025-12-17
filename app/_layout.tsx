import { Stack } from "expo-router";
import "../polyfills";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack>
      {/* <Stack screenOptions={{headerShown: false}}/> */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="continue"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="createwallet"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="importwallet" options={{ headerShown: false }} />
      <Stack.Screen
        name="importkey"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="importphrase"
        options={{
          headerShown: false,

          animation: "slide_from_bottom",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
