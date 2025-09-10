import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import CustomModal from "../components/CustomModal";
import ToggleSelector from "../components/ToggleSelector";
import { VideoView, useVideoPlayer } from "expo-video";
import useAppLinking from "../hooks/useAppLinking";

const CreatePostScreen = () => {
  const { openAppFirst } = useAppLinking();
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedLocation } = route.params || {};
  const CAPTION_LIMIT = 200;
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [videoUri, setVideoUri] = useState(route.params?.videoUri || null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [postVisibility, setPostVisibility] = useState("following");
  const [selectedHashtagType, setSelectedHashtagType] = useState(null);
  const [hashtagValues, setHashtagValues] = useState({
    mood: "",
    wearing: "",
    listening: "",
    watching: "",
    playing: "",
  });
  const [mediaVisible, setMediaVisible] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState({
    width: 0,
    height: 0,
  });

  const player = useVideoPlayer(videoUri);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  let displayWidth = screenWidth;
  let displayHeight = screenHeight;

  if (mediaDimensions.width > 0 && mediaDimensions.height > 0) {
    const aspectRatio = mediaDimensions.width / mediaDimensions.height;
    const screenAspectRatio = screenWidth / screenHeight;

    if (aspectRatio > screenAspectRatio) {
      displayWidth = screenWidth;
      displayHeight = screenWidth / aspectRatio;
    } else {
      displayHeight = screenHeight;
      displayWidth = screenHeight * aspectRatio;
    }
  }

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (mediaVisible && imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setMediaDimensions({ width, height });
        },
        (error) => {
          console.error("Failed to get image size:", error);
        }
      );
    }
  }, [mediaVisible, imageUri]);

  useEffect(() => {
    if (videoUri) {
      player.play();
    } else if (!videoUri) {
      player.pause();
    }
  }, [videoUri, player]);

  const handlePost = () => {
    navigation.replace("Tabs", { screen: "Home" });
  };

  const hashtagTypes = [
    {
      type: "mood",
      icon: <FontAwesome5 name="theater-masks" size={14} color="#5ba1d6" />,
    },
    {
      type: "wearing",
      icon: <Feather name="shopping-bag" size={14} color="#5ba1d6" />,
    },
    {
      type: "listening",
      icon: <Feather name="music" size={14} color="#5ba1d6" />,
    },
    {
      type: "watching",
      icon: <Feather name="film" size={14} color="#5ba1d6" />,
    },
    {
      type: "playing",
      icon: <FontAwesome6 name="gamepad" size={14} color="#5ba1d6" />,
    },
  ];

  const shareOptions = [
    {
      key: "x",
      label: "Twitter",
      icon: <FontAwesome6 name="x-twitter" size={20} color="#5ba1d6" />,
      appUri: "twitter://post",
      uri: "https://twitter.com/intent/tweet",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <Feather name="facebook" size={20} color="#5ba1d6" />,
      appUri: "fb://composer",
      uri: "https://www.facebook.com/sharer/sharer.php",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Feather name="linkedin" size={20} color="#5ba1d6" />,
      appUri: "linkedin://shareArticle?mini=true",
      uri: "https://www.linkedin.com/sharing/share-offsite",
    },
  ];

  const formatHashtags = (text) => {
    if (!text || !text.trim()) return "";
    const endsWithSpace = text.endsWith(" ");
    let cleanText = text.replace(/#/g, "");
    cleanText = cleanText.replace(/\s+$/, "");
    const words = cleanText.split(/\s+/).filter((word) => word.length > 0);
    let formatted = words
      .map((word) => `#${word.replace(/[^a-zA-Z0-9_]/g, "")}`)
      .join(" ");
    if (endsWithSpace) {
      formatted += " ";
    }
    return formatted;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Media Display Section */}
          {videoUri || imageUri ? (
            <View className="mb-5 rounded-2xl overflow-hidden bg-black h-80">
              {videoUri ? (
                <VideoView
                  player={player}
                  style={{ width: "100%", height: "100%" }}
                  allowsFullscreen
                  contentFit="cover"
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setMediaVisible(true)} // Trigger modal for images
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full rounded-2xl object-cover"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="mb-5 rounded-2xl bg-gray-100 flex items-center justify-center h-80">
              <Text className="text-gray-500 text-sm">No Media Selected</Text>
            </View>
          )}

          <View className="mb-2">
            <Input
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption..."
              multiline={true}
              onClear={() => setCaption("")}
              wrapClass="mb-1"
              highlightMentions
              minMLHeight={120}
              maxLength={CAPTION_LIMIT}
            />
            <Text
              className={`text-right text-sm ${
                caption.length > CAPTION_LIMIT
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {caption.length}/{CAPTION_LIMIT}
            </Text>
          </View>

          {/* Hashtags */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-3">
              Hashtags
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {hashtagTypes.map(({ type, icon }) => {
                const filled = hashtagValues[type]?.trim().length > 0;
                return (
                  <Button
                    key={type}
                    title={hashtagValues[type] || type}
                    iconLeft={icon}
                    className={`py-[6px] px-5 flex-row items-center gap-1 ${
                      filled
                        ? "bg-black border-black"
                        : "bg-white border-gray-400"
                    }`}
                    textClass="text-gray-700 text-sm"
                    onPress={() => setSelectedHashtagType(type)}
                    variant="outline"
                  />
                );
              })}
            </View>
          </View>

          {/* Location */}
          <View className="flex-row mb-6 gap-3">
            <Button
              iconLeft={<Feather name="map-pin" size={18} color="#444" />}
              title={location || "Add Location"}
              className="!flex-1 py-[10px]"
              textClass="text-base"
              variant="outline"
              onPress={() =>
                navigation.navigate("LocationSearch", {
                  imageUri,
                  videoUri,
                })
              }
            />
          </View>

          {/* Post Visibility */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-3">
              Post Visibility
            </Text>
            <ToggleSelector
              value={postVisibility}
              onChange={setPostVisibility}
              className="mb-6"
              options={[
                { label: "Following", value: "following", icon: "users" },
                { label: "Only Me", value: "onlyMe", icon: "lock" },
              ]}
            />
          </View>

          {/* Social Share */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-3">
              Share to
            </Text>
            <View className="flex-row justify-between gap-2">
              {shareOptions.map((opt) => {
                return (
                  <Button
                    key={opt.key}
                    iconLeft={opt.icon}
                    title={opt.label}
                    className="py-[10px] !flex-1 border-gray-400"
                    textClass="text-base text-zinc-600"
                    variant="outline"
                    onPress={() => openAppFirst(opt.uri, opt.appUri)}
                  />
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Button
              iconLeft={
                <Feather name="arrow-left-circle" size={24} color="black" />
              }
              title="Back"
              variant="secondary"
              onPress={() => navigation.replace("Tabs", { screen: "Camera" })}
              className="!flex-1 py-[12px]"
              textClass="text-lg"
            />
            <Button
              iconRight={
                <Feather name="upload-cloud" size={24} color="white" />
              }
              title="Post"
              variant="primary"
              onPress={handlePost}
              className="!flex-1 py-[12px]"
              textClass="text-lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Hashtag Input Modal */}
      <CustomModal
        title={`#${selectedHashtagType}`}
        visible={!!selectedHashtagType}
        onClose={() => setSelectedHashtagType(null)}
        type="input"
        inputValue={hashtagValues[selectedHashtagType] || ""}
        onChangeInput={(text) => {
          const formattedText = formatHashtags(text);
          setHashtagValues((prev) => ({
            ...prev,
            [selectedHashtagType]: formattedText,
          }));
        }}
        placeholder={`Enter #${selectedHashtagType}...`}
        onSubmit={() => {
          const formattedText = formatHashtags(
            hashtagValues[selectedHashtagType]
          );
          setHashtagValues((prev) => ({
            ...prev,
            [selectedHashtagType]: formattedText,
          }));
          setSelectedHashtagType(null);
        }}
      />

      {/* Media Preview Modal */}
      <Modal
        visible={mediaVisible && !!imageUri}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMediaVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SafeAreaView style={{ width: displayWidth, height: displayHeight }}>
            <View className="relative">
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 10,
                  right: 20,
                  zIndex: 10,
                }}
                onPress={() => setMediaVisible(false)}
              >
                <Feather name="x-circle" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {}}
                style={{ width: "100%", height: "100%" }}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
