import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";

const ToggleSelector = ({
  value,
  onChange,
  options = [],
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const toggleWidth = useRef(0);

  useEffect(() => {
    const index = options.findIndex((opt) => opt.value === value);
    Animated.spring(slideAnim, {
      toValue: index,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <View
      className="flex-row bg-gray-200 rounded-full p-1.5 relative overflow-hidden"
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        toggleWidth.current = width;
      }}
    >
      {/* Toggle slider (thumb) */}
      <Animated.View
        className="absolute bg-primary rounded-full"
        style={{
          width: toggleWidth.current ? toggleWidth.current / options.length : "50%",
          top: 1.5,
          bottom: 1.5, // ✅ Fix for consistent height
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: options.map((_, i) => i),
                outputRange: options.map(
                  (_, i) =>
                    (toggleWidth.current / options.length) * i + 1.5
                ),
              }),
            },
          ],
        }}
      />

      {/* Options */}
      {options.map(({ value: optionValue, label, icon }) => {
        const isSelected = optionValue === value;
        return (
          <TouchableOpacity
            key={optionValue}
            onPress={() => onChange(optionValue)}
            className="flex-1 py-2 rounded-full flex-row items-center justify-center z-10"
          >
            <Feather
              name={icon}
              size={18}
              color={isSelected ? "#ffffff" : "#4b5563"}
              style={{ marginRight: 8 }}
            />
            <Text
              className={`text-lg font-medium ${
                isSelected ? "text-white" : "text-gray-700"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ToggleSelector;
