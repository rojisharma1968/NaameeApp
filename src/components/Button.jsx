import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Animated,
} from "react-native";

const VARIANT_STYLES = {
  primary: {
    container: "bg-primary",
    text: "text-white",
  },
  secondary: {
    container: "bg-gray-200",
    text: "text-black",
  },
  outline: {
    container: "border border-gray-400 border-solid bg-transparent",
    text: "text-black",
  },
  danger: {
    container: "bg-danger",
    text: "text-white",
  },
  text: {
    container: "bg-transparent",
    text: "text-zinc-800",
  },
  textDanger: {
    container: "bg-transparent",
    text: "text-danger",
  },
  textMuted: {
    container: "bg-transparent",
    text: "text-zinc-600",
  },
  white: {
    container: "bg-white",
    text: "text-primary",
  },
};

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  className = "",
  textClass = "",
  iconLeft = null,
  iconRight = null,
}) => {
  const isDisabled = disabled || loading;
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

  // Animation for liquid press effect
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.5, // More noticeable scale-down
      friction: 5, // Increased bounciness for liquid feel
      tension: 40, // Faster, snappier response
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Scale back to original
      friction: 8, // Increased bounciness for liquid feel
      tension: 5, // Faster, snappier response
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1} // Disable default opacity change
      disabled={isDisabled}
      className={`
        flex-row justify-center items-center
        px-4 py-4 rounded-xl
        ${styles.container}
        ${isDisabled ? "opacity-50" : ""}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      <Animated.View
        className={`flex-shrink flex-row justify-center items-center gap-1.5`}
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {loading ? (
          <ActivityIndicator
            size={24}
            color={
              variant === "outline" || variant === "secondary" ? "#000" : "#fff"
            }
          />
        ) : (
          <>
            {iconLeft && <View className="shrink-0">{iconLeft}</View>}
            <Text
              numberOfLines={1}
              className={`font-bold ${styles.text} ${textClass || "text-xl"}`}
            >
              {title}
            </Text>
            {iconRight && <View className="ml-2">{iconRight}</View>}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Button;
