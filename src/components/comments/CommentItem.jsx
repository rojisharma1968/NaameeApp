import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import Avatar from "../Avatar";
import { useRef, useMemo } from "react";

const CommentItem = ({ comment, onPopupToggle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Keyboard.dismiss(); // ✅ press par keyboard band
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  };

  const handleLongPress = () => {
    Keyboard.dismiss(); // ✅ long press par bhi keyboard band
    onPopupToggle(true, comment.id);
  };

  // Memoize text processing
  const processedText = useMemo(() => {
    return (comment.text || "").split(/(\s+)/).map((part, index) => {
      if (part.startsWith("@") || part.startsWith("#")) {
        return (
          <Text key={index} style={{ color: "#5ba1d6" }}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  }, [comment.text]);

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="mx-3 my-1.5 bg-gray-100 rounded-xl"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        delayLongPress={200}
      >
        <View className="flex-row p-3 items-start">
          <Avatar uri={comment.image} className="w-10 h-10 rounded-full mr-2.5" />
          <View className="flex-1" style={{ overflow: "visible" }}>
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-base font-semibold text-black">
                {comment.username}
              </Text>
              <Text className="text-xs text-gray-400 font-medium">
                {comment.time}
              </Text>
            </View>
            <Text className="text-sm text-gray-800 leading-5">
              {processedText}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CommentItem;
