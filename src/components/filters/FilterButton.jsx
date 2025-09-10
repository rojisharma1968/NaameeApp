import React, { useCallback, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useImageProcessor from "../../hooks/useImageProcessor";
import * as FileSystem from "expo-file-system";

const FilterButton = React.memo(
  ({ filterName, previewUri, imageUri, onFilterSelect, selectedFilter }) => {
    const { status } = useImageProcessor(imageUri, "preview");
    const [validatedUri, setValidatedUri] = useState(null);
    const [uriStatus, setUriStatus] = useState("loading");
    const [isPressed, setIsPressed] = useState(false); // Local state for optimistic UI
    const maxRetries = 2;
    const retryDelay = 100;

    // Sync local isPressed state with selectedFilter prop
    useEffect(() => {
      setIsPressed(selectedFilter === filterName);
    }, [selectedFilter, filterName]);

    useEffect(() => {
      const validateImageUri = async (uri, attempt = 1) => {
        if (!uri) {
          setValidatedUri(imageUri);
          setUriStatus("ready");
          return;
        }

        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.exists) {
            setValidatedUri(uri);
            setUriStatus("ready");
          } else {
            if (attempt < maxRetries) {
              setTimeout(() => validateImageUri(uri, attempt + 1), retryDelay);
            } else {
              setValidatedUri(imageUri);
              setUriStatus("ready");
            }
          }
        } catch (error) {
          console.error(`Image validation error for ${filterName}:`, error);
          if (attempt < maxRetries) {
            setTimeout(() => validateImageUri(uri, attempt + 1), retryDelay);
          } else {
            setValidatedUri(imageUri);
            setUriStatus("ready");
          }
        }
      };

      validateImageUri(previewUri);
    }, [previewUri, imageUri, filterName]);

    const handlePress = useCallback(() => {
      setIsPressed(true); // Optimistic UI update
      onFilterSelect(filterName);
    }, [filterName, onFilterSelect]);

    const isReady =
      status === "ready" && uriStatus === "ready" && !!validatedUri;

    return (
      <TouchableOpacity onPress={handlePress} className="mx-2 my-1.5">
        <View className="relative size-24 bg-gray-100 rounded-xl overflow-hidden">
          {isReady ? (
            <Image
              source={{ uri: validatedUri }}
              className="size-24 rounded-xl"
              resizeMode="cover"
              onError={(error) =>
                console.error(
                  `Image load error for ${filterName}:`,
                  error.nativeEvent
                )
              }
            />
          ) : (
            <View className="size-24 rounded-xl bg-gray-200" />
          )}
          <View className="absolute bottom-1 left-1 bg-black/50 px-1 py-0.5 rounded-md">
            <Text className="text-white text-xs font-medium">
              {filterName || "Loading"}
            </Text>
          </View>
          <View className={`absolute top-1 right-1 rounded-full ${isPressed ? 'bg-primary' : 'bg-transparent'}`}>
            <Feather
              name="check-circle"
              size={20}
              color={isPressed ? "#fff" : "transparent"}
            />
          </View>
          {(status !== "ready" || uriStatus !== "ready") && (
            <View className="absolute inset-0 flex items-center justify-center">
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

export default FilterButton;