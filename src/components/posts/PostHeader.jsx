import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

import Avatar from "../Avatar";

// Shared BlurView styles
const blurViewStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  profile: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  options: {
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
});

const PostHeader = ({ post, onOptionsPress }) => {
  const navigation = useNavigation();

  const renderContent = useCallback(
    (banner = false) => (
      <View className="flex-row items-center justify-between px-4 py-1 w-full">
        <BlurView
          intensity={10}
          style={[blurViewStyles.container, blurViewStyles.profile]}
        >
          <Pressable
            onPress={() => navigation.navigate("UsersProfile", { userId: post.userId })}
            className="flex-row items-center gap-2"
            accessibilityLabel={`View ${post.username || "user"}'s profile`}
            accessibilityRole="button"
          >
            <Avatar
              uri={post.profileImage || "https://via.placeholder.com/40"}
              className="size-10"
            />
            <Text
              className={`font-semibold text-base ${banner ? "text-white" : "text-black"}`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {post.username || "Unknown User"}
            </Text>
          </Pressable>
        </BlurView>

        <TouchableOpacity
          onPress={onOptionsPress}
          style={{ marginLeft: 8 }}
          accessibilityLabel="Post options"
          accessibilityRole="button"
        >
          <BlurView
            intensity={10}
            style={[blurViewStyles.container, blurViewStyles.options]}
          >
            <Feather
              name="more-horizontal"
              size={24}
              color={banner ? "#fff" : "#000"}
            />
          </BlurView>
        </TouchableOpacity>
      </View>
    ),
    [post, onOptionsPress, navigation]
  );

  return post.banner ? (
    <ImageBackground
      source={{ uri: post.banner || "https://via.placeholder.com/300" }}
      imageStyle={{ resizeMode: "cover" }}
      className="w-full"
    >
      {renderContent(true)}
    </ImageBackground>
  ) : (
    <View className="bg-white rounded-b-3xl">{renderContent()}</View>
  );
};

export default PostHeader;