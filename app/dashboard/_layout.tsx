import { useThemeColors } from "@/constants/theme";
import { usePathname } from "expo-router"; // Import this
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import {
  ClockIcon,
  GearFineIcon,
  HouseSimpleIcon,
  PaperPlaneTiltIcon,
} from "phosphor-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Keyboard, Platform, useWindowDimensions, View } from "react-native";
import "../globals.css";

export default function RootLayout() {
  const theme = useThemeColors();
  const { width } = useWindowDimensions();
  const pathname = usePathname(); // Get current route

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const tabs = useMemo(() => [
    { name: "index", label: "Home", href: "/", icon: HouseSimpleIcon },
    { name: "send", label: "Send", href: "/dashboard/send", icon: PaperPlaneTiltIcon },
    { name: "history", label: "History", href: "/dashboard/history", icon: ClockIcon },
    { name: "settings", label: "Settings", href: "/dashboard/settings", icon: GearFineIcon },
  ], []);

  // Sync active tab with the actual URL pathname
  const activeTabIndex = useMemo(() => {
    const index = tabs.findIndex(tab => tab.href === pathname);
    return index === -1 ? 0 : index;
  }, [pathname, tabs]);

  const tabWidth = (width * 0.9) / tabs.length;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeTabIndex * tabWidth,
      useNativeDriver: true,
      stiffness: 200, // Slightly faster for premium feel
      damping: 20,
    }).start();
  }, [activeTabIndex, tabWidth]);

  return (
    <Tabs>
      <TabSlot />

      <TabList
        style={{
          display: isKeyboardVisible ? "none" : "flex",
          position: "absolute",
          bottom: 30, // Lifted slightly more
          left: "5%",
          width: "90%",
          height: 64, // Taller for better touch targets
          backgroundColor: theme.card, // Use theme.card instead of border for depth
          borderRadius: 24,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        }}
      >
        {/* Animated Highlight */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            width: tabWidth,
            height: "100%",
            padding: 6, // Padding creates the "pill inside a container" look
            transform: [{ translateX: slideAnim }],
          }}
        >
          <View style={{ 
            flex: 1, 
            backgroundColor: theme.primary, 
            borderRadius: 18 
          }} />
        </Animated.View>

        {tabs.map((tab, index) => {
          const isActive = activeTabIndex === index;
          const Icon = tab.icon;

          return (
            <TabTrigger
              key={tab.name}
              name={tab.name}
              href={tab.href as any}
              style={{
                width: tabWidth,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TabIconItem 
                isActive={isActive} 
                Icon={Icon} 
                label={tab.label} 
                theme={theme} 
              />
            </TabTrigger>
          );
        })}
      </TabList>
    </Tabs>
  );
}

// Sub-component to handle internal animations for each tab item
function TabIconItem({ isActive, Icon, label, theme }: any) {
  const iconY = useRef(new Animated.Value(isActive ? -2 : 0)).current;
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconY, {
        toValue: isActive ? -4 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ transform: [{ translateY: iconY }] }}>
        <Icon
          size={22}
          color={isActive ? "white" : theme.txtsec}
          weight={isActive ? "fill" : "regular"}
        />
      </Animated.View>
      
      {/* Label only shows when active or with very low opacity when inactive */}
      <Animated.Text
        style={{
          opacity,
          color: "white",
          fontWeight: "700",
          fontSize: 10,
          marginTop: 0,
          position: 'absolute',
          bottom: -8
        }}
      >
        {label}
      </Animated.Text>
    </View>
  );
}