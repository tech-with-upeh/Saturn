import btc from "@/assets/images/bitcoin.png";
import eth from "@/assets/images/ethereum.png";
import sol from "@/assets/images/solana.png";
import { restoreFromPrivateKeys } from "@/backend/restoreprivatekey";
import TokenDropdown from "@/components/coindropdn";
import { Buffer } from "buffer";
import { Link, useRouter } from "expo-router";
import { CaretLeft, ClipboardText, QrCode } from "phosphor-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
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
  
  const phrase =
    "mechanic cube approve used athlete lazy vague indicate culture between silk tiger";

  const keys = {
    sol: "33MdL1YSSY2FHurvi3ig8DnakWbbkD4xW7feXMwyK2uNN1d7W9kgu8RdJZ23veXhFBkdfUbDHBPLxGvdfoPiQUXr",
    eth: "292808aa5380065174c1540864f83a637e29a6f94b1c420318cc79eccbca8c5c",
    btc: "L38UbtPa4SWaeJTZNQjCL9KKL53iuBVYfpR1UGHzu9qBWus8QAtH",
  };
  
  useEffect(() => {
    (async () => {
      // const walletData = await generatefromMnemonics(phrase);
      const walletData = await restoreFromPrivateKeys(keys);
      console.log(walletData);
      console.log("Length:", Buffer.from(keys.btc, "hex").length); // should be 32
    })();
  }, []);

  const isIOS = Platform.OS === "ios";
  const { height } = Dimensions.get("window");
  
  const dropdn = [
    { title: "BTC", icon: btc },
    { title: "ETH", icon: eth },
    { title: "SOL", icon: sol },
  ];

  return (
    <View style={styles.container}>
      

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
              onSelect={(item) => console.log("Selected:", item.title)}
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
                selectionColor="#ac71ff"
              />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Link href={"/createwallet"} asChild>
                      <Pressable>
                        <Animated.View
                          entering={FadeInUp.duration(600).delay(200).springify()}
                          style={[styles.button, styles.primaryButton]}
                        >
                          <Text style={styles.primaryButtonText}>Import Wallet</Text>
                        </Animated.View>
                      </Pressable>
                      
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
