import React, { useRef, useState, useCallback, memo } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostFooter from "./PostFooter";
import PostMedia from "./PostMedia";
import SmileImage from "../../../assets/images/smile.png";
import repeatImage from "../../../assets/images/repeat.png";
import CustomModal from "../CustomModal";

const PostCard = ({ post, isViewable }) => {
  const navigation = useNavigation();

  const [interactions, setInteractions] = useState({
    liked: false,
    repeated: false,
  });

  const [optionsVisible, setOptionsVisible] = useState(false);

  // Animations
  const smileScale = useRef(new Animated.Value(0)).current;
  const smileOpacity = useRef(new Animated.Value(0)).current;
  const repeatScale = useRef(new Animated.Value(0)).current;
  const repeatOpacity = useRef(new Animated.Value(0)).current;

  const animateIcon = useCallback((scaleRef, opacityRef) => {
    scaleRef.setValue(0);
    opacityRef.setValue(1);
    Animated.parallel([
      Animated.timing(scaleRef, {
        toValue: 1.2,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityRef, {
        toValue: 0,
        duration: 700,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSingleTap = useCallback(() => {
    Keyboard.dismiss();
    if (post.mediaType === "video") {
      navigation.navigate("Reels", { initialPostId: post.id });
    }
  }, [navigation, post]);

  const handleDoubleTap = useCallback(() => {
    setInteractions((prev) => {
      if (!prev.liked) {
        animateIcon(smileScale, smileOpacity);
        return { ...prev, liked: true };
      }
      animateIcon(smileScale, smileOpacity); // Always animate on double tap
      return prev;
    });
  }, [animateIcon, smileOpacity, smileScale]);

  const handleCommentNavigation = useCallback(() => {
    navigation.navigate("Comments");
  }, [navigation]);

  const handleLikeChange = useCallback(
    (val) => {
      setInteractions((prev) => {
        if (val && !prev.liked) animateIcon(smileScale, smileOpacity);
        return { ...prev, liked: val };
      });
    },
    [animateIcon, smileScale, smileOpacity]
  );

  const handleRepeatChange = useCallback(
    (val) => {
      setInteractions((prev) => {
        if (val && !prev.repeated) animateIcon(repeatScale, repeatOpacity);
        return { ...prev, repeated: val };
      });
    },
    [animateIcon, repeatScale, repeatOpacity]
  );

  // Gesture handling
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
    <View style={styles.cardContainer}>
      <PostHeader post={post} onOptionsPress={() => setOptionsVisible(true)} />

      <GestureDetector gesture={composedGesture}>
        <View style={styles.mediaWrapper}>
          <PostMedia
            isViewable={isViewable}
            media={{ type: post.mediaType, url: post.mediaUrl, views:post.views }}
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
        </View>
      </GestureDetector>

      <PostFooter post={post} />

      <PostActions
        post={post}
        liked={interactions.liked}
        repeated={interactions.repeated}
        setLiked={handleLikeChange}
        setRepeated={handleRepeatChange}
        onCommentPress={handleCommentNavigation}
      />

      <CustomModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        type="post"
        onEdit={() => console.log("Edit")}
        onDelete={() => console.log("Delete")}
        onShare={() => console.log("Share")}
      />
    </View>
  );
};

export default memo(PostCard);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 8,
  },
  mediaWrapper: {
    position: "relative",
  },
  animatedIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
  },
});