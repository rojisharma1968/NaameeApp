import { View, Text, Pressable, Animated } from "react-native";
import Avatar from "../Avatar";
import { useNavigation } from "@react-navigation/native";
import MediaRenderer from "../MediaRenderer";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import CustomModal from "../CustomModal";

const NotificationItem = ({ type, user, target, time, comment, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const formattedDate = new Date(time).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Message text
  let message = "";
  if (type === "smile") {
    message = `${user.name} smiled on ${target?.label}.`;
  } else if (type === "repeat") {
    message = `${user.name} repeated ${target?.label}.`;
  } else if (type === "comment") {
    message = `${user.name} commented on ${target?.label}: "${comment}"`;
  } else if (type === "follow") {
    message = `${user.name} started following you.`;
  }

  // Animations
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    setShowDelete(true);
  };

  // Delete button press → open modal
  const handleDeletePress = () => {
    setShowModal(true);
  };

  // Proper close modal
  const handleCloseModal = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowModal(false);
    setShowDelete(false);
  };

  // Animate delete icon show/hide
  useEffect(() => {
    Animated.spring(deleteAnim, {
      toValue: showDelete ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 60,
    }).start();

    if (showDelete) {
      timerRef.current = setTimeout(() => {
        setShowDelete(false);
        timerRef.current = null;
      }, 5000); // auto hide after 5s
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showDelete]);

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLongPress={handleLongPress}
          delayLongPress={200}
          className="bg-white mx-4 mb-3 rounded-xl flex-row items-start p-4 relative"
        >
          {/* Avatar */}
          <Pressable onPress={() => navigation.navigate("UsersProfile")}>
            <Avatar uri={user.avatar} className="size-12 mr-3" />
          </Pressable>

          {/* Content */}
          <View className="flex-1">
            <Text
              className="text-[15px] text-gray-800 leading-[1.2]"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {message}
            </Text>
            <Text className="text-sm text-zinc-600 mt-1">{formattedDate}</Text>
          </View>

          {/* Delete icon (appears on long press) */}
          {showDelete ? (
            <Animated.View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: [
                  {
                    scale: deleteAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    }),
                  },
                ],
                opacity: deleteAnim,
              }}
            >
              <Pressable
                onPress={handleDeletePress}
                className="bg-red-100 p-2 size-12 ml-3 rounded-md"
              >
                <Ionicons name="trash-outline" size={30} color="#b91c1c" />
              </Pressable>
            </Animated.View>
          ) : (
            target?.thumbnail && (
              <Pressable onPress={() => navigation.navigate("Comments")}>
                <MediaRenderer
                  mediaType={target.mediaType}
                  uri={target.thumbnail}
                  iconBG='bg-black/60'
                  className="size-12 rounded-md overflow-hidden ml-3"
                />
              </Pressable>
            )
          )}
        </Pressable>
      </Animated.View>

      {/* Custom Modal for Delete Confirm */}
      <CustomModal
        visible={showModal}
        onClose={handleCloseModal}
        title="Are you sure you want to delete this notification?"
        type="alert"
        alertbtntext2="Delete"
        onConfirm={() => {
          onDelete();
          handleCloseModal();
        }}
      />
    </>
  );
};

export default NotificationItem;
