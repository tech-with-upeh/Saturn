import { useThemeColors } from "@/constants/theme";
import {
  ArrowDownLeft,
  ArrowsLeftRight,
  ArrowUpRight,
  Funnel,
  MagnifyingGlass
} from "phosphor-react-native";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HistoryScreen = () => {
  const theme = useThemeColors();
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Sent", "Received", "Swaps"];

  const transactions = [
    { id: "1", type: "received", asset: "Solana", amount: "+1.2 SOL", usd: "$240.50", date: "Today", time: "10:24 AM", status: "Completed" },
    { id: "2", type: "sent", asset: "USDC", amount: "-150.00 USDC", usd: "$150.00", date: "Today", time: "08:12 AM", status: "Completed" },
    { id: "3", type: "swap", asset: "SOL to JUP", amount: "5.0 SOL", usd: "$1,002.10", date: "Yesterday", time: "04:55 PM", status: "Completed" },
    { id: "4", type: "sent", asset: "Solana", amount: "-0.05 SOL", usd: "$10.02", date: "Yesterday", time: "11:20 AM", status: "Failed" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "sent": return <ArrowUpRight color={theme.text} size={20} weight="bold" />;
      case "received": return <ArrowDownLeft color="#10B981" size={20} weight="bold" />;
      case "swap": return <ArrowsLeftRight color={theme.primary} size={20} weight="bold" />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Activity</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: theme.card }]}>
            <MagnifyingGlass color={theme.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: theme.card }]}>
            <Funnel color={theme.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* HORIZONTAL FILTERS */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterTab,
                activeFilter === filter ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: activeFilter === filter ? "#fff" : theme.txtsec }
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Render transactions grouped by date */}
        {["Today", "Yesterday"].map((day) => (
          <View key={day} style={styles.dateGroup}>
            <Text style={[styles.dateLabel, { color: theme.txtsec }]}>{day}</Text>
            {transactions.filter(t => t.date === day).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.txItem, { backgroundColor: theme.card }]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrapper, { backgroundColor: theme.background }]}>
                  {getIcon(item.type)}
                </View>
                
                <View style={styles.txInfo}>
                  <Text style={[styles.txTitle, { color: theme.text }]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.asset}
                  </Text>
                  <Text style={[styles.txTime, { color: theme.txtsec }]}>{item.time}</Text>
                </View>

                <View style={styles.txValue}>
                  <Text style={[
                    styles.txAmount, 
                    { color: item.type === "received" ? "#10B981" : theme.text }
                  ]}>
                    {item.amount}
                  </Text>
                  <Text style={[styles.txUsd, { color: theme.txtsec }]}>
                    {item.type === "failed" ? "Failed" : item.usd}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: { marginBottom: 20 },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 10,
  },
  filterText: { fontSize: 14, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  dateGroup: { marginBottom: 24 },
  dateLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4, letterSpacing: 1 },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: { flex: 1, marginLeft: 16 },
  txTitle: { fontSize: 16, fontWeight: '700' },
  txTime: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  txValue: { alignItems: 'flex-end' },
  txAmount: { fontSize: 16, fontWeight: '700' },
  txUsd: { fontSize: 12, marginTop: 2, fontWeight: '500' },
});

export default HistoryScreen;