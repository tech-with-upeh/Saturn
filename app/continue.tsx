import lott from "@/assets/lotties/load.json";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { CaretLeft } from "phosphor-react-native";
import React from "react";
import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/images/bg.png";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Continue = () => {
  const isIOS = Platform.OS === "ios";
  const router = useRouter();

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
            <LottieView
              source={lott}
              style={styles.lottie}
              autoPlay
              loop
            />
            {/* Glow effect behind lottie */}
            <View style={styles.glow} />
          </Animated.View>

          <View style={styles.textWrapper}>
            <Animated.Text
              entering={FadeInUp.duration(600).delay(200).springify()}
              style={styles.title}
            >
              Secure Your{"\n"}
              <Text style={styles.titleAccent}>Saturn Assets</Text>
            </Animated.Text>
            
            <Animated.Text
              entering={FadeInUp.duration(600).delay(300).springify()}
              style={styles.subtitle}
            >
              Create a MultiCoin Wallet to store, send, and swap your crypto securely.
            </Animated.Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Animated.Text
            entering={FadeInUp.duration(600).delay(400).springify()}
            style={styles.termsText}
          >
            By continuing, you agree to Saturn’s Terms & Conditions.
          </Animated.Text>

          <Link href={"/createwallet"} asChild>
            <AnimatedTouchableOpacity
                entering={FadeInUp.duration(600).delay(500).springify()}
                style={[styles.button, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>Create Wallet</Text>
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
  lottie: {
    width: 280,
    height: 280,
    zIndex: 10,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: '#ac71ff',
    opacity: 0.15,
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
    color: '#ac71ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 40,
    gap: 20,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
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
});

export default Continue;
