import { useIsDarkMode, useThemeColors } from "@/constants/theme";
import {
  BellSimple,
  CaretRight,
  Copy, Crown,
  CurrencyDollar,
  Fingerprint,
  Globe,
  Info,
  Moon,
  ShieldCheck,
  Trash,
  User
} from "phosphor-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const SettingsScreen = () => {
  const theme = useThemeColors();
  const isDark = useIsDarkMode();
  const [notifications, setNotifications] = useState(true);

  const SettingItem = ({ icon: Icon, title, value, onPress, color, isLast }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.itemWrapper, 
        { borderBottomColor: theme.border, borderBottomWidth: isLast ? 0 : 1 }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color || theme.background }]}>
        <Icon color={color ? "#fff" : theme.text} size={20} weight="regular" />
      </View>
      <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
      <View style={styles.itemRight}>
        {value && <Text style={[styles.itemValue, { color: theme.txtsec }]}>{value}</Text>}
        <CaretRight color={theme.txtsec} size={16} weight="bold" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PREMIUM PROFILE HEADER */}
        <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatarContainer, { borderColor: theme.primary }]}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              {/* Pro Badge */}
              <View style={[styles.proBadge, { backgroundColor: theme.primary }]}>
                <Crown color="#fff" size={10} weight="fill" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>John Doe</Text>
              <TouchableOpacity style={styles.addressPill}>
                <Text style={[styles.addressText, { color: theme.txtsec }]}>0x4b...32a9</Text>
                <Copy color={theme.txtsec} size={12} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={[styles.sectionLabel, { color: theme.txtsec }]}>Security & Account</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <SettingItem icon={User} title="Personal Information" />
          <SettingItem icon={ShieldCheck} title="Recovery Phrase" />
          <SettingItem icon={Fingerprint} title="Biometric Lock" value="FaceID" isLast={true} />
        </View>

        {/* PREFERENCES SECTION */}
        <Text style={[styles.sectionLabel, { color: theme.txtsec }]}>Preferences</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={[styles.itemWrapper, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
              <BellSimple color={theme.text} size={20} />
            </View>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Notifications</Text>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
          <SettingItem icon={CurrencyDollar} title="Primary Currency" value="USD" />
          <SettingItem icon={Globe} title="Language" value="English" />
          <View style={styles.itemWrapper}>
            <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
              <Moon color={theme.text} size={20} />
            </View>
            <Text style={[styles.itemTitle, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.itemValue, { color: theme.primary, fontWeight: '700' }]}>
              {isDark ? "ON" : "OFF"}
            </Text>
          </View>
        </View>

        {/* DANGER ZONE */}
        <Text style={[styles.sectionLabel, { color: theme.txtsec }]}>Advanced</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <SettingItem icon={Info} title="Help Support" />
          <SettingItem icon={Trash} title="Reset Wallet" color="#EF4444" isLast={true} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: theme.txtsec }]}>Saturn Wallet v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  
  // New Profile Header Styles
  profileHeader: {
    padding: 20,
    borderRadius: 32,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    padding: 3,
    borderWidth: 2,
    borderRadius: 28,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  proBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    padding: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff', // Or match theme card color
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
  },

  // Existing Styles
  sectionLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 10, marginLeft: 8, letterSpacing: 1 },
  card: { borderRadius: 24, paddingHorizontal: 16, marginBottom: 25 },
  itemWrapper: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  iconContainer: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  itemTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  itemValue: { fontSize: 14, marginRight: 8, fontWeight: '500' },
  footer: { alignItems: 'center', marginTop: 10 },
  versionText: { fontSize: 12, fontWeight: '500', opacity: 0.6 }
});

export default SettingsScreen;