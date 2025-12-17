// {
//     name: "Solana",
//     balance: 100,
//     usdValue: 1233,
//     growth: 12,
//     chainId: "solana",
//   },

import { COIN_ICONS } from "@/constants/appconstants";
import { useThemeColors } from "@/constants/theme";
import { Image, Text, View } from "react-native";

interface MemeCardProps {
  name: string;
  balance: string;
  usd: string;
  growth: string;
  chainId: string;
  onPress?: () => void;
}

const CoinTile: React.FC<MemeCardProps> = ({
  name,
  balance,
  usd,
  growth,
  chainId,
  onPress,
}) => {
  const theme = useThemeColors();

  return (
    <View
      className="flex-row justify-between items-center p-3"
      style={{
        height: 72,
        width: "100%",
        backgroundColor: theme.card,
        borderRadius: 20,
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row justify-center items-center gap-4">
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={
              chainId in COIN_ICONS ? COIN_ICONS[chainId] : { uri: chainId }
            }
            style={{
              width: 28,
              height: 28,
            }}
            resizeMode="contain"
          />
        </View>
        <View className="justify-center items-start">
          <Text
            className="font-bold text-base"
            style={{
              color: theme.text,
              marginBottom: 2,
            }}
          >
            {name}
          </Text>
          <Text
            className="text-xs font-medium"
            style={{
              color: theme.txtsec,
            }}
          >
            {balance} {chainId.toUpperCase()}
          </Text>
        </View>
      </View>
      <View
        className="justify-center items-end text-right"
        style={{
          height: "100%",
        }}
      >
        <Text
          className="font-bold text-base"
          style={{
            textAlign: "right",
            color: theme.text,
            marginBottom: 2,
          }}
        >
          ${usd}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            className="text-xs font-bold"
            style={{
              textAlign: "right",
              color: parseFloat(growth) >= 0 ? "#10B981" : "#EF4444",
            }}
          >
            {parseFloat(growth) >= 0 ? "+" : ""}
            {growth}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CoinTile;
