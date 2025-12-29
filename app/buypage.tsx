import { useThemeColors } from "@/constants/theme";
import { router } from "expo-router";
import { ArrowLeft, BellRinging, RocketLaunch, Sparkle } from "phosphor-react-native";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

const BuyPage = () => {
  const theme = useThemeColors();

  // Animation Values
  const floatValue = useSharedValue(0);
  const glowValue = useSharedValue(0.4);

  useEffect(() => {
    // Floating movement
    floatValue.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1
    );

    // Pulsing glow
    glowValue.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatValue.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowValue.value,
    transform: [{ scale: 0.8 + glowValue.value * 0.4 }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: 24 }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.text} size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Buy Crypto</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        
        {/* ANIMATED CENTERPIECE */}
        <View style={styles.visualContainer}>
          {/* Subtle background glow */}
          <Animated.View style={[
            styles.glowCircle, 
            { backgroundColor: theme.primary }, 
            animatedGlowStyle
          ]} />
          
          <Animated.View style={[
            styles.glassCard, 
            { backgroundColor: theme.card, borderColor: theme.border },
            animatedCardStyle
          ]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary + "20" }]}>
              <RocketLaunch color={theme.primary} size={42} weight="duotone" />
            </View>
            <Text style={[styles.comingSoonText, { color: theme.text }]}>Coming Soon</Text>
            <Text style={[styles.description, { color: theme.txtsec }]}>
              We are partnering with major ramps to bring you the lowest fees in the industry.
            </Text>
          </Animated.View>
        </View>

        {/* FEATURES TEASER */}
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Sparkle color={theme.primary} size={20} weight="fill" />
            <Text style={[styles.featureText, { color: theme.text }]}>Zero-fee fiat on-ramps</Text>
          </View>
          <View style={styles.featureItem}>
            <Sparkle color={theme.primary} size={20} weight="fill" />
            <Text style={[styles.featureText, { color: theme.text }]}>Buy with Apple Pay & Card</Text>
          </View>
        </View>

        {/* NOTIFY ME BUTTON */}
        <TouchableOpacity 
          style={[styles.notifyButton, { backgroundColor: theme.text }]}
          activeOpacity={0.8}
        >
          <BellRinging color={theme.background} size={20} weight="bold" />
          <Text style={[styles.notifyText, { color: theme.background }]}>Notify Me on Launch</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center' },
  
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 300,
  },
  glowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    filter: 'blur(60px)', // Note: standard RN blur might need a View wrapper or Image
    opacity: 0.3,
  },
  glassCard: {
    width: '100%',
    padding: 30,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  comingSoonText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  featureList: {
    marginTop: 40,
    gap: 16,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 16,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notifyButton: {
    marginTop: 'auto',
    marginBottom: 40,
    width: '100%',
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  notifyText: {
    fontSize: 17,
    fontWeight: '700',
  },
});

export default BuyPage;