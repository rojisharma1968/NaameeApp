import { useState, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MainImage from "../components/filters/MainImage";
import FilterBar from "../components/filters/FilterBar";
import * as ImageManipulator from "expo-image-manipulator";
import { GLView } from "expo-gl";
import useImageProcessor from "../hooks/useImageProcessor";
import useWebGL from "../hooks/useWebGL";
import { FILTERS } from "../components/filters/Filters";

const FilterScreen = () => {
  const route = useRoute();
  const { imageUri } = route.params || {};
  const [selectedFilter, setSelectedFilter] = useState("Normal");
  const navigation = useNavigation();

  const mainImageUri = Array.isArray(imageUri)
    ? imageUri.find((uri) => uri && typeof uri === "string")
    : typeof imageUri === "string"
      ? imageUri
      : null;

  const mainProcessed = useImageProcessor(mainImageUri, "main");

  const sharedGLRef = useRef(null);
  const {
    onContextCreate: onSharedContextCreate,
    generateFilteredImage,
    isContextReady,
  } = useWebGL({
    glRef: sharedGLRef,
    imageUri: mainProcessed.processedUri,
    dimensions: mainProcessed.dimensions,
    shader: null,
    onError: (error) => console.error("Shared WebGL error:", error),
    mode: "generation",
  });

  const handleReset = () => {
    navigation.replace("Tabs", { screen: "Camera" });
  };

  const handleDone = async () => {
    if (mainProcessed.status !== "ready" || !mainProcessed.processedUri) {
      console.error("Image not ready");
      return;
    }

    let finalUri;

    if (selectedFilter === "Normal") {
      const processed = await ImageManipulator.manipulateAsync(
        mainProcessed.processedUri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 0.8 }
      );
      finalUri = processed.uri;
    } else {
      if (!isContextReady) {
        console.error("Generation context not ready");
        return;
      }
      finalUri = await generateFilteredImage({
        imageUri: mainProcessed.processedUri,
        filterShader: FILTERS[selectedFilter],
      });
    }

    if (finalUri) {
      navigation.replace("CreatePost", { imageUri: finalUri });
    } else {
      console.error("Failed to generate or convert image");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-5">
      {mainImageUri ? (
        <>
          <MainImage imageUri={mainImageUri} selectedFilter={selectedFilter} />
          <FilterBar
            imageUri={mainImageUri}
            onFilterSelect={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
          <View className="flex-row justify-between space-x-6 px-5 mt-5 mb-6">
            <TouchableOpacity
              className="bg-zinc-200 p-3 rounded-full"
              onPress={handleReset}
            >
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary p-3 rounded-full"
              onPress={handleDone}
            >
              <Feather name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {mainProcessed.status === "ready" && mainProcessed.processedUri && (
            <GLView
              ref={sharedGLRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: mainProcessed.dimensions.width,
                height: mainProcessed.dimensions.height,
                opacity: 0,
              }}
              onContextCreate={onSharedContextCreate}
              msaaSamples={0}
            />
          )}
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Feather name="alert-circle" size={40} color="#555" />
          <Text className="text-base text-gray-500 mt-2">
            No images provided
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FilterScreen;
