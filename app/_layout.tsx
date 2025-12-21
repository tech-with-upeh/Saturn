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
        name="receive"
        options={{
          headerShown:false,
          animation: "fade"
        }}
      />
      <Stack.Screen 
        name="buypage"
        options={{
          headerShown:false,
          animation: "slide_from_right"
        }}
      />
      <Stack.Screen 
        name="coinpage"
        options={{
          headerShown:false,
          animation: "slide_from_right"
        }}
      />
      <Stack.Screen 
        name="swappage"
        options={{
          headerShown:false,
          animation: "slide_from_right"
        }}
      />
       <Stack.Screen
        name="profile"
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
          animation: "fade",
        }}
        
      />
      <Stack.Screen
        name="qrscanner"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
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
