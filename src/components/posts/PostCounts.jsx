import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const PostCounts = ({ mediaViews, textClass, iconSize, bg = false }) => {
  const formatViews = (views) => {
    if (views >= 1_000_000_000_000) {
      return (views / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    } else if (views >= 1_000_000_000) {
      return (views / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (views >= 1_000_000) {
      return (views / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (views >= 1_000) {
      return (views / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return views.toString();
  };

  return bg ? (
    <View
      className={`absolute left-0 bottom-0 flex-row items-center`}
    >
      <BlurView
        intensity={10}
        className="flex-row items-center px-2 py-1.5 rounded-tr-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderWidth: 1,
          borderLeftWidth:0,
          borderColor: "rgba(255, 255, 255, 0.3)",
          shadowColor: "#fff",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 20,
        }}
      >
        <Feather name="eye" size={iconSize || 14} color="#fff" />
        <Text className={`${textClass || "text-sm"} font-bold text-white ml-2`}>
          {formatViews(mediaViews)}
        </Text>
      </BlurView>
    </View>
  ) : (
    <View
      className={`absolute left-0 bottom-0 flex-row items-center px-2 py-1.5 rounded-tr-lg`}
    >
      <Feather name="eye" size={iconSize || 14} color="#fff" />
      <Text className={`${textClass || "text-sm"} font-bold text-white ml-2`}>
        {formatViews(mediaViews)}
      </Text>
    </View>
  );
};

export default PostCounts;
