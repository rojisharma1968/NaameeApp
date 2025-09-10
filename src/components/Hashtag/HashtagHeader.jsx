import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import Avatar from "../Avatar";

const HashtagHeader = ({ tag = "travel", postCount = 1280 }) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-5 bg-white">
      <View className="flex-row items-center">
        <Avatar
          variant="hashtag"
          className="mr-2 size-12"
        />
        <Text className="text-xl font-bold text-zinc-900">{tag}</Text>
      </View>
      <Text className="text-lg text-zinc-500">
        {postCount.toLocaleString()} posts
      </Text>
    </View>
  );
};

export default HashtagHeader;
