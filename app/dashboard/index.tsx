import { getEthBalance } from "@/backend/balanceapi";
import CoinTile from "@/components/cointile";
import SkeletonLoader from "@/components/shimmer";
import MemeCard from "@/components/trendingcard";
import { COIN_ICONS } from "@/constants/appconstants";
import { useIsDarkMode, useThemeColors } from "@/constants/theme";
import useStore from "@/models/StoreModel";
import { CoinMeta } from "@/models/UserProfile";
import { fetchMemeCoins } from "@/services/trendingCoinService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import {
  ArrowDownIcon,
  BellSimpleRingingIcon,
  CheckCircleIcon,
  InfoIcon,
  PaperPlaneTiltIcon,
  PlusIcon,
  QrCodeIcon,
  ShoppingCartIcon,
  SwapIcon,
  WarningCircleIcon
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  useSharedValue
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const index = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [userprofile, setUserprofile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [ActiveWallet, setActiveWallet] = useState<any>({});

  const animation = useSharedValue(0);

  const userstore = useStore((state : any) => state.setUserprofile);
  const useActiveWallet = useStore((state : any) => state.setActiveWallet);
  useEffect(() => {

    const saveditem = async () => {
      const data  = await AsyncStorage.getItem("userProfile");
      if (data) {
         const parsedData = JSON.parse(data);
         setUserprofile(parsedData);
         userstore(parsedData);
         const wallet = parsedData.wallets[0];
         setActiveWallet(wallet);
         useActiveWallet(wallet);
         return wallet;
      }
      return null;
    }
    
    const load = async () => {
      const data = await fetchMemeCoins();
      if (data.length === 0) {
        setErr(true);
      }
      setCoins(data);
      setLoading(false);
    };
    load();

    const balance = async () => {
      const wallet = await saveditem();
      if (wallet && wallet.coins && wallet.coins.length > 0) {
        console.log(wallet.coins)
        try {
          const data = await getEthBalance(wallet.coins[1].address);
          console.log("eth",data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    balance();
    
  }, []);

  const colorsche = useIsDarkMode();
  const themeprovider = useThemeColors();


  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Transaction Successful",
      message: "You received 0.5 ETH from 0x1234...5678",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Market Update",
      message: "Bitcoin hit a new all-time high of $98,000",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Price Alert",
      message: "Solana is down 5% in the last 24 hours",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 4,
      type: "success",
      title: "Swap Completed",
      message: "Successfully swapped 100 USDC for 0.03 ETH",
      time: "5 hours ago",
      read: true,
    },
  ];

  // Action button component
  const ActionButton = ({
    icon: Icon,
    label,
    onPress,
  }: {
    icon: any;
    label: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        alignItems: "center",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: themeprovider.card,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: themeprovider.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Icon color={themeprovider.primary} size={24} weight="regular" />
      </View>
      <Text
        style={{
          color: themeprovider.txtsec,
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeprovider.background }}>
      <StatusBar
        translucent
        barStyle={colorsche ? "light-content" : "dark-content"}
        backgroundColor="transparent"
      />

      {/* Sticky Header */}
      <SafeAreaView
        edges={["top"]}
        style={{
          backgroundColor: themeprovider.background,
          zIndex: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* User Profile */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              
              <Link href="/profile">
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: themeprovider.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: themeprovider.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 22,
                      fontWeight: "700",
                    }}
                  >
                    {userprofile?.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </Link>
              

              <View>
                <Text
                  style={{
                    color: themeprovider.txtsec,
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 4,
                  }}
                >
                  Welcome back,
                </Text>
                <Text
                  style={{
                    color: themeprovider.text,
                    fontSize: 20,
                    fontWeight: "800",
                    letterSpacing: -0.5,
                  }}
                >
                  {userprofile?.name}
                </Text>
              </View>
            </View>

            {/* Action Icons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                  if (!permission?.granted) {
                    await requestPermission();
                  }
                  
                  router.push("/qrscanner")
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: themeprovider.card,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QrCodeIcon 
                  color={themeprovider.text} 
                  size={24} 
                  weight="light" 
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: showNotifications ? themeprovider.primary : themeprovider.card,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BellSimpleRingingIcon
                  color={showNotifications ? "#ffffff" : themeprovider.text}
                  size={24}
                  weight="light"
                />
                {notifications.filter(n => !n.read).length > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#EF4444",
                      borderWidth: 2,
                      borderColor: themeprovider.background,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Notification Dropdown Overlay */}
      {showNotifications && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        >
          <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 12,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  backgroundColor: themeprovider.card,
                  borderRadius: 24,
                  padding: 20,
                  shadowColor: themeprovider.text,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.2,
                  shadowRadius: 20,
                  elevation: 10,
                  maxHeight: 500,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colorsche
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: themeprovider.text,
                        fontSize: 22,
                        fontWeight: "800",
                        letterSpacing: -0.5,
                      }}
                    >
                      Notifications
                    </Text>
                    <Text
                      style={{
                        color: themeprovider.txtsec,
                        fontSize: 13,
                        fontWeight: "500",
                        marginTop: 4,
                      }}
                    >
                      {notifications.filter((n) => !n.read).length} unread
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowNotifications(false)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colorsche
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: themeprovider.text,
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Notifications List */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 380 }}
                >
                  {notifications.map((notification, index) => {
                    const isLast = index === notifications.length - 1;
                    const getIcon = () => {
                      switch (notification.type) {
                        case "success":
                          return CheckCircleIcon;
                        case "warning":
                          return WarningCircleIcon;
                        default:
                          return InfoIcon;
                      }
                    };
                    const getIconColor = () => {
                      switch (notification.type) {
                        case "success":
                          return "#10B981";
                        case "warning":
                          return "#F59E0B";
                        default:
                          return themeprovider.primary;
                      }
                    };
                    const Icon = getIcon();

                    return (
                      <TouchableOpacity
                        key={notification.id}
                        activeOpacity={0.7}
                        style={{
                          paddingVertical: 16,
                          paddingHorizontal: 12,
                          
                          borderRadius: 16,
                          marginBottom: isLast ? 0 : 12
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 12,
                          }}
                        >
                          {/* Icon */}
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              backgroundColor: `${getIconColor()}20`,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Icon
                              color={getIconColor()}
                              size={20}
                              weight="fill"
                            />
                          </View>

                          {/* Content */}
                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 4,
                              }}
                            >
                              <Text
                                style={{
                                  color: themeprovider.text,
                                  fontSize: 15,
                                  fontWeight: "700",
                                  flex: 1,
                                  marginRight: 8,
                                }}
                              >
                                {notification.title}
                              </Text>
                              {!notification.read && (
                                <View
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: themeprovider.primary,
                                    marginTop: 4,
                                  }}
                                />
                              )}
                            </View>
                            <Text
                              style={{
                                color: themeprovider.txtsec,
                                fontSize: 13,
                                fontWeight: "500",
                                lineHeight: 18,
                                marginBottom: 8,
                              }}
                            >
                              {notification.message}
                            </Text>
                            <Text
                              style={{
                                color: themeprovider.txtsec,
                                fontSize: 12,
                                fontWeight: "600",
                                opacity: 0.7,
                              }}
                            >
                              {notification.time}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Footer */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: colorsche
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: themeprovider.primary,
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    View All Notifications
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      )}

      

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: themeprovider.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Balance Card */}
        <View style={{ paddingHorizontal: 24, alignItems: "center", marginTop: 20 }}>

      <View
        style={{
          position: "absolute",
          top: -18, // Move up slightly
          width: "79%", // Narrowest width
          height: 60,
          backgroundColor: themeprovider.primary,
          opacity: 0.2,
          borderRadius: 24,
        }}
      />
      
      {/* 3rd Layer (Bottom-most card) */}
      <View
        style={{
          position: "absolute",
          top: -12, // Move up slightly
          width: "85%", // Narrowest width
          height: 60,
          backgroundColor: themeprovider.primary,
          opacity: 0.2,
          borderRadius: 24,
        }}
      />

      {/* 2nd Layer (Middle card) */}
      <View
        style={{
          position: "absolute",
          top: -6, // Mid position
          width: "92%", // Medium width
          height: 60,
          backgroundColor: themeprovider.primary,
          opacity: 0.4,
          borderRadius: 28,
        }}
      />

      {/* MAIN CARD (Front) */}
      <LinearGradient
        colors={[themeprovider.primary, themeprovider.tint]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          borderRadius: 32,
          padding: 28,
          shadowColor: themeprovider.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 15,
          zIndex: 3, // Ensures it stays on top
        }}
      >
        {/* Wallet Label */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, opacity: 0.9 }}>
          <View style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12, marginRight: 10 }}>
            <Text style={{ color: "#fff" }}>{ActiveWallet.name?.charAt(0)}</Text>
          </View>
          <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "600" }}>{ActiveWallet.name}</Text>
          <Text style={{ color: "#ffffff", marginLeft: 4, opacity: 0.8 }}>{">"}</Text>
        </View>

        {/* Balance */}
        <Text style={{ color: "#ffffff", fontSize: 42, fontWeight: "800", letterSpacing: -1.5, marginBottom: 20 }}>
          $ {ActiveWallet.totalBalance}
        </Text>

        {/* Growth Indicator */}
        {ActiveWallet.growthInPerc > 0 && <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ backgroundColor: "#ff000033", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>+{ActiveWallet.growthInPerc}%</Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "600" }}>
            +$ {ActiveWallet.growthInUsd}
          </Text>
        </View>}
      </LinearGradient>
    </View>

        {/* Action Buttons */}
        <View
          style={{
            paddingHorizontal: 24,
            marginTop: 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link href={"/dashboard/send"} asChild>
              <ActionButton icon={PaperPlaneTiltIcon} label="Send" />
            </Link>

            <Link href={"/receive"} asChild>
              <ActionButton icon={ArrowDownIcon} label="Receive" />
            </Link>

            <Link href={"/swappage"} asChild>
              <ActionButton icon={SwapIcon} label="Swap" />
            </Link>

            <Link href={"/buypage"} asChild>
              <ActionButton icon={ShoppingCartIcon} label="Buy" />
            </Link>
          </View>
        </View>

        {/* Trending Section */}
        <View style={{ marginTop: 24, paddingLeft: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingRight: 24,
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{
                  color: themeprovider.text,
                  fontSize: 24,
                  fontWeight: "800",
                  marginBottom: 6,
                  letterSpacing: -0.5,
                }}
              >
                Trending
              </Text>
              <Text
                style={{
                  color: themeprovider.txtsec,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Hot meme coins right now
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                style={{
                  color: themeprovider.primary,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginTop: 4 }}>
            {/* Add Card */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                height: 200,
                width: 64,
                backgroundColor: themeprovider.card,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: themeprovider.text,
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colorsche
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PlusIcon color={themeprovider.primary} size={24} weight="light" />
              </View>
            </TouchableOpacity>

            {/* Trending Coins */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
              {loading && <SkeletonLoader />}

              {err && (
                <View
                  style={{
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: themeprovider.txtsec }}>
                    Error loading coins
                  </Text>
                </View>
              )}

              {!loading &&
                !err &&
                coins.map((item, index) => (
                  <View key={index} style={{ marginRight: 3 }}>
                    <MemeCard
                      imageUrl={item.openGraph}
                      chainIcon={COIN_ICONS[item.chainId]}
                      chain={item.chainId}
                      name={item.name}
                      price={item.percent}
                      desc={item.description ? item.description : ""}
                      onPress={() => {
                        router.push({
                          pathname: "/trending/[id]",
                          params: {
                            id: item.name,
                            name: item.name,
                            price: item.percent,
                            desc: item.description,
                            imageUrl: item.openGraph,
                            chain: item.chainId,
                            address: item.tokenAddress,
                          },
                        });
                      }}
                    />
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>

        {/* Assets Section */}
        <View style={{ marginTop: 40, paddingHorizontal: 24, marginBottom: 64 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{
                  color: themeprovider.text,
                  fontSize: 24,
                  fontWeight: "800",
                  marginBottom: 6,
                  letterSpacing: -0.5,
                }}
              >
                Your Assets
              </Text>
              <Text
                style={{
                  color: themeprovider.txtsec,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {ActiveWallet.coins?.length} Coins
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                style={{
                  color: themeprovider.primary,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 16, marginBottom: 32
           }}>
            {ActiveWallet.coins?.map((item : CoinMeta, index : number) => (
              <CoinTile
                key={index}
                name={item.name}
                balance={item.balance.toString()}
                usd={item.growthInUsd.toString()}
                growth={item.growthInPerc.toString()}
                chainId={item.id}
                onPress={() => router.push({
                  pathname: "/coinpage/[id]",

                  // export type CoinMeta = {
                  //   id: string;          // uuid
                  //   name: string;       // "Main Wallet"
                  //   balance: number;
                  //   growthInUsd: number;
                  //   growthInPerc: number;
                  //   address: string;     // public address
                  //   chain: string;
                  //   createdAt: number;
                  // };
                  params: {
                    id: item.id,
                    name: item.name,
                    balance: item.balance,
                    growthInUsd: item.growthInUsd,
                    growthInPerc: item.growthInPerc,
                    address: item.address,
                    chain: item.chain,
                    createdAt: item.createdAt,
                   },
                })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default index;
