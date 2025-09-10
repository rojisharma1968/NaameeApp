import { View, Text, Pressable } from "react-native";
import Avatar from "./Avatar";
import Button from "./Button";

const ResultCard = ({ item, onFollowToggle, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-gray-200 p-4 mb-3 rounded-2xl flex-row items-center justify-between active:scale-[0.99]"
    >
      <View className="flex-row items-center">
        <Avatar
          uri={item.type === "user" ? item.avatar : undefined}
          variant={item.type === "post" ? "hashtag" : undefined}
          className="mr-4 size-12"
        />
        <View>
          <Text className="text-lg font-medium text-gray-900">
            {item.name || item.hashtag}
          </Text>
          <Text className="text-sm text-gray-500">
            {item.username || `${item.count || 0} posts`}
          </Text>
        </View>
      </View>

      {item.type === "user" && (
        <Button
          className="!py-2"
          textClass="!text-base font-medium"
          title={item.isFollowing ? "Following" : "Follow"}
          variant={item.isFollowing ? "secondary" : "primary"}
          onPress={() => onFollowToggle(item.id)}
        />
      )}
    </Pressable>
  );
};

export default ResultCard;
