import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ProgressBar = ({ player, bottomOffset = 0 }) => {
  const progress = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastSeekTimeRef = useRef(0);
  const seekDebounceRef = useRef(null);
  const MIN_SEEK_INTERVAL = 150; // Debounce interval for smooth seeking
  const thumbSize = 14;
  const initialBarHeight = 4;
  const activeBarHeight = 8;
  const containerHeight = 40; // Increased to make touch area distinct from system gesture bar
  const timestampWidth = 80; // Increased width for longer text

  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateTime = (prog) => {
    if (player?.duration > 0) {
      const time = prog * player.duration;
      setCurrentTime(formatTime(time));
    }
  };

  useEffect(() => {
    if (player?.duration > 0) {
      setTotalTime(formatTime(player.duration));
    }
  }, [player?.duration]);

  useEffect(() => {
    let frame;
    const update = () => {
      if (
        player?.duration > 0 &&
        player?.currentTime >= 0 &&
        !isDragging.value
      ) {
        progress.value = withTiming(player.currentTime / player.duration, {
          duration: 50, // Smooth progress updates
        });
      }
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [player]);

  const handleSeek = (p) => {
    if (player?.duration > 0) {
      const seekTime = Math.max(0, Math.min(p * player.duration, player.duration));
      try {
        player.currentTime = seekTime;
      } catch (error) {
        console.warn("Seek failed:", error);
      }
    }
  };

  const debounceSeek = (p) => {
    if (seekDebounceRef.current) {
      clearTimeout(seekDebounceRef.current);
    }
    seekDebounceRef.current = setTimeout(() => {
      handleSeek(p);
    }, MIN_SEEK_INTERVAL);
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-15, 15]) // Require 15px horizontal movement to activate
    .activeOffsetY([-2, 2]) // Restrict vertical movement to avoid system gesture conflicts
    .hitSlop({ top: 20, bottom: 20, left: 10, right: 10 }) // Larger vertical hitSlop for better touchability
    .shouldCancelWhenOutside(true) // Cancel if touch moves outside ProgressBar
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const clamped = Math.min(Math.max(0, e.x), width);
      const newProgress = clamped / width;
      progress.value = newProgress;

      runOnJS(updateTime)(newProgress);

      const now = Date.now();
      if (now - lastSeekTimeRef.current > MIN_SEEK_INTERVAL) {
        lastSeekTimeRef.current = now;
        runOnJS(debounceSeek)(newProgress);
      }
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(handleSeek)(progress.value); // Final seek on drag end
    })
    .simultaneousWithExternalGesture(); // Allow simultaneous gestures with restrictions

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: width * Math.min(Math.max(progress.value, 0), 1),
  }));

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          width * Math.min(Math.max(progress.value, 0), 1) - thumbSize / 2,
      },
    ],
    opacity: withTiming(isDragging.value ? 1 : 0, { duration: 100 }),
  }));

  const animatedBarStyle = useAnimatedStyle(() => ({
    height: withTiming(isDragging.value ? activeBarHeight : initialBarHeight, {
      duration: 100,
    }),
    top:
      (containerHeight - (isDragging.value ? activeBarHeight : initialBarHeight)) /
      2,
  }));

  const animatedTimestampStyle = useAnimatedStyle(() => {
    const clampedProgress = Math.min(Math.max(progress.value, 0), 1);
    const translateX = width * clampedProgress - timestampWidth / 2;

    // Ensure timestamp stays within bounds
    const minTranslateX = 0;
    const maxTranslateX = width - timestampWidth;
    const finalTranslateX = Math.min(Math.max(translateX, minTranslateX), maxTranslateX);

    return {
      opacity: withTiming(isDragging.value ? 1 : 0, { duration: 100 }),
      transform: [{ translateX: finalTranslateX }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, { bottom: bottomOffset }]}>
        <Animated.View style={[styles.barBackground, animatedBarStyle]} />
        <Animated.View
          style={[styles.barFill, animatedBarStyle, animatedProgressStyle]}
        />
        <Animated.View style={[styles.thumb, animatedThumbStyle]} />
        <Animated.View style={[styles.timestamp, animatedTimestampStyle]}>
          <Text style={styles.timestampText}>{`${currentTime} / ${totalTime}`}</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40, // Match increased containerHeight
    justifyContent: "center",
    position: "relative",
    marginVertical: 0, // No vertical margin
  },
  barBackground: {
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  barFill: {
    backgroundColor: "#fff",
    position: "absolute",
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    backgroundColor: "#fff",
    borderRadius: 7,
    top: (40 - 14) / 2,
  },
  timestamp: {
    position: "absolute",
    top: -30,
    height: 24,
    width: 80,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timestampText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default ProgressBar;