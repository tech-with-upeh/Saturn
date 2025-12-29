import btc from "@/assets/images/bitcoin.png";
import eth from "@/assets/images/ethereum.png";
import sol from "@/assets/images/solana.png";
import { restoreFromPrivateKeys } from "@/backend/restoreprivatekey";
import TokenDropdown from "@/components/coindropdn";
import Toast, { ToastType } from "@/components/toast";
import { KeysMeta, UserMeta } from "@/models/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { CaretLeft, ClipboardText, QrCode, User } from "phosphor-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import "react-native-get-random-values";
import Animated, {
  FadeInDown,
  FadeInUp
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

global.Buffer = Buffer;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ImportKey = () => {
  const router = useRouter();
  const [keys, setkeys] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("BTC");
  const [walletname, setwalletname] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const showToast = (message: string, type: ToastType = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };
  // const keys = {
  //   sol: "33MdL1YSSY2FHurvi3ig8DnakWbbkD4xW7feXMwyK2uNN1d7W9kgu8RdJZ23veXhFBkdfUbDHBPLxGvdfoPiQUXr",
  //   eth: "292808aa5380065174c1540864f83a637e29a6f94b1c420318cc79eccbca8c5c",
  //   btc: "L38UbtPa4SWaeJTZNQjCL9KKL53iuBVYfpR1UGHzu9qBWus8QAtH",
  // };

  const handleImport = async () => {
    if (!keys) {
      showToast("Please enter your private key", "error");
      return;
    }
    if (!walletname) {
      showToast("Please give your wallet a name", "error");
      return;
    }
    if (!username) {
      showToast("Please create a username", "error");
      return;
    }

    setIsLoading(true);

    try {
      const walletData = restoreFromPrivateKeys(
         keys, selectedNetwork,
      );

      console.log(walletData);
      if (walletData.BTC == "" && walletData.ETH == "" && walletData.SOL == "") {
          throw new Error("Invalid Private Key");
      }

      const keysprofile : KeysMeta = {
        id: "Keys",
        mnemonics: "",
        wallets: [
          {
            name: walletname,
            privatekey: keys,
            publickey: walletData[selectedNetwork],
          }
        ],
        createdAt: Date.now(), 
      }

      const userprofile : UserMeta = {
        id: "user",
        name: username,
        networth: 0,
        wallets: [
          { 
            name: walletname,
            totalBalance: 0,
            growthInPerc: 0,
            growthInUsd: 0,
            coins: [
              {
                id: selectedNetwork,
                name: selectedNetwork,
                balance: 0,
                usdBalance: 0,
                growthInUsd: 0,
                growthInPerc: 0,
                address: walletData[selectedNetwork],
                chain: selectedNetwork,
                createdAt: Date.now(),
              }
            ],
            createdAt: Date.now(),
            lastActiveAt: Date.now()}
        ]
      }

      // Safely store non-sensitive data
      const savekeys = await SecureStore.setItemAsync("keys", JSON.stringify(keysprofile));
      
      const saveditem = await AsyncStorage.getItem("userProfile");
      if (saveditem == null) {
      await AsyncStorage.setItem("userProfile", JSON.stringify(userprofile)); 
      }
      
      setIsLoading(false);
      showToast("Wallet imported successfully!", "success");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);

    } catch (error) {
      console.log(error);
      showToast("Invalid Private Key. Please check and try again.", "error");
      setIsLoading(false);
    }
  };

  const isIOS = Platform.OS === "ios";
  const { height } = Dimensions.get("window");
  
  const dropdn = [
    { title: "BTC", icon: btc },
    { title: "ETH", icon: eth },
    { title: "SOL", icon: sol },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Toast 
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <CaretLeft color="#ffffff" size={24} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Import Private Key</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.qrButton}>
            <QrCode size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            style={styles.dropdownContainer}
          >
            <Text style={styles.label}>Select Network</Text>
            <TokenDropdown
              data={dropdn}
              onSelect={(item) => {
                setSelectedNetwork(item.title);
                console.log(item.title);
              }}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(600).delay(100).springify()}
            style={styles.inputSection}
          >
            <Text style={styles.label}>Private Key</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter or paste your Private Key..."
                multiline
                textAlignVertical="top"
                style={styles.textArea}
                placeholderTextColor="#6b7280"
                onChangeText={(text) => setkeys(text)}
                selectionColor="#ac71ff"
              />
              <TouchableOpacity activeOpacity={0.7} style={styles.pasteButton}>
                <ClipboardText size={20} color="#ac71ff" />
                <Text style={styles.pasteText}>PASTE</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(600).delay(200).springify()}
            style={styles.inputSection}
          >
            <Text style={styles.label}>Wallet Name</Text>
            <View style={styles.singleInputContainer}>
              <TextInput
                placeholder=" e.g. My Main Wallet"
                style={styles.singleInput}
                placeholderTextColor="#6b7280"
                onChangeText={(text) => setwalletname(text)}
                value={walletname}
                selectionColor="#ac71ff"
              />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(600).delay(200).springify()}
            style={styles.inputSection}
          >
            <Text style={styles.label}>Create Username</Text>
            <View style={styles.singleInputContainer}>
              <TextInput
                placeholder=" e.g. CryptoKing"
                onChangeText={setUsername}
                value={username}
                style={styles.singleInput}
                placeholderTextColor="#6b7280"
                selectionColor="#ac71ff"
              />
              <User size={20} color="#6b7280" style={{ position: 'absolute', right: 16 }} />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="#ac71ff" />
          ) : (
            <Pressable onPress={handleImport}>
              <Animated.View
                entering={FadeInUp.duration(600).delay(200).springify()}
                style={[styles.button, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>Import Wallet</Text>
              </Animated.View>
            </Pressable>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 10,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  qrButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 100,
    gap: 24,
  },
  dropdownContainer: {
    zIndex: 10, // Ensure dropdown floats above inputs
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputSection: {
    marginBottom: 0,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    height: 160,
  },
  textArea: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(172, 113, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(172, 113, 255, 0.2)',
    gap: 6,
  },
  pasteText: {
    color: '#ac71ff',
    fontSize: 12,
    fontWeight: '700',
  },
  singleInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  singleInput: {
    color: '#ffffff',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
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
});

export default ImportKey;
