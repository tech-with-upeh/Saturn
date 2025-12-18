import done from "@/assets/lotties/complete.json";
import lott from "@/assets/lotties/load.json";
import { generatefromMnemonics } from "@/backend/walletgen";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { ShieldCheck, UserCircle } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/images/bg.png";

const CreateWallet = async () => {
  const router = useRouter();
  const [walletCreated, setWalletCreated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      try {
        
        setTimeout(() => setWalletCreated(true), 1500);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleGoToDashboard = async () => {
    const data = await generatefromMnemonics();

    console.log("called");
    console.log(data);

    console.log("enddd");
    // const userprofile : UserMeta = {
    //   id: "user",
    //   name: username,
    //   networth: 0,
    //   wallets: [
    //     { id: "wallet1",
    //   name: "Main Wallet",
    //   totalBalance: 0,
    //   coins: data.wallets.map((c: any, index) => ({
    //     id: 0,
    //     name: c.name,
    //     balance: 0,
    //     growthInPerc: 0,
    //     growthInUsd: 0,
    //     createdAt: 0,
    //     chain: c.chain,
    //     address: c.address
    //   })),
    //   createdAt: 0,
    //   lastActiveAt: 0}
    //   ]
    // }
    
    Keyboard.dismiss(); // Closes keyboard immediately
    router.replace("/dashboard"); // Use replace so they can't go back to setup
  };

  const isButtonDisabled = username.trim().length < 3;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground source={Logo} resizeMode="cover" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(2, 1, 5, 0.3)', 'rgba(5, 2, 10, 0.8)', '#020105']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* TOP CONTENT (Lottie & Text) */}
            <View style={styles.mainContent}>
              <Animated.View entering={ZoomIn.duration(600)} style={styles.lottieContainer}>
                <LottieView
                  source={walletCreated ? done : lott}
                  style={styles.lottie}
                  autoPlay
                  loop={!walletCreated}
                />
                <View style={[styles.glow, walletCreated && styles.glowSuccess]} />
              </Animated.View>

              <View style={styles.textWrapper}>
                <Animated.Text entering={FadeInUp} style={styles.title}>
                  {walletCreated ? "Wallet Ready!" : "Creating Wallet..."}
                </Animated.Text>
                <Text style={styles.subtitle}>
                  {walletCreated 
                    ? "Choose a username to represent you on the blockchain." 
                    : "Generating secure keys..."}
                </Text>
              </View>

              {/* USERNAME INPUT */}
              {walletCreated && (
                <Animated.View entering={FadeInDown} style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <UserCircle color={username.length >= 3 ? "#ac71ff" : "#4b5563"} size={22} weight="bold" />
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor="#4b5563"
                      style={styles.textInput}
                      value={username}
                      onChangeText={setUsername}
                      autoCorrect={false}
                    />
                    {username.length >= 3 && <ShieldCheck color="#34d399" size={20} weight="fill" />}
                  </View>
                </Animated.View>
              )}
            </View>

            {/* BUTTONS (Bottom part of ScrollView) */}
            <View style={styles.footer}>
              {walletCreated ? (
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    onPress={ await handleGoToDashboard}
                    disabled={isButtonDisabled}
                    activeOpacity={0.8}
                    style={[
                      styles.button, 
                      styles.primaryButton,
                      isButtonDisabled && { opacity: 0.4 }
                    ]}
                  >
                    <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                    <Text style={styles.secondaryButtonText}>Back up keys</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ac71ff" />
                  <Text style={styles.loadingText}>Finalizing...</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020105' },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'space-between', 
    paddingHorizontal: 24, 
    paddingBottom: 40 
  },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  lottieContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  lottie: { width: 200, height: 200, zIndex: 10 },
  glow: { position: 'absolute', width: 140, height: 140, backgroundColor: '#ac71ff', opacity: 0.1, borderRadius: 70, transform: [{ scale: 1.8 }] },
  glowSuccess: { backgroundColor: '#34d399' },
  textWrapper: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 15, color: '#9ca3af', textAlign: 'center', marginTop: 8 },
  
  inputWrapper: { width: '100%', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(172, 113, 255, 0.2)',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
  },
  textInput: { flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 },

  footer: { width: '100%', marginTop: 20 },
  buttonGroup: { gap: 12 },
  button: { width: '100%', height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  primaryButton: { backgroundColor: '#ac71ff' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(172, 113, 255, 0.2)' },
  secondaryButtonText: { color: '#e9d5ff', fontSize: 15 },
  loadingContainer: { alignItems: 'center', gap: 10 },
  loadingText: { color: '#a5b4fc', fontSize: 13 },
});

export default CreateWallet;