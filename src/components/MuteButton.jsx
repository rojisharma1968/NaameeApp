import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { BlurView } from "expo-blur";

const MuteButton = ({ variant = "default", toggleMute, isMuted }) => {
  const muteTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(250)
    .onEnd((_, success) => {
      if (success) runOnJS(toggleMute)();
    });

  return (
    <GestureDetector gesture={muteTapGesture}>
      {variant === "reel" ? (
        <Pressable className="right-4 bottom-44 absolute z-20 bg-black/60 p-2 rounded-full">
          <Feather
            name={isMuted ? "volume-x" : "volume-2"}
            size={30}
            color="#fff"
          />
        </Pressable>
      ) : (
        <Pressable className="bottom-2 right-5 absolute z-20">
          <BlurView
            intensity={10}
            className="flex-row items-center overflow-hidden p-2 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderWidth: 1,
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
            <Feather
              name={isMuted ? "volume-x" : "volume-2"}
              size={24}
              color="#fff"
            />
          </BlurView>
        </Pressable>
      )}
    </GestureDetector>
  );
};

export default MuteButton;
