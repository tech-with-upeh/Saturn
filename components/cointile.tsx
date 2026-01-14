import { COIN_ICONS } from "@/constants/appconstants";
import { useThemeColors } from "@/constants/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MemeCardProps {
  name: string;
  balance: string;
  usdbalance: string;
  usd: string;
  growth: string;
  chainId: string;
  onPress?: () => void;
}

const CoinTile: React.FC<MemeCardProps> = ({
  name,
  balance,
  usdbalance,
  usd,
  growth,
  chainId,
  onPress,
}) => {
  const theme = useThemeColors();
  const isPositive = parseFloat(growth) >= 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        height: 80, // Slightly taller for better breathing room
        width: "100%",
        backgroundColor: theme.card,
        borderRadius: 24, // Smoother rounded corners
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // Premium Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 12,
      }}
    >
      {/* LEFT SECTION: Icon & Name */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16, // Squircle-ish look for a modern feel
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.02)", // Subtle border for definition
          }}
        >
          <Image
            source={chainId in COIN_ICONS ? COIN_ICONS[chainId] : { uri: chainId }}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: theme.text,
              letterSpacing: -0.3,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: theme.txtsec,
              marginTop: 2,
            }}
          >
            {balance} <Text style={{ fontSize: 11, opacity: 0.7 }}>{chainId.toUpperCase()}</Text>
          </Text>
        </View>
      </View>

      {/* RIGHT SECTION: Value & Growth */}
      <View style={{ alignItems: "end" }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: theme.text,
            textAlign: "right",
            letterSpacing: -0.5,
          }}
        >
          ${usdbalance}
        </Text>
        
        {/* Growth Pill */}
        <View
          style={{
            backgroundColor: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 8,
            marginTop: 4,
            alignSelf: 'flex-end'
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: isPositive ? "#10B981" : "#EF4444",
            }}
          >
            {isPositive ? "+" : ""}{growth}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CoinTile;