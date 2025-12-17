import lott from "@/assets/lotties/import_wallet.json";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { CaretLeft } from "phosphor-react-native";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ImportWallet = () => {
  const isIOS = Platform.OS === "ios";
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      

      <SafeAreaView style={styles.contentContainer}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.duration(500).springify()}
          style={styles.header}
        >
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <CaretLeft color="#ffffff" size={24} weight="bold" />
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Animated.View
            entering={ZoomIn.duration(600).springify()}
            style={styles.lottieContainer}
          >
            <View style={styles.lottieWrapper}>
              <LottieView
                source={lott}
                style={styles.lottie}
                autoPlay
                loop
              />
            </View>
            {/* Glow effect */}
            <View style={styles.glow} />
          </Animated.View>

          <View style={styles.textWrapper}>
            <Animated.Text
              entering={FadeInUp.duration(600).delay(200).springify()}
              style={styles.title}
            >
              Restore Your{"\n"}
              <Text style={styles.titleAccent}>KudiX Vault</Text>
            </Animated.Text>
            
            <Animated.Text
              entering={FadeInUp.duration(600).delay(300).springify()}
              style={styles.subtitle}
            >
              Recover access using your Secret Recovery Phrase or Private Keys.
            </Animated.Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/importphrase" asChild>
            <AnimatedTouchableOpacity
              entering={FadeInUp.duration(600).delay(400).springify()}
              activeOpacity={0.8}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>Import Secret Phrase</Text>
            </AnimatedTouchableOpacity>
          </Link>

          <Link href="/importkey" asChild>
            <AnimatedTouchableOpacity
              entering={FadeInUp.duration(600).delay(550).springify()}
              activeOpacity={0.8}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryButtonText}>Import Private Key</Text>
            </AnimatedTouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020105',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  lottieContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lottieWrapper: {
    width: 280,
    height: 280,
    borderRadius: 40,
    overflow: 'hidden',
    zIndex: 10,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: '#68c1fc', // Blue-ish glow for import theme to match original text color
    opacity: 0.2,
    borderRadius: 100,
    transform: [{ scale: 1.5 }],
    zIndex: 0,
  },
  textWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 40,
  },
  titleAccent: {
    color: '#68c1fc', // Keeping the blue accent for "Restore" theme differentiation
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#ac71ff',
    shadowColor: '#ac71ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(45, 9, 80, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(172, 113, 255, 0.2)',
  },
  secondaryButtonText: {
    color: '#e9d5ff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ImportWallet;
