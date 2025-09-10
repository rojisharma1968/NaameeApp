import { View, Text, Pressable } from "react-native";
import { Feather, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PostFooter = ({ post }) => {
  const navigation = useNavigation();

  const activityIcons = [
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

  const renderCaption = (caption) => {
    return (
      <Text className="text-sm text-zinc-700 flex-wrap">
        <Text className="font-semibold text-zinc-900">{post.username} </Text>
        {caption.split(/(\s+)/).map((word, index) => {
          const isTag = word.startsWith("#") || word.startsWith("@");

          if (isTag) {
            return (
              <Text
                key={index}
                className="text-primary"
                suppressHighlighting={true}
                onPress={() => navigation.navigate("HashTags", { tag: word })}
              >
                {word}
              </Text>
            );
          }

          return <Text key={index}>{word}</Text>;
        })}
      </Text>
    );
  };

  return (
    <View className="px-4 pb-1 mt-2">
      {renderCaption(post.caption)}

      {/* Activity status row */}
      <View className="flex-row flex-wrap items-center gap-x-3 gap-y-0.5 mt-2">
        {activityIcons.map(
          (item) =>
            post[item.type]?.trim() && (
              <View key={item.type} className="flex-row items-center">
                {item.icon}
                <Pressable
                  onPress={() =>
                    navigation.navigate("HashTags", {
                      tag: `#${post[item.type]}`,
                    })
                  }
                >
                  <Text className="text-sm ml-1 text-primary">
                    #{post[item.type]}
                  </Text>
                </Pressable>
              </View>
            )
        )}
      </View>
      <Text className="text-xs text-zinc-400 mt-2">{post.time}</Text>
    </View>
  );
};

export default PostFooter;
