import { useThemeColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SkeletonLoader() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const mytheme = useThemeColors();
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={{
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: mytheme.card,
        height: 200,
        width: 148,
        marginVertical: 8,
        marginHorizontal: 4,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
    >
      <View
        style={{
          width: 150,
          height: 80,
          backgroundColor: mytheme.border,
        }}
      />
      <View style={styles.textContainer}>
        <View
          style={{
            height: 14,
            backgroundColor: mytheme.border,
            borderRadius: 4,
            marginBottom: 18,
            width: "90%",
          }}
        />
        <View
          style={{
            height: 14,
            backgroundColor: mytheme.border,
            borderRadius: 4,
            width: "60%",
          }}
        />
      </View>
      <View className="flex-row justify-center items-center gap-3 w-full">
        <View
          className="rounded-full"
          style={{
            height: 22,
            width: 22,
            marginBottom: 8,
            backgroundColor: mytheme.border,
          }}
        />
        <View
          style={{
            width: "40%",
            height: 14,
            borderRadius: 12,
            marginBottom: 8,
            backgroundColor: mytheme.border,
          }}
        />
      </View>
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.7)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "center",
  },
  shimmer: {
    width: 80,
    height: "100%",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 60,
//     marginHorizontal: 20,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#ccc',
//     height: 140,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#d1d1d1',
//   },
//   textContainer: {
//     marginLeft: 16,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   textLineFull: {
//     height: 14,
//     backgroundColor: '#d1d1d1',
//     borderRadius: 4,
//     marginBottom: 18,
//     width: '100%',
//   },
//   textLineHalf: {
//     height: 14,
//     backgroundColor: '#d1d1d1',
//     borderRadius: 4,
//     width: '60%',
//   },
//   shimmer: {
//     width: 80,
//     height: '100%',
//   },
// });
