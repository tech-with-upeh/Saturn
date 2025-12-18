import { CaretDown } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DropItem {
  title: string;
  icon: any;
}

interface Props {
  data: DropItem[];
  onSelect?: (item: DropItem) => void;
}

export default function TokenDropdown({ data, onSelect }: Props) {
  const [selected, setSelected] = useState<DropItem>(data[0]);
  const [open, setOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (open) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSelect = (item: DropItem) => {
    setSelected(item);
    toggleDropdown();
    onSelect?.(item);
  };

  return (
    <View style={styles.container}>
      {/* Selected button */}
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={0.8}
        style={styles.button}
      >
        <View style={styles.row}>
          <Image
            source={selected.icon}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.label}>{selected.title}</Text>
        </View>
        <CaretDown size={18} color="#555" />
      </TouchableOpacity>

      {/* Dropdown list */}
      {open && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <FlatList
            scrollEnabled={false}
            data={data}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.item}
              >
                <Image
                  source={item.icon}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <Text style={styles.itemLabel}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    position: "relative",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffffffce",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontWeight: "600",
    color: "#222",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "#ffffffce",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    zIndex: 50,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  itemIcon: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  itemLabel: {
    fontWeight: "500",
    color: "#333",
  },
});
