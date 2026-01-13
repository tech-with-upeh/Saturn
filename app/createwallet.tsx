import done from "@/assets/lotties/complete.json";
import lott from "@/assets/lotties/load.json";
import { getBnbBalance, getBtcBalance, getEthBalance, getPrices, getSolBalance } from "@/backend/balanceapi";
import { Coins, generatefromMnemonics } from "@/backend/walletgen";
import Toast, { ToastType } from "@/components/toast";
import { KeysMeta, UserMeta } from "@/models/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import LottieView from "lottie-react-native";
import { ShieldCheckIcon, UserCircleIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
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

const CreateWallet =  () => {
  const router = useRouter();
  const [walletCreated, setWalletCreated] = useState(false);
  const [showloading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [walletName, setWalletName] = useState("");

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const showToast = (message: string, type: ToastType = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  useEffect(() => {
    setTimeout(() => setWalletCreated(true), 1500);
  }, []);

  const handleGoToDashboard = async () => {
    if (!username) {
      showToast("Please create a username", "error");
      setLoading(false);
      return;
    }

    // HydMgNRv3uaYxPm5EN6HWKcgHcCiJsrrAgM8TBGUCuSN

    // B1Uj95kdpYEGgvEFEATVLJ8TiQ7e6cqDgF3Rn7jHmFXC
    
    const data = await generatefromMnemonics();
    
    // Fetch prices and balances
    const prices = await getPrices();
    
    const coinBalances = await Promise.all(data.wallets.map(async (c: Coins) => {
      let balance = 0;
      let price = 0;
      
      try {
        if (c.chain === "btc") {
          const btcData = await getBtcBalance(c.address);
          balance = btcData ? btcData.btc : 0;
          price = prices.btc;
        } else if (c.chain === "eth") {
          const ethBal = await getEthBalance(c.address);
          balance = ethBal ? parseFloat(ethBal) : 0;
          price = prices.eth;
        } else if (c.chain === "sol") {
          const solBal = await getSolBalance(c.address);
          balance = solBal ? solBal : 0;
          price = prices.sol;
        } else if (c.chain === "BSC") {
          const bnbBal = await getBnbBalance(c.address);
          balance = bnbBal ? bnbBal : 0;
          price = prices.bnb;
        }
      } catch (err) {
        console.error(`Error fetching balance for ${c.chain}:`, err);
      }
      
      return {
        ...c,
        balance,
        usdBalance: balance * price,
        price
      };
    }));

    const totalNetWorth = coinBalances.reduce((acc, curr) => acc + curr.usdBalance, 0);

    const keysprofile : KeysMeta = {
      id: "Keys",
      mnemonics: data.mnemonic,
      wallets: data.wallets.map((c: Coins, index) => ({
        name: c.name,
        privatekey: c.privateKey,
        publickey: c.address
       })),
       createdAt: Date.now(),
     }
    
     const userprofile : UserMeta = {
       id: "user",
       name: username,
       networth: totalNetWorth,
       wallets: [
         { 
           name: "Main Wallet",
           totalBalance: parseFloat(totalNetWorth.toFixed(2)),
           growthInPerc: 0,
           growthInUsd: 0,
           coins: coinBalances.map((c: any) => ({
             id: c.chain,
             name: c.name,
             balance: c.balance,
             usdBalance: parseFloat(c.usdBalance.toFixed(2)),
             growthInPerc: 0,
             growthInUsd: 0,
             createdAt: Date.now(),
             chain: c.chain,
             address: c.address
           })),
           createdAt: Date.now(),
           lastActiveAt: Date.now()
         }
       ]
     }

     // Safely store non-sensitive data
     await SecureStore.setItemAsync("keys", JSON.stringify(keysprofile));
     
     const saveditem = await AsyncStorage.getItem("userProfile");
     if (saveditem == null) {
       await AsyncStorage.setItem("userProfile", JSON.stringify(userprofile));
     }
    
    Keyboard.dismiss(); // Closes keyboard immediately
    setLoading(false);
    showToast("Wallet created successfully!", "success");
    setTimeout(() => {
      router.replace("/dashboard");
    }, 1500);
  };

  const isButtonDisabled = username.trim().length < 3;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Toast 
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      
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

              {/* USERNAME & WALLET NAME INPUTS */}
              {walletCreated && (
                <Animated.View entering={FadeInDown} style={styles.inputsWrapper}>
                  

                  {/* Username Input */}
                  <View style={styles.inputContainer}>
                    <UserCircleIcon color={username.length >= 3 ? "#ac71ff" : "#4b5563"} size={22} weight="bold" />
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor="#4b5563"
                      style={styles.textInput}
                      
                      onChangeText={(event) => {
                        
                          setUsername(event)
                       
                      }}
                      autoCorrect={false}
                    />
                    {username.length >= 3 && <ShieldCheckIcon color="#34d399" size={20} weight="fill" />}
                  </View>
                </Animated.View>
              )}
            </View>

            {/* BUTTONS (Bottom part of ScrollView) */}
            <View style={styles.footer}>
              {walletCreated ? (
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    onPress={ () => {
                      console.log("click")
                      setLoading(true);
                      handleGoToDashboard();
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.button, 
                      styles.primaryButton,
                    ]}
                  >
                    {showloading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Go to Dashboard</Text>}
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
  
  inputsWrapper: { width: '100%', marginBottom: 20, gap: 16 },
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