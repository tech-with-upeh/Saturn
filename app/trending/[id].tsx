import { COIN_ICONS } from "@/constants/appconstants";
import { useThemeColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { CaretLeftIcon, CopyIcon, CornersOutIcon, ShareNetworkIcon, TrendDownIcon, TrendUpIcon, } from "phosphor-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

const TrendingDetail = () => {
  const theme = useThemeColors();
  const params = useLocalSearchParams();
  
  const { name, price, desc, imageUrl, chain, address } = params;
  const isPositive = Number(price) > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER ABSOLUTE */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <CaretLeftIcon color="#fff" size={24} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <ShareNetworkIcon color="#fff" size={24} weight="bold" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HERO IMAGE SECTION */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: imageUrl as string }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', theme.background]}
            style={styles.heroGradient}
            locations={[0, 1]}
          />
        </View>

        <View style={styles.contentContainer}>
             {/* TITLE & PRICE ROW */}
            <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={[styles.coinName, { color: theme.text }]}>{name}</Text>
                        {chain && COIN_ICONS[chain as string] && (
                            <Image
                                source={COIN_ICONS[chain as string]}
                                style={{ width: 20, height: 20, borderRadius: 10 }}
                            />
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                         <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
                         <Text style={[styles.statusText, { color: theme.txtsec }]}>Live Market Data</Text>
                    </View>
                </View>

                <View
                    style={[
                    styles.priceBadge,
                    {
                        backgroundColor: isPositive
                        ? "rgba(34, 197, 94, 0.15)"
                        : "rgba(239, 68, 68, 0.15)",
                    },
                    ]}
                >
                    {isPositive ? (
                    <TrendUpIcon color="#22C55E" size={18} weight="fill" />
                    ) : (
                    <TrendDownIcon color="#EF4444" size={18} weight="fill" />
                    )}
                    <Text
                    style={[
                        styles.badgeText,
                        { color: isPositive ? "#22C55E" : "#EF4444" },
                    ]}
                    >
                    {price}%
                    </Text>
                </View>
            </View>

            {/* CHART SECTION */}
            {address && (
                <View style={[styles.chartSection, { backgroundColor: theme.card }]}>
                  <View style={styles.chartHeader}>
                     <Text style={[styles.chartTitle, { color: theme.text }]}>Price Chart</Text>
                     <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        <TouchableOpacity onPress={async () => {
                          if (address) {
                            await WebBrowser.openBrowserAsync(`https://dexscreener.com/solana/${address}`);
                          }
                        }}>
                          <CornersOutIcon size={24} color={theme.text}/>
                        </TouchableOpacity>

                        <View style={[styles.timeframeBadge, { backgroundColor: theme.primary }]}>
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>15m</Text>
                        </View>
                     </View>

                  </View>
                  <View style={[styles.chartWrapper, { borderColor: theme.border }]}>
                      <WebView
                      source={{
                          uri: `https://dexscreener.com/solana/${address}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTimeframesToolbar=0&chartTheme=dark&theme=dark&chartStyle=1&chartType=usd&interval=15`
                      }}
                      style={{ flex: 1, backgroundColor: 'transparent' }}
                      scrollEnabled={false}
                      
                      />
                  </View>
                </View>
            )}

            {/* INFO CARDS */}
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                 <Text style={[styles.sectionTitle, { color: theme.text }]}>About {name}</Text>
                 <Text style={[styles.description, { color: theme.txtsec }]}>
                    {desc || `Explore the latest trends with ${name}. This token is currently making waves in the market.`}
                 </Text>
                 
                 <View style={[styles.divider, { backgroundColor: theme.border }]} />
                 
                 <View style={styles.statRow}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: theme.txtsec }]}>Network</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                             {chain && COIN_ICONS[chain as string] && (
                                <Image
                                    source={COIN_ICONS[chain as string]}
                                    style={{ width: 16, height: 16 }}
                                />
                            )}
                            <Text style={[styles.statValue, { color: theme.text }]}>{chain || 'Unknown'}</Text>
                        </View>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: theme.txtsec }]}>Token Address</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.statValue, { color: theme.text }]} numberOfLines={1} ellipsizeMode="middle">
                                {address ? `${address?.slice(0, 4)}...${address?.slice(-4)}` : 'N/A'}
                            </Text>
                            <CopyIcon color={theme.txtsec} size={14} />
                        </View>
                    </View>
                 </View>
            </View>

        </View>
      </ScrollView>

      {/* FLOAT ACTION BUTTON */}
      <View style={[styles.floatAction, { backgroundColor: theme.background }]}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.btnShadow, { shadowColor: theme.primary }]}>
                <LinearGradient
                    colors={[theme.primary, theme.tint]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                >
                    <Text style={styles.primaryBtnText}>Trade {name}</Text>
                </LinearGradient>
            </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContainer: {
    width: width,
    height: height * 0.45,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  coinName: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "800",
  },
  chartSection: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  timeframeBadge: {
    height: 25, 
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 8,
  },
  chartWrapper: {
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  infoCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    opacity: 0.7,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 20,
    opacity: 0.1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    gap: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  floatAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  btnShadow: {
    width: "100%",
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default TrendingDetail;
