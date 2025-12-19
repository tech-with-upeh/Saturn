import { useThemeColors } from "@/constants/theme";
import { router } from "expo-router";
import { ArrowLeft, ArrowsDownUp, CaretDown, Check, PaperPlaneRight } from "phosphor-react-native";
import React, { useState } from "react";
import {
  FlatList, Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

// Mock Tokens for Sending
const SENDABLE_TOKENS = [
  { symbol: "SOL", name: "Solana", color: "#8C01FF", balance: "12.50", price: 145.20 },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", balance: "1,200.00", price: 1.00 },
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A", balance: "0.004", price: 64000.00 },
];

const SendScreen = () => {
  const theme = useThemeColors();
  
  // States
  const [selectedToken, setSelectedToken] = useState(SENDABLE_TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const selectToken = (token: typeof SENDABLE_TOKENS[0]) => {
    setSelectedToken(token);
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: 20 }]}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={theme.text} size={24} weight="bold" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Send Crypto</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* FUNCTIONAL ASSET SELECTOR */}
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            style={[styles.assetPicker, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.assetIcon, { backgroundColor: selectedToken.color }]}>
               <Text style={styles.assetIconText}>{selectedToken.symbol[0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.assetName, { color: theme.text }]}>{selectedToken.name}</Text>
              <Text style={[styles.assetBalance, { color: theme.txtsec }]}>
                Balance: {selectedToken.balance} {selectedToken.symbol}
              </Text>
            </View>
            <CaretDown color={theme.txtsec} size={18} />
          </TouchableOpacity>

          {/* AMOUNT INPUT SECTION */}
          <View style={styles.amountContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.txtsec + "50"}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.maxBadge, { backgroundColor: theme.primary + "15" }]}
              onPress={() => setAmount(selectedToken.balance)}
            >
              <Text style={[styles.maxText, { color: theme.primary }]}>MAX</Text>
            </TouchableOpacity>

            <View style={styles.swapContainer}>
               <ArrowsDownUp color={theme.txtsec} size={16} />
               <Text style={[styles.secondaryAmount, { color: theme.txtsec }]}>
                 {amount ? (parseFloat(amount) / selectedToken.price).toFixed(4) : "0.00"} {selectedToken.symbol}
               </Text>
            </View>
          </View>

          {/* ADDRESS INPUT */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.txtsec }]}>Recipient Address</Text>
            <View style={[styles.addressInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TextInput
                style={[styles.addressInput, { color: theme.text }]}
                placeholder={`Enter ${selectedToken.name} address`}
                placeholderTextColor={theme.txtsec + "80"}
                value={address}
                onChangeText={setAddress}
                multiline
              />
              <TouchableOpacity style={styles.pasteButton}>
                 <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12 }}>PASTE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ASSET SELECTION MODAL */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <View style={[styles.handle, { backgroundColor: theme.border }]} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>Select Asset</Text>
              </View>
              
              <FlatList
                data={SENDABLE_TOKENS}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => {
                  const isSelected = selectedToken.symbol === item.symbol;
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
                      <View style={{ alignItems: 'flex-end' }}>
                         <Text style={[styles.tokenSymbol, { color: theme.text }]}>{item.balance}</Text>
                         {isSelected && <Check color={theme.primary} size={16} weight="bold" style={{marginTop: 4}} />}
                      </View>
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

        {/* FOOTER ACTION */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Review Transaction</Text>
            <View style={styles.sendIconCircle}>
              <PaperPlaneRight color={theme.primary} size={18} weight="fill" />
            </View>
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
  content: { paddingHorizontal: 24, paddingTop: 20 },
  assetPicker: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20, borderWidth: 1, marginBottom: 32 },
  assetIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  assetIconText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  assetName: { fontSize: 16, fontWeight: '700' },
  assetBalance: { fontSize: 12, marginTop: 2 },
  amountContainer: { alignItems: 'center', marginBottom: 40 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 40, fontWeight: '800', marginRight: 4 },
  amountInput: { fontSize: 56, fontWeight: '800', letterSpacing: -2, minWidth: 100 },
  maxBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 12 },
  maxText: { fontSize: 12, fontWeight: '800' },
  swapContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  secondaryAmount: { fontSize: 15, fontWeight: '500' },
  formGroup: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 12, marginLeft: 4 },
  addressInputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, minHeight: 80 },
  addressInput: { flex: 1, fontSize: 15, fontWeight: '500', paddingVertical: 12 },
  pasteButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 10 },
  footer: { position: 'relative', paddingHorizontal: 22, top: 30},
  sendButton: { height: 64, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  sendButtonText: { color: '#fff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center', marginLeft: 32 },
  sendIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  
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

export default SendScreen;