import { TrendDownIcon, TrendUpIcon } from "phosphor-react-native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsDarkMode, useThemeColors } from "../constants/theme";

interface MemeCardProps {
  imageUrl: string;
  chainIcon: ImageSourcePropType;
  chain: string;
  name: string;
  price: string;
  desc: string;
  onPress?: () => void;
}

const MemeCard: React.FC<MemeCardProps> = ({
  imageUrl,
  chainIcon,
  chain,
  name,
  price,
  desc,
  onPress,
}) => {
  const theme = useThemeColors();
  const isDark = useIsDarkMode();
  const isPositive = Number(price) > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: "#000",
          borderWidth: 1,
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(0, 0, 0, 0.06)",
        },
      ]}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Price Badge - Positioned at Top Right */}
        <View
          style={[
            styles.priceBadge,
            {
              backgroundColor: isPositive
                ? "rgba(34, 197, 94, 0.95)"
                : "rgba(239, 68, 68, 0.95)",
            },
          ]}
        >
          {isPositive ? (
            <TrendUpIcon color="#ffffff" size={12} weight="bold" />
          ) : (
            <TrendDownIcon color="#ffffff" size={12} weight="bold" />
          )}
          <Text style={styles.priceText}>
            {isPositive ? "+" : ""}
            {price}%
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Name */}
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            {
              color: theme.text,
            },
          ]}
        >
          {name}
        </Text>

        {/* Description */}
        <Text
          numberOfLines={2}
          style={[
            styles.description,
            {
              color: theme.txtsec,
            },
          ]}
        >
          {desc}
        </Text>

        {/* Chain Badge */}
        <View
          style={[
            styles.chainBadge,
            {
              backgroundColor: isDark
                ? "rgba(156, 39, 176, 0.1)"
                : "rgba(172, 113, 255, 0.08)",
              borderColor: isDark
                ? "rgba(156, 39, 176, 0.25)"
                : "rgba(172, 113, 255, 0.2)",
            },
          ]}
        >
          <Image source={chainIcon} style={styles.chainIcon} resizeMode="contain" />
          <Text
            style={[
              styles.chainText,
              {
                color: theme.tint,
              },
            ]}
          >
            {chain}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    height: 200,
    width: 160,
    marginVertical: 4,
    marginHorizontal: 4,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 85,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  priceBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
    flex: 1,
  },
  chainBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  chainIcon: {
    width: 16,
    height: 16,
  },
  chainText: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default MemeCard;
