import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Ellipse, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import Logo from "../assets/images/bg.png";

const { width } = Dimensions.get('window');

const SaturnIllustration = () => {
  const rotation = useSharedValue(0);
  const floatY = useSharedValue(0);
  const checkasync = async () => {
    const check = await AsyncStorage.getItem('userProfile');
    if (check != null) { 
      router.replace("/dashboard");
    } else {
      console.log("create")
    }
  }

  useEffect(() => {
    checkasync();
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    floatY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { rotateZ: `${rotation.value * 0.1}deg` } // Subtle rotation for the whole container
    ],
  }));

  return (
    <Animated.View style={[styles.saturnContainer, animatedStyle]}>
      <Svg height="250" width="300" viewBox="0 0 300 250">
        <Defs>
          <SvgLinearGradient id="planetGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E9D5FF" stopOpacity="1" />
            <Stop offset="0.4" stopColor="#AC71FF" stopOpacity="1" />
            <Stop offset="1" stopColor="#2D0950" stopOpacity="1" />
          </SvgLinearGradient>
          <SvgLinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#AC71FF" stopOpacity="0.1" />
            <Stop offset="0.3" stopColor="#E9D5FF" stopOpacity="0.8" />
            <Stop offset="0.7" stopColor="#AC71FF" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#2D0950" stopOpacity="0.1" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Back Ring Section */}
        <Ellipse
          cx="150"
          cy="125"
          rx="120"
          ry="35"
          stroke="url(#ringGrad)"
          strokeWidth="15"
          fill="none"
          transform="rotate(-15, 150, 125)"
          strokeDasharray="10 5"
        />

        {/* Planet Body */}
        <Circle cx="150" cy="125" r="70" fill="url(#planetGrad)" />
        
        {/* Front Ring Detail */}
        <Circle cx="130" cy="110" r="15" fill="rgba(255,255,255,0.2)" />
        
         <Ellipse
          cx="150"
          cy="125"
          rx="130"
          ry="40"
          stroke="#fff"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="none"
          transform="rotate(-15, 150, 125)"
        />
      </Svg>
    </Animated.View>
  );
};

export default function Index() {
  const router = useRouter();

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background with Image and Gradient Overlay */}
      <ImageBackground
        source={Logo}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={['transparent', 'rgba(15, 5, 30, 0.6)', 'rgba(5, 2, 10, 0.95)', '#020105']}
          locations={[0, 0.4, 0.75, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      {/* Content Container */}
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.mainContent}>
          {/* Animated Saturn */}
          <Animated.View entering={FadeInUp.duration(1000).springify()}>
             <SaturnIllustration />
          </Animated.View>

          <View style={styles.textContainer}>
            <Animated.View 
              entering={FadeInUp.duration(600).delay(200).springify()}
              style={styles.headerWrapper}
            >
              <Text style={styles.brandText}>
                Satu<Text style={styles.brandAccent}>rn</Text>
              </Text>
              <Text style={styles.taglineText}>
                Where Degens{"\n"}Trade Smarter
              </Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.duration(600).delay(400).springify()}
              style={styles.descriptionText}
            >
              Buy the dip, embrace the memes, and never check your bank account again.
            </Animated.Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/continue" asChild>
            <Pressable>
              <Animated.View 
                entering={FadeInDown.duration(600).delay(500).springify()}
                style={[styles.button, styles.primaryButton]}
              > 
                <Text style={styles.primaryButtonText}>Create Wallet</Text>
              </Animated.View>
            </Pressable>
          </Link>

          <Link href="/importwallet" asChild>
            <Pressable>
              <Animated.View 
                entering={FadeInDown.duration(600).delay(650).springify()}
                style={[styles.button, styles.secondaryButton]}
              > 
                <Text style={styles.secondaryButtonText}>Import Wallet</Text>
              </Animated.View>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020105',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  saturnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ac71ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -20, // Pull text slightly closer to planet
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  brandText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -2,
    marginBottom: 8,
  },
  brandAccent: {
    color: '#ac71ff',
  },
  taglineText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#e9d5ff',
    textAlign: 'center',
    lineHeight: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
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
    alignItems: 'center'
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
