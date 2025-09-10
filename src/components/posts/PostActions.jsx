import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PostActions = ({
  liked,
  setLiked,
  repeated,
  setRepeated,
  post,
  onCommentPress,
  variant = "default",
}) => {
  const isReel = variant === "reel";
  const navigation = useNavigation();
  const VerticalButton = ({ icon, count, onPress, color, active, bg }) => {
    // Create a single-tap gesture
    const tapGesture = Gesture.Tap()
      .numberOfTaps(1)
      .maxDelay(250)
      .onEnd((_, success) => {
        if (success) runOnJS(onPress)();
      });

    return (
      <GestureDetector gesture={tapGesture}>
        <View className="items-center mb-4">
          <View
            className={`p-2 rounded-full flex-row items-center justify-center ${
              active ? bg || "bg-yellow-300" : "bg-zinc-200/30"
            }`}
          >
            <Feather name={icon} size={30} color={color ? color : "#fff"} />
          </View>
          <Text className="text-white mt-1 text-sm">{count}</Text>
        </View>
      </GestureDetector>
    );
  };

  if (isReel) {
    return (
      <View className="absolute right-4 bottom-24 -translate-y-1/2 items-center">
        <VerticalButton
          icon="smile"
          count={liked ? post.likes + 1 : post.likes}
          onPress={() => setLiked(!liked)}
          color={liked ? "#ca8a04" : "#fff"}
          active={liked}
        />
        <VerticalButton
          icon="message-circle"
          count={post.comments ?? ""}
          onPress={onCommentPress}
        />
        <VerticalButton
          icon="repeat"
          count={repeated ? post.repeats + 1 : post.repeats}
          onPress={() => setRepeated(!repeated)}
          color="#fff"
          bg="bg-primary"
          active={repeated}
        />
      </View>
    );
  }

  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      <View className="flex-row gap-4">
        <View className="flex-row items-center rounded-full">
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            <View
              className={`flex-row items-center p-2 rounded-full ${
                liked ? "bg-yellow-100" : "bg-zinc-100"
              }`}
            >
              <Feather
                name="smile"
                size={24}
                color={liked ? "#ca8a04" : "#555"}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="pl-2 h-[38px] bg-white flex-row items-center"
            onPress={() =>
              navigation.navigate("ActionLists", { action: "smile" })
            }
          >
            <Text className="text-base">
              {typeof post.likes === "number"
                ? (liked ? post.likes + 1 : post.likes).toLocaleString()
                : " "}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onCommentPress}
          className="flex-row items-center rounded-full"
        >
          <View className="flex-row items-center p-2 rounded-full bg-zinc-100">
            <Feather name="message-circle" size={24} color="#555" />
          </View>
          <Text className="ml-2 text-base text-zinc-700">
            {typeof post.comments === "number" ? post.comments : " "}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-start">
        <TouchableOpacity
          onPress={() => setRepeated(!repeated)}
          className={`flex-row items-center p-2 rounded-full ${
            repeated ? "bg-primary/20" : "bg-zinc-100"
          }`}
        >
          <Feather
            name="repeat"
            size={23}
            color={repeated ? "#5ba1d6" : "#555"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="pl-2 h-[38px] bg-white flex-row items-center"
          onPress={() =>
            navigation.navigate("ActionLists", { action: "repeat" })
          }
        >
          <Text className="text-base">
            {typeof post.repeats === "number"
              ? repeated
                ? post.repeats + 1
                : post.repeats
              : " "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostActions;
