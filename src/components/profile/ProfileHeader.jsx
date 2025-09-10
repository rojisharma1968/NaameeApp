import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking, Modal, Image, Dimensions } from "react-native";
import Button from "../Button";
import Avatar from "../Avatar";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const ProfileHeader = ({ avatarUrl, totalPosts, user = "me", repeatPosts }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (visible && avatarUrl && imageDimensions.width === 0) {
      Image.getSize(avatarUrl, (width, height) => {
        setImageDimensions({ width, height });
      }, (error) => {
        console.error("Failed to get image size:", error);
      });
    }
  }, [visible, avatarUrl]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  let displayWidth = screenWidth;
  let displayHeight = screenHeight;

  if (imageDimensions.width > 0 && imageDimensions.height > 0) {
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    const screenAspectRatio = screenWidth / screenHeight;

    if (aspectRatio > screenAspectRatio) {
      displayWidth = screenWidth;
      displayHeight = screenWidth / aspectRatio;
    } else {
      displayHeight = screenHeight;
      displayWidth = screenHeight * aspectRatio;
    }
  }

  const stats = useMemo(() => [
    { label: "Posts", value: totalPosts || 0 },
    { label: "Repeats", value: repeatPosts || 0 },
    { label: "Followers", value: "2.5k" },
    { label: "Following", value: "180" },
  ], [totalPosts]);

  return (
    <>
      <View className="flex-col p-4 gap-4 items-center">
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Avatar className="size-28" uri={avatarUrl} />
        </TouchableOpacity>
        <View className="flex-1 flex-row gap-7 justify-around">
          {stats.map((stat) => (
            <View className="items-center" key={stat.label}>
              <Text className="font-bold text-lg">{stat.value}</Text>
              <Text className='text-lg'>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-4">
        <Text className="text-lg font-semibold">@yourusername</Text>

        {/* Bio Wrapper */}
        <View className="mt-2 space-y-1">
          <Text className="text-base text-gray-700">
            Traveler ✈️ | Dreamer 🌙 | Coffee Lover ☕️
          </Text>
          <Text className="text-base text-gray-700">
            Sharing stories from around the world 🌍
          </Text>
          <Text className="text-base text-gray-700">
            Capturing moments one photo at a time 📸
          </Text>
          <Text className="text-base text-gray-700">
            Passionate about culture, cuisine, and connection 💬
          </Text>
        </View>

        {/* Website */}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://yourwebsite.com")}
          className="flex-row items-center mt-4"
        >
          <Feather name="link" size={16} color="gray" />
          <Text className="ml-2 text-primary">yourwebsite.com</Text>
        </TouchableOpacity>

        {/* Location */}
        <View className="flex-row items-center mt-2">
          <Feather name="map-pin" size={16} color="gray" />
          <Text className="ml-2 text-gray-700">Mumbai, India</Text>
        </View>
      </View>

      <View className="px-4 mt-3 mb-5">
        <Button
          onPress={() => user === "me" && navigation.navigate("EditProfile")}
          variant={user === "me" ? "secondary" : "primary"}
          title={user === "me" ? "Edit Profile" : "Follow"}
          className="!py-3 rounded-md"
          textClass="!text-base"
        />
      </View>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className='px-5'
            style={{ width: displayWidth, height: displayHeight }}
          >
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ✅ Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(ProfileHeader, (prev, next) => {
  return (
    prev.avatarUrl === next.avatarUrl &&
    prev.totalPosts === next.totalPosts &&
    prev.user === next.user
  );
});