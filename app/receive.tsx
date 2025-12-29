import logo from "@/assets/images/logo.png";
import { useThemeColors } from "@/constants/theme";
import useStore from "@/models/StoreModel";
import { QRCode } from '@masumdev/rn-qrcode';
import { router } from "expo-router";
import {
  ArrowLeft,
  CaretDown,
  Check,
  Copy,
  Info,
  ShareNetwork
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, SafeAreaView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Shared token list for consistency
const RECEIVABLE_TOKENS = [
  { symbol: "SOL", name: "Solana Network", color: "#8C01FF", address: "0x4b72...32a978f2" },
  { symbol: "USDC", name: "USD Coin (SPL)", color: "#2775CA", address: "0x91a2...bc1122ef" },
  { symbol: "BTC", name: "Bitcoin Network", color: "#F7931A", address: "bc1qxy2kgdy...9px3" },
];

const ReceiveScreen = () => {
  const userstore = useStore((state : any) => state.ActiveWallet);

  const theme = useThemeColors();
  const [selectedToken, setSelectedToken] = useState(userstore.coins[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    // Clipboard.setString(selectedToken.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onShare = async () => {
    try {
      await Share.share({ message: selectedToken.address });
    } catch (error) {
      console.log(error);
    }
  };


  const [activeWallet, setActiveWallet] = useState({});

    const selectToken = (token: typeof userstore.coins[0]) => {
    setSelectedToken(token);
    setModalVisible(false);
  };
  useEffect(() => {
    console.log("userstore: " ,userstore.coins);
    setActiveWallet(userstore);
    
  }, []);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.text} size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Receive</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* FUNCTIONAL ASSET SELECTOR */}
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={[styles.assetPicker, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={[styles.assetIcon, { backgroundColor: selectedToken.color }]}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 10 }}>{selectedToken.symbol}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.assetName, { color: theme.text }]}>{selectedToken.name}</Text>
            <Text style={[styles.networkLabel, { color: theme.txtsec }]}>Direct Deposit</Text>
          </View>
          <CaretDown color={theme.txtsec} size={18} />
        </TouchableOpacity>

        {/* QR CODE SECTION */}
        <View style={[styles.qrContainer, { backgroundColor: theme.card }]}>
          <View style={styles.qrWrapper}>
             <View style={[styles.qrPlaceholder, { backgroundColor: '#fff' }]}>
                <QRCode value={selectedToken.address} size={180} 
              
                logo={{
                  source: logo,
                  size: 500,
                  backgroundColor: "transparent",
                  
                }}
        color={theme.primary}
        version={5}
        includeBackground
        variant="RAIN"
        
          />
             </View>
          </View>
          <Text style={[styles.qrHint, { color: theme.txtsec }]}>
            Scan address to receive payment
          </Text>
        </View>

        {/* ADDRESS DISPLAY */}
        <View style={[styles.addressBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.addressLabel, { color: theme.txtsec }]}>Your {(selectedToken.id).toUpperCase()} Address</Text>
            <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={1} ellipsizeMode="middle">
              {selectedToken.address}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={onCopy}
            style={[styles.copyButton, { backgroundColor: theme.primary }]}
          >
            {copied ? <Check color="#fff" size={18} weight="bold" /> : <Copy color="#fff" size={18} />}
          </TouchableOpacity>
        </View>

        {/* WARNING NOTE */}
        <View style={[styles.warningBox, { backgroundColor: '#EF444410' }]}>
          <Info color="#EF4444" size={18} weight="fill" />
          <Text style={[styles.warningText, { color: "#EF4444" }]}>
            Only send <Text style={{ fontWeight: '800' }}>{(selectedToken.id).toUpperCase()}</Text> to this address. Sending other assets may result in permanent loss.
          </Text>
        </View>
      </View>

      {/* ASSET SELECTION MODAL */}
      <Modal visible={modalVisible} animationType="slide"  transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
              <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Asset</Text>
            </View>
            <FlatList
              data={userstore.coins}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectToken(item)}
                  style={[styles.tokenItem, selectedToken.id === item.id && { backgroundColor: theme.background }]}
                >
                  <View style={[styles.tokenIconLarge, { backgroundColor: theme.primary }]}>
                    <Text style={{ color: '#fff', fontWeight: '800' }}>{(item.id[0]).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={[styles.tokenSymbol, { color: theme.text }]}>{(item.id).toUpperCase()}</Text>
                    <Text style={[styles.tokenFullName, { color: theme.txtsec }]}>{item.name[0].toUpperCase() + item.name.slice(1)}</Text>
                  </View>
                  {selectedToken.id === item.id && <Check color={theme.primary} size={20} weight="bold" />}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: theme.txtsec, fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={onShare}
          style={[styles.shareBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <ShareNetwork color={theme.text} size={20} weight="bold" />
          <Text style={[styles.shareBtnText, { color: theme.text }]}>Share Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, height: 60 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backButton: { padding: 8 },
  content: { paddingHorizontal: 24, paddingTop: 20, alignItems: 'center' },
  assetPicker: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20, borderWidth: 1, width: '100%', marginBottom: 30 },
  assetIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  assetName: { fontSize: 15, fontWeight: '700' },
  networkLabel: { fontSize: 11, fontWeight: '500' },
  qrContainer: { width: '100%', padding: 30, borderRadius: 32, alignItems: 'center', marginBottom: 24 },
  qrWrapper: { padding: 16, backgroundColor: '#fff', borderRadius: 24, elevation: 5 },
  qrPlaceholder: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center' },
  qrHint: { fontSize: 13, fontWeight: '600', marginTop: 20 },
  addressBox: { flexDirection: 'row', alignItems: 'center', width: '100%', padding: 16, borderRadius: 24, borderWidth: 1, marginBottom: 20 },
  addressLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  addressText: { fontSize: 15, fontWeight: '600' },
  copyButton: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  warningBox: { flexDirection: 'row', padding: 16, borderRadius: 20, gap: 12, alignItems: 'center' },
  warningText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  shareBtn: { height: 60, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  shareBtnText: { fontSize: 16, fontWeight: '700' },

  // MODAL STYLES (Match Send/Swap pages)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { alignItems: 'center', paddingVertical: 15 },
  handle: { width: 40, height: 4, borderRadius: 2, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  tokenItem: { flexDirection: 'row', alignItems: 'center', padding: 18, marginHorizontal: 10, borderRadius: 20 },
  tokenIconLarge: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  tokenSymbol: { fontSize: 16, fontWeight: '700' },
  tokenFullName: { fontSize: 13, fontWeight: '500' },
  closeBtn: { alignItems: 'center', marginTop: 10, padding: 15 }
});

export default ReceiveScreen;