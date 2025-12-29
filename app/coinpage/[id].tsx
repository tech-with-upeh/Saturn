import { useThemeColors } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Star } from "phosphor-react-native";
import React, { useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";

const { width } = Dimensions.get("window");

const CoinPage = () => {
  const { height, width } = useWindowDimensions();
  const theme = useThemeColors();
  const [activeRange, setActiveRange] = useState("24H");

   const params = useLocalSearchParams();

   const { id, name, balance, growthInUsd, growthInPerc, address, chain, createdAt } = params;
  // Mock data for the line chart (values from 0 to 100)
  const chartData = [50, 40, 45, 30, 55, 70, 65, 80, 75, 90, 85, 100];
  
  // Logic to turn numbers into an SVG Path string
  const generatePath = () => {
    const chartWidth = width - 40;
    const chartHeight = 150;
    const stepX = chartWidth / (chartData.length - 1);
    
    return chartData.map((val, i) => {
      const x = i * stepX;
      const y = chartHeight - (val / 100) * chartHeight;
      return i === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(" ");
  };

  const ranges = ["1H", "24H", "1W", "1M", "1Y"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background, paddingTop: 24 }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ArrowLeft color={theme.text} size={24} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{name}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Star color={theme.primary} size={24} weight="fill" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* PRICE SECTION */}
        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: theme.text }]}>$145.20</Text>
          <View style={styles.changeRow}>
            <View style={[styles.changeBadge, { backgroundColor: '#10B98120' }]}>
              <Text style={[styles.changeText, { color: "#10B981" }]}>+5.24%</Text>
            </View>
            <Text style={[styles.rangeLabel, { color: theme.txtsec }]}>past 24h</Text>
          </View>
        </View>

        {/* INTERACTIVE SVG CHART */}
        <View style={styles.chartWrapper}>
          <Svg height="160" width={width - 40}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.primary} stopOpacity="0.3" />
                <Stop offset="1" stopColor={theme.primary} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            
            {/* The Area Under the Line */}
            <Path
              d={`${generatePath()} L${width - 40},160 L0,160 Z`}
              fill="url(#grad)"
            />
            
            {/* The Main Line */}
            <Path
              d={generatePath()}
              fill="none"
              stroke={theme.primary}
              strokeWidth="3"
            />
          </Svg>
        </View>

        {/* TIME RANGE SELECTOR */}
        <View style={styles.rangeContainer}>
          {ranges.map((range) => (
            <TouchableOpacity 
              key={range} 
              onPress={() => setActiveRange(range)}
              style={[
                styles.rangeBtn, 
                activeRange === range && { backgroundColor: theme.primary }
              ]}
            >
              <Text style={[
                styles.rangeBtnText, 
                { color: activeRange === range ? "#fff" : theme.txtsec }
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HOLDINGS CARD */}
        <View style={[styles.holdingsCard, { backgroundColor: theme.card }]}>
          <View style={styles.holdingsHeader}>
             <Text style={[styles.holdingsLabel, { color: theme.txtsec }]}>Your {name} Balance</Text>
             <Text style={[styles.holdingsValue, { color: theme.text }]}>{balance} {id}</Text>
             <Text style={[styles.holdingsUsd, { color: theme.txtsec }]}>≈ ${balance}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.background }]}>
              <ArrowUpRight color={theme.text} size={20} weight="bold" />
              <Text style={[styles.actionBtnText, { color: theme.text }]}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.background }]}>
              <ArrowDownLeft color={theme.text} size={20} weight="bold" />
              <Text style={[styles.actionBtnText, { color: theme.text }]}>Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MARKET INFO */}
        <View style={styles.statsSection}>
           <Text style={[styles.sectionTitle, { color: theme.text }]}>Market Stats</Text>
           <View style={[styles.statGrid, { backgroundColor: theme.card }]}>
              <View style={styles.statItem}>
                 <Text style={[styles.statLabel, { color: theme.txtsec }]}>Market Cap</Text>
                 <Text style={[styles.statValue, { color: theme.text }]}>$64.8B</Text>
              </View>
              <View style={[styles.statItem, { borderLeftWidth: 1, borderLeftColor: theme.border }]}>
                 <Text style={[styles.statLabel, { color: theme.txtsec }]}>Circ. Supply</Text>
                 <Text style={[styles.statValue, { color: theme.text }]}>443M SOL</Text>
              </View>
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  iconBtn: { padding: 8 },
  
  priceContainer: { paddingHorizontal: 24, marginTop: 10 },
  priceText: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  changeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  changeText: { fontSize: 14, fontWeight: '700' },
  rangeLabel: { fontSize: 14, fontWeight: '500' },

  chartWrapper: { paddingHorizontal: 20, marginTop: 30, alignItems: 'center' },

  rangeContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 25 },
  rangeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  rangeBtnText: { fontSize: 13, fontWeight: '700' },

  holdingsCard: { margin: 20, padding: 24, borderRadius: 32 },
  holdingsHeader: { alignItems: 'center', marginBottom: 24 },
  holdingsLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  holdingsValue: { fontSize: 28, fontWeight: '800' },
  holdingsUsd: { fontSize: 16, fontWeight: '500', marginTop: 4 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { fontSize: 16, fontWeight: '700' },

  statsSection: { paddingHorizontal: 24, marginTop: 10, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  statGrid: { flexDirection: 'row', borderRadius: 24, padding: 20 },
  statItem: { flex: 1, paddingLeft: 10 },
  statLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700' },
});

export default CoinPage;