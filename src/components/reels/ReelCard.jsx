import { useRef, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import SmileImage from "../../../assets/images/smile.png";
import repeatImage from "../../../assets/images/repeat.png";
import PostMedia from "../posts/PostMedia";
import PostActions from "../posts/PostActions";
import Avatar from "../Avatar";
import Button from "../Button";
import ProgressBar from "../ProgressBar";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReelCard = ({ post, isViewable }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [interactions, setInteractions] = useState({
    liked: false,
    repeated: false,
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);

  const smileScale = useRef(new Animated.Value(0)).current;
  const smileOpacity = useRef(new Animated.Value(0)).current;
  const repeatScale = useRef(new Animated.Value(0)).current;
  const repeatOpacity = useRef(new Animated.Value(0)).current;
  const playPauseScale = useRef(new Animated.Value(0)).current;
  const playPauseOpacity = useRef(new Animated.Value(0)).current;

  // animateIcon utility
  const animateIcon = useCallback(
    (
      scaleRef,
      opacityRef,
      scaleDuration = 300,
      fadeDuration = 700,
      fadeDelay = 400
    ) => {
      scaleRef.setValue(0);
      opacityRef.setValue(1);
      Animated.parallel([
        Animated.timing(scaleRef, {
          toValue: 1.2,
          duration: scaleDuration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityRef, {
          toValue: 0,
          duration: fadeDuration,
          delay: fadeDelay,
          useNativeDriver: true,
        }),
      ]).start();
    },
    []
  );

  const handleSingleTap = useCallback(async () => {
    Keyboard.dismiss();
    if (playerInstance) {
      try {
        if (playerInstance.playing) {
          await playerInstance.pause();
          setIsPlaying(false);
          animateIcon(playPauseScale, playPauseOpacity, 180, 500, 250);
        } else {
          await playerInstance.play();
          setIsPlaying(true);
          animateIcon(playPauseScale, playPauseOpacity, 180, 500, 250);
        }
      } catch (error) {
        console.error("Error toggling play/pause:", error);
      }
    }
  }, [playerInstance, animateIcon, playPauseScale, playPauseOpacity]);

  const handleDoubleTap = useCallback(() => {
    setInteractions((prev) => {
      if (!prev.liked) {
        animateIcon(smileScale, smileOpacity);
        return { ...prev, liked: true };
      }
      animateIcon(smileScale, smileOpacity);
      return prev;
    });
  }, [animateIcon, smileScale, smileOpacity]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleCommentNavigation = useCallback(() => {
    navigation.replace("Comments");
  }, [navigation]);

  // Gestures
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd((_, success) => {
      if (success) runOnJS(handleDoubleTap)();
    });

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(250)
    .onEnd((_, success) => {
      if (success) runOnJS(handleSingleTap)();
    });

  const composedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <View style={{ flex: 1, backgroundColor: "black", position: "relative" }}>
      {/* GestureDetector ab sirf video ke liye */}
      <GestureDetector style={{ flex: 1 }} gesture={composedGesture}>
        <View style={{ flex: 1 }}>
          <PostMedia
            isViewable={isViewable}
            variant="reel"
            media={{ type: post.mediaType, url: post.mediaUrl }}
            setPlayer={(player) => {
              playerRef.current = player;
              setPlayerInstance(player);
            }}
          />

          {/* Smile Animation */}
          <Animated.Image
            source={SmileImage}
            style={[
              styles.animatedIcon,
              {
                width: 80,
                height: 80,
                transform: [
                  { translateX: -40 },
                  { translateY: -40 },
                  { scale: smileScale },
                ],
                opacity: smileOpacity,
              },
            ]}
            resizeMode="contain"
          />

          {/* Repeat Animation */}
          <Animated.Image
            source={repeatImage}
            style={[
              styles.animatedIcon,
              {
                width: 70,
                height: 70,
                transform: [
                  { translateX: -35 },
                  { translateY: -35 },
                  { scale: repeatScale },
                ],
                opacity: repeatOpacity,
              },
            ]}
            resizeMode="contain"
          />

          {/* Play/Pause Animation */}
          <Animated.View
            style={[
              styles.animatedIcon,
              {
                width: 70,
                height: 70,
                transform: [
                  { translateX: -35 },
                  { translateY: -35 },
                  { scale: playPauseScale },
                ],
                opacity: playPauseOpacity,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: 35,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={{
                width: 42,
                height: 42,
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: isPlaying ? 0 : 4, // ✅ Nudge play icon for perfect centering
              }}
            >
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={38}
                color="white"
              />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Ye GestureDetector ke bahar hai, to taps normal chalenge */}
      <PostActions
        post={post}
        liked={interactions.liked}
        repeated={interactions.repeated}
        setLiked={(val) =>
          setInteractions((prev) => {
            if (val && !prev.liked) animateIcon(smileScale, smileOpacity);
            return { ...prev, liked: val };
          })
        }
        setRepeated={(val) =>
          setInteractions((prev) => {
            if (val && !prev.repeated) animateIcon(repeatScale, repeatOpacity);
            return { ...prev, repeated: val };
          })
        }
        onCommentPress={handleCommentNavigation}
        variant="reel"
      />

      <BlurView
        intensity={15}
        tint="dark"
        className={`absolute bottom-0 left-0 right-0 ${
          insets.bottom > 0 ? "pt-2 pb-4" : "pt-2 pb-0"
        } w-full overflow-hidden`}
      >
        <View className="flex-col gap-y-2 px-5 mb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-3">
              <Avatar
                uri={post.user?.avatar}
                className="size-12 border-2 border-white/90 rounded-full"
              />
              <Text className="text-white font-bold text-lg">
                {post.user?.username || post.user?.name}
              </Text>
            </View>
            <Button
              onPress={handleFollowToggle}
              variant={isFollowing ? "secondary" : "primary"}
              className="!py-2"
              textClass="!text-base"
              title={isFollowing ? "Following" : "Follow"}
            />
          </View>
          {post.caption && (
            <Text className="text-white/90 text-sm font-medium leading-relaxed line-clamp-3 max-w-md">
              {post.caption}
            </Text>
          )}
        </View>
        <ProgressBar
          player={playerInstance}
          bottomOffset={insets.bottom > 0 ? 8 : 0}
        />
      </BlurView>
    </View>
  );
};

export default memo(ReelCard);

const styles = StyleSheet.create({
  animatedIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
