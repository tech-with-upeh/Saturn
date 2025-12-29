import { useThemeColors } from "@/constants/theme";
import { router } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  DotsThreeVerticalIcon,
  Plus,
  SignOut,
  UserCircleGear
} from "phosphor-react-native";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = ({ navigation }: any) => {
  const theme = useThemeColors();

  const accounts = [
    { id: "1", name: "Main Wallet", address: "0x4b...32a", balance: "$12,000.70", active: true },
    { id: "2", name: "Trading Bot", address: "0x8e...11b", balance: "$2,400.00", active: false },
    { id: "3", name: "HODL Savings", address: "0x2a...99f", balance: "$45,210.12", active: false },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.text} size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/dashboard/settings")} style={styles.backButton}>
          <UserCircleGear color={theme.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PROFILE INFO */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarGlow, { backgroundColor: theme.primary + "20" }]}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>John Doe</Text>
          <Text style={[styles.userEmail, { color: theme.txtsec }]}>Verified Account</Text>
        </View>

        {/* ACCOUNTS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>My Accounts</Text>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary + "15" }]}>
            <Plus color={theme.primary} size={16} weight="bold" />
            <Text style={[styles.addBtnText, { color: theme.primary }]}>New</Text>
          </TouchableOpacity>
        </View>

        {accounts.map((acc) => (
          <TouchableOpacity 
            key={acc.id} 
            activeOpacity={0.7}
            style={[
              styles.accountCard, 
              { 
                backgroundColor: theme.card, 
                borderColor: acc.active ? theme.primary : theme.border,
                borderWidth: acc.active ? 1.5 : 1 
              }
            ]}
          >
            <View style={styles.accRow}>
              <View style={[styles.accIcon, { backgroundColor: acc.active ? theme.primary : theme.border }]}>
                 {acc.active ? <CheckCircle color="#fff" size={18} weight="fill" /> : <View />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.accName, { color: theme.text }]}>{acc.name}</Text>
                <View style={styles.addressRow}>
                  <Text style={[styles.accAddress, { color: theme.txtsec }]}>{acc.address}</Text>
                  <Copy color={theme.txtsec} size={12} style={{ marginLeft: 4 }} />
                </View>
              </View>
              <View style={{alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={[styles.accBalance, { color: theme.text }]}>{acc.balance}</Text>
                <DotsThreeVerticalIcon color={theme.txtsec} size={18} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* ACTIONS */}
        <View style={styles.actionList}>
          <TouchableOpacity style={[styles.actionItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <SignOut color="#EF4444" size={22} />
            <Text style={[styles.actionText, { color: "#EF4444" }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backButton: { padding: 8 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 100 },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarGlow: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  userName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  userEmail: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: { fontSize: 14, fontWeight: '700' },
  accountCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  accRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accName: { fontSize: 16, fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  accAddress: { fontSize: 12, fontWeight: '500' },
  accBalance: { fontSize: 16, fontWeight: '800' },
  actionList: { marginTop: 30 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  actionText: { fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;