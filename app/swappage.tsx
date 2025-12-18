import { useThemeColors } from "@/constants/theme";
import { router } from "expo-router";
import {
    ArrowLeftIcon,
    ArrowsDownUp, CaretDown,
    Check
} from "phosphor-react-native";
import React, { useState } from "react";
import {
    FlatList,
    Keyboard,
    Modal,
    SafeAreaView, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

// Mock Data for Tokens
const TOKENS = [
  { symbol: "SOL", name: "Solana", color: "#8C01FF", balance: "12.5" },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", balance: "1,200.00" },
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A", balance: "0.004" },
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", balance: "1.2" },
];

const SwapScreen = () => {
  const theme = useThemeColors();
  
  // State for Assets
  const [payAsset, setPayAsset] = useState(TOKENS[0]);
  const [receiveAsset, setReceiveAsset] = useState(TOKENS[1]);
  const [payAmount, setPayAmount] = useState("");
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"pay" | "receive">("pay");

  const rotation = useSharedValue(0);

  const handleSwapAssets = () => {
    rotation.value = withSpring(rotation.value + 180);
    const temp = payAsset;
    setPayAsset(receiveAsset);
    setReceiveAsset(temp);
  };

  const openPicker = (type: "pay" | "receive") => {
    setSelectingFor(type);
    setModalVisible(true);
  };

  const selectToken = (token: typeof TOKENS[0]) => {
    if (selectingFor === "pay") setPayAsset(token);
    else setReceiveAsset(token);
    setModalVisible(false);
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back() } style={styles.backButton}>
            <ArrowLeftIcon color={theme.text} size={24} weight="bold" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Swap</Text>
          
        </View>

        <View style={styles.content}>
          {/* PAY CARD */}
          <View style={[styles.tokenCard, { backgroundColor: theme.card }]}>
            <View style={styles.tokenRow}>
              <Text style={[styles.label, { color: theme.txtsec }]}>You Pay</Text>
              <Text style={[styles.balance, { color: theme.txtsec }]}>Max: {payAsset.balance}</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0"
                keyboardType="decimal-pad"
                value={payAmount}
                onChangeText={setPayAmount}
              />
              <TouchableOpacity 
                onPress={() => openPicker("pay")}
                style={[styles.tokenSelector, { backgroundColor: theme.background }]}
              >
                <View style={[styles.tokenIcon, { backgroundColor: payAsset.color }]}>
                   <Text style={styles.tokenIconText}>{payAsset.symbol[0]}</Text>
                </View>
                <Text style={[styles.tokenName, { color: theme.text }]}>{payAsset.symbol}</Text>
                <CaretDown color={theme.text} size={14} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>

          {/* SWAP ICON */}
          <View style={styles.swapIconWrapper}>
             <TouchableOpacity onPress={handleSwapAssets} style={[styles.flipButton, { backgroundColor: theme.background, borderColor: theme.card }]}>
                <Animated.View style={animatedIconStyle}>
                  <ArrowsDownUp color={theme.primary} size={22} weight="bold" />
                </Animated.View>
             </TouchableOpacity>
          </View>

          {/* RECEIVE CARD */}
          <View style={[styles.tokenCard, { backgroundColor: theme.card }]}>
            <View style={styles.tokenRow}>
              <Text style={[styles.label, { color: theme.txtsec }]}>You Receive</Text>
              <Text style={[styles.balance, { color: theme.txtsec }]}>Balance: {receiveAsset.balance}</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput style={[styles.amountInput, { color: theme.text }]} placeholder="0" editable={false} />
              <TouchableOpacity 
                onPress={() => openPicker("receive")}
                style={[styles.tokenSelector, { backgroundColor: theme.background }]}
              >
                <View style={[styles.tokenIcon, { backgroundColor: receiveAsset.color }]}>
                   <Text style={styles.tokenIconText}>{receiveAsset.symbol[0]}</Text>
                </View>
                <Text style={[styles.tokenName, { color: theme.text }]}>{receiveAsset.symbol}</Text>
                <CaretDown color={theme.text} size={14} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TOKEN SELECTION MODAL */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <View style={[styles.handle, { backgroundColor: theme.border }]} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>Select Token</Text>
              </View>
              
              <FlatList
                data={TOKENS}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => {
                  const isSelected = selectingFor === "pay" ? payAsset.symbol === item.symbol : receiveAsset.symbol === item.symbol;
                  return (
                    <TouchableOpacity 
                      onPress={() => selectToken(item)}
                      style={[styles.tokenItem, isSelected && { backgroundColor: theme.background }]}
                    >
                      <View style={[styles.tokenIconLarge, { backgroundColor: item.color }]}>
                        <Text style={styles.tokenIconTextLarge}>{item.symbol[0]}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={[styles.tokenSymbol, { color: theme.text }]}>{item.symbol}</Text>
                        <Text style={[styles.tokenFullName, { color: theme.txtsec }]}>{item.name}</Text>
                      </View>
                      {isSelected && <Check color={theme.primary} size={20} weight="bold" />}
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Text style={{ color: theme.txtsec, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.reviewButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.reviewButtonText}>Review Swap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backButton: { padding: 8 },
  content: { paddingHorizontal: 20, paddingTop: 10 },
  tokenCard: { padding: 20, borderRadius: 24, marginVertical: 4 },
  tokenRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600' },
  balance: { fontSize: 12, fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  amountInput: { fontSize: 32, fontWeight: '700', flex: 1 },
  tokenSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, gap: 8 },
  tokenIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tokenIconText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  tokenName: { fontSize: 15, fontWeight: '700' },
  swapIconWrapper: { alignItems: 'center', height: 40, justifyContent: 'center', zIndex: 10, marginTop: -20, marginBottom: -20 },
  flipButton: { width: 48, height: 48, borderRadius: 24, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  footer: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  reviewButton: { height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  reviewButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { alignItems: 'center', paddingVertical: 15 },
  handle: { width: 40, height: 4, borderRadius: 2, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  tokenItem: { flexDirection: 'row', alignItems: 'center', padding: 18, marginHorizontal: 10, borderRadius: 20 },
  tokenIconLarge: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  tokenIconTextLarge: { color: '#fff', fontSize: 18, fontWeight: '800' },
  tokenSymbol: { fontSize: 16, fontWeight: '700' },
  tokenFullName: { fontSize: 13, fontWeight: '500' },
  closeBtn: { alignItems: 'center', marginTop: 10, padding: 15 }
});

export default SwapScreen;