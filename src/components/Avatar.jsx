import React from "react";
import { View, Image, Text } from "react-native";

const Avatar = ({ uri,  variant = "image", className = "size-10" }) => {
  if (variant === "hashtag") {
    return (
      <View
        className={`bg-zinc-200 justify-center items-center rounded-full ${className}`}
      >
        <Text
          className="font-bold text-2xl"
        >
          #
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      className={`bg-gray-300 rounded-full ${className}`}
    />
  );
};

export default Avatar;
