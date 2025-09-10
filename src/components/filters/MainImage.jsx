import React, { useRef } from "react";
import { View, ActivityIndicator, Text, Dimensions } from "react-native";
import { GLView } from "expo-gl";
import { FILTERS } from "./Filters";
import useImageProcessor from "../../hooks/useImageProcessor";
import useWebGL from "../../hooks/useWebGL";

const { width: screenWidth } = Dimensions.get("window");

const MainImage = ({ imageUri, selectedFilter = "Normal" }) => {
  const glRef = useRef(null);
  const { dimensions, processedUri, status } = useImageProcessor(
    imageUri,
    "main"
  );
  const { onContextCreate } = useWebGL({
    glRef,
    imageUri: processedUri,
    dimensions,
    shader: FILTERS[selectedFilter],
    onError: (error) => console.error("WebGL error:", error),
  });

  const containerWidth = screenWidth - 32;

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
      {status === "ready" && processedUri ? (
        <GLView
          style={{ width: containerWidth, height: "100%" }}
          className="rounded-2xl overflow-hidden bg-gray-100"
          msaaSamples={0}
          onContextCreate={onContextCreate}
        />
      ) : status === "error" ? (
        <View
          style={{ width: containerWidth, height: "100%" }}
          className="rounded-2xl bg-gray-100 justify-center items-center"
        >
          <Text className="text-red-500">Failed to load image</Text>
        </View>
      ) : (
        <View
          style={{ width: containerWidth, height: "100%" }}
          className="rounded-2xl bg-gray-100 justify-center items-center"
        >
          <ActivityIndicator size="large" color="#888" />
        </View>
      )}
    </View>
  );
};

export default React.memo(MainImage);