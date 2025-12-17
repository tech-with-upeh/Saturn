import done from "@/assets/lotties/complete.json";
import lott from "@/assets/lotties/load.json";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/images/bg.png";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CreateWallet = () => {
  const isIOS = Platform.OS === "ios";
  const router = useRouter();
  const [walletCreated, setWalletCreated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWalletCreated(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background */}
      <ImageBackground
        source={Logo}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={['rgba(2, 1, 5, 0.3)', 'rgba(5, 2, 10, 0.8)', '#020105']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.mainContent}>
          {/* Lottie Animation Section */}
          <Animated.View 
            entering={ZoomIn.duration(600).springify()}
            style={styles.lottieContainer}
          >
            <LottieView
              source={walletCreated ? done : lott}
              style={styles.lottie}
              autoPlay
              loop={!walletCreated}
            />
            {/* Glow effect */}
            <View style={[styles.glow, walletCreated && styles.glowSuccess]} />
          </Animated.View>

          {/* Text Status Section */}
          <View style={styles.textWrapper}>
            <Animated.Text
              key={walletCreated ? "title-done" : "title-loading"} // Force re-render animation
              entering={FadeInUp.duration(500).springify()}
              style={styles.title}
            >
              {walletCreated ? (
                <>
                  Wallet <Text style={styles.titleAccent}>Ready!</Text>
                </>
              ) : (
                "Creating Wallet..."
              )}
            </Animated.Text>

            <Animated.Text
              key={walletCreated ? "sub-done" : "sub-loading"}
              entering={FadeInUp.duration(500).delay(100).springify()}
              style={styles.subtitle}
            >
              {walletCreated
                ? "Your secure MultiCoin vault has been successfully initialized."
                : "We are generating your cryptographic keys. Do not close this page."}
            </Animated.Text>
          </View>

          {/* Warning Note (Only when created) */}
          {walletCreated && (
            <Animated.View 
              entering={FadeInDown.duration(600).delay(200).springify()}
              style={styles.warningContainer}
            >
              <Text style={styles.warningText}>
                ⚠️ We do not store your keys. Make sure to back them up immediately!
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.footer}>
          {walletCreated ? (
            <View style={styles.buttonGroup}>
              <Link
                href="/dashboard"
                onPress={() => router.dismissAll()}
                asChild
              >
                <AnimatedTouchableOpacity
                  entering={FadeInUp.duration(600).springify()}
                  activeOpacity={0.8}
                  style={[styles.button, styles.primaryButton]}
                >
                  <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
                </AnimatedTouchableOpacity>
              </Link>

              <AnimatedTouchableOpacity
                entering={FadeInUp.duration(600).delay(100).springify()}
                activeOpacity={0.8}
                style={[styles.button, styles.secondaryButton]}
                onPress={() => {
                  // TODO: Navigate to backup screen
                  console.log("Navigate to backup");
                }}
              >
                <Text style={styles.secondaryButtonText}>Back up now</Text>
              </AnimatedTouchableOpacity>
            </View>
          ) : (
             <Animated.View 
              entering={FadeInUp.duration(400)}
              style={styles.loadingContainer}
             >
                <ActivityIndicator color="#ac71ff" size="large" />
                <Text style={styles.loadingText}>Finalizing setup...</Text>
             </Animated.View>
          )}
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
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 60,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  lottieContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  lottie: {
    width: 280,
    height: 280,
    zIndex: 10,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    backgroundColor: '#ac71ff',
    opacity: 0.1,
    borderRadius: 110,
    transform: [{ scale: 1.5 }],
    zIndex: 0,
  },
  glowSuccess: {
    backgroundColor: '#34d399', // Green glow for success
    opacity: 0.15,
  },
  textWrapper: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 40,
  },
  titleAccent: {
    color: '#ac71ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 24,
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 171, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 171, 0, 0.2)',
    marginTop: 10,
    maxWidth: '90%',
  },
  warningText: {
    color: '#fbbf24',
    fontSize: 13,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
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
    borderColor: 'rgba(172, 113, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#e9d5ff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    gap: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CreateWallet;
