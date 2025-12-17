import { useThemeColors } from "@/constants/theme";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import {
  ClockIcon,
  GearFineIcon,
  HouseSimpleIcon,
  PaperPlaneTiltIcon,
} from "phosphor-react-native";
import React, { createContext, useEffect, useRef, useState } from "react";
import { Animated, Text, useWindowDimensions } from "react-native";
import "../globals.css";


export const TabBarContext = createContext({
  hideTabBar: () => {},
  showTabBar: () => {},
});

export default function RootLayout() {
  
  const theme = useThemeColors();
  const { width } = useWindowDimensions();

  const tabs = [
    { name: "index", label: "Home", href: "/", icon: HouseSimpleIcon },
    {
      name: "send",
      label: "Send",
      href: "/dashboard/send",
      icon: PaperPlaneTiltIcon,
    },
    {
      name: "history",
      label: "History",
      href: "/dashboard/history",
      icon: ClockIcon,
    },
    {
      name: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: GearFineIcon,
    },
  ] as const;

   const [tabBarVisible, setTabBarVisible] = useState(true);

   
  const contextValue = {
    hideTabBar: () => setTabBarVisible(false),
    showTabBar: () => setTabBarVisible(true),
  };
  const [activeTab, setActiveTab] = React.useState<
    (typeof tabs)[number]["name"]
  >(tabs[0].name);

   useEffect(() => {
    const index = tabs.findIndex((t) => t.name === activeTab);
    Animated.spring(slideAnim, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      stiffness: 150,
      damping: 18,
    }).start();
  }, [activeTab]);

  const tabWidth = (width * 0.9) / tabs.length;
  const slideAnim = useRef(new Animated.Value(0)).current;

  return (
    <TabBarContext.Provider value={contextValue}>
      <Tabs>
        <TabSlot />
        { tabBarVisible &&
          <TabList
          style={{
            position: "absolute",
            bottom: 20,
            left: "5%",
            width: "90%",
            height: 60,
            backgroundColor: theme.border,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 5 },
            elevation: 10,
            overflow: "hidden",
          }}
        >
          {/* Purple highlight */}
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              width: tabWidth,
              height: "100%",
              backgroundColor: theme.primary,
              borderRadius: 25,
              transform: [{ translateX: slideAnim }],
            }}
          />

          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            const Icon = tab.icon;

            const iconY = useRef(new Animated.Value(0)).current;
            const textY = useRef(new Animated.Value(10)).current;
            const opacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

            useEffect(() => {
              Animated.parallel([
                Animated.timing(iconY, {
                  toValue: isActive ? 0 : 5,
                  duration: 250,
                  useNativeDriver: true,
                }),
                Animated.timing(textY, {
                  toValue: isActive ? 0 : 14,
                  duration: 250,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: isActive ? 1 : 0,
                  duration: 250,
                  useNativeDriver: true,
                }),
              ]).start();
            }, [isActive]);

            return (
              <TabTrigger
                key={tab.name}
                name={tab.name}
                href={tab.href}
                onTouchEnd={() => setActiveTab(tab.name)}
                style={{
                  width: tabWidth,
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Animated.View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ translateY: iconY }],
                  }}
                >
                  <Icon
                    size={isActive ? 20 : 22}
                    color={isActive ? "white" : theme.text}
                    weight={isActive ? "fill" : "regular"}
                  />
                </Animated.View>

                <Animated.View
                  style={{
                    opacity,
                    transform: [{ translateY: textY }],
                  }}
                >
                  <Text
                    style={{
                      color: isActive ? "white" : theme.txtsec,
                      fontWeight: "500",
                      fontSize: 11,
                    }}
                  >
                    {tab.label}
                  </Text>
                </Animated.View>
              </TabTrigger>
            );
          })}
          </TabList>
        }
        
      </Tabs>
    </TabBarContext.Provider>
    
  );
}
