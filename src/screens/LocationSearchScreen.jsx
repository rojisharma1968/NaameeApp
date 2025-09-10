import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Button from "../components/Button";
import Input from "../components/Input";
import { FontAwesome6 } from "@expo/vector-icons";

const demoLocations = [
  "New York, USA",
  "London, UK",
  "Tokyo, Japan",
  "Mumbai, India",
  "Sydney, Australia",
];

const LocationSearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleSelect = (loc) => {
    const existingParams = route.params || {};

    navigation.navigate({
      name: "CreatePost",
      params: {
        ...existingParams, // keep imageUri, videoUri, etc.
        selectedLocation: loc, // just update the location
      },
      merge: true,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-6">
      <Input
        placeholder="Search for a location..."
        wrapClass="mb-2"
        icon="map-pin"
        onChangeText={() => {}}
        onClear={() => {}}
      />

      <Button
        iconLeft={
          <FontAwesome6 name="location-crosshairs" size={20} color="black" />
        }
        title="Use Current Location"
        onPress={() => handleSelect("Current Location")}
        className="py-[12px] mb-4"
        textClass="text-base"
        variant="secondary"
      />

      <FlatList
        data={demoLocations}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)} className="py-3">
            <Text className="text-base text-gray-800">{item}</Text>
          </TouchableOpacity>
        )}
        className="mb-6"
      />
    </SafeAreaView>
  );
};

export default LocationSearchScreen;
