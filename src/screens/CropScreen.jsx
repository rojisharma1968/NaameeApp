import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import Button from "../components/Button";

const WINDOW = Dimensions.get("window");

const CropScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const imageUri = route.params?.imageUri;
  const cropDimensions = route.params?.cropDimensions;
  const type = route.params?.type;

  // step control: "crop" | "preview"
  const [step, setStep] = useState("crop");

  // original image size
  const [origWidth, setOrigWidth] = useState(null);
  const [origHeight, setOrigHeight] = useState(null);

  // cropped dimensions
  const [croppedWidth, setCroppedWidth] = useState(null);
  const [croppedHeight, setCroppedHeight] = useState(null);

  // use full screen for layout
  const layoutW = WINDOW.width;
  const layoutH = WINDOW.height;

  // cropped result
  const [croppedUri, setCroppedUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // crop box shared values
  const boxX = useSharedValue(layoutW / 4);
  const boxY = useSharedValue(layoutH / 3);
  const boxW = useSharedValue(layoutW / 2);
  const boxH = useSharedValue(layoutH / 3);

  // image zoom and pan
  const zoom = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startZoom = useSharedValue(1);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  // shared for worklets
  const origWidthSV = useSharedValue(0);
  const origHeightSV = useSharedValue(0);
  const initialZoomSV = useSharedValue(1);

  useEffect(() => {
    Image.getSize(
      imageUri,
      (w, h) => {
        if (w > 0 && h > 0) {
          setOrigWidth(w);
          setOrigHeight(h);
          const initZoom = Math.min(layoutW / w, layoutH / h);
          zoom.value = initZoom;
          origWidthSV.value = w;
          origHeightSV.value = h;
          initialZoomSV.value = initZoom;

          // Set initial crop box based on dimensions if provided
          if (cropDimensions) {
            const initBoxW = Math.min(layoutW, cropDimensions.width);
            const initBoxH = Math.min(layoutH, cropDimensions.height);
            boxW.value = initBoxW;
            boxH.value = initBoxH;
            boxX.value = Math.max(0, (layoutW - initBoxW) / 2);
            boxY.value = Math.max(0, (layoutH - initBoxH) / 2);
          }
        }
      },
      (error) => {
        console.error("Image size error:", error);
      }
    );
  }, [imageUri, cropDimensions]);

  // helper to clamp after updates
  const clampBox = () => {
    "worklet";
    boxX.value = Math.max(0, Math.min(layoutW - boxW.value, boxX.value));
    boxY.value = Math.max(0, Math.min(layoutH - boxH.value, boxY.value));
    boxW.value = Math.max(40, Math.min(layoutW - boxX.value, boxW.value));
    boxH.value = Math.max(40, Math.min(layoutH - boxY.value, boxH.value));
  };

  // drag gesture for moving the box
  const dragGesture = Gesture.Pan().onChange((event) => {
    "worklet";
    boxX.value += event.changeX;
    boxY.value += event.changeY;
    clampBox();
  });

  // resize gestures for corners
  const brGesture = Gesture.Pan().onChange((event) => {
    "worklet";
    boxW.value += event.changeX;
    boxH.value += event.changeY;
    clampBox();
  });

  const blGesture = Gesture.Pan().onChange((event) => {
    "worklet";
    boxX.value += event.changeX;
    boxW.value -= event.changeX;
    boxH.value += event.changeY;
    clampBox();
  });

  const trGesture = Gesture.Pan().onChange((event) => {
    "worklet";
    boxW.value += event.changeX;
    boxY.value += event.changeY;
    boxH.value -= event.changeY;
    clampBox();
  });

  const tlGesture = Gesture.Pan().onChange((event) => {
    "worklet";
    boxX.value += event.changeX;
    boxY.value += event.changeY;
    boxW.value -= event.changeX;
    boxH.value -= event.changeY;
    clampBox();
  });

  // image gestures
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      "worklet";
      startZoom.value = zoom.value;
    })
    .onUpdate((event) => {
      "worklet";
      zoom.value = Math.max(initialZoomSV.value, startZoom.value * event.scale);
    })
    .onEnd(() => {
      "worklet";
      // optional: animate back if too small, but for now ok
    });

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .onStart(() => {
      "worklet";
      startTranslateX.value = translateX.value;
      startTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      "worklet";
      const ow = origWidthSV.value;
      const oh = origHeightSV.value;
      const z = zoom.value;
      const dw = ow * z;
      const dh = oh * z;
      const maxTX = Math.max(0, (dw - layoutW) / 2);
      const maxTY = Math.max(0, (dh - layoutH) / 2);
      let newTX = startTranslateX.value + event.translationX;
      let newTY = startTranslateY.value + event.translationY;
      newTX = Math.max(-maxTX, Math.min(maxTX, newTX));
      newTY = Math.max(-maxTY, Math.min(maxTY, newTY));
      translateX.value = newTX;
      translateY.value = newTY;
    });

  const imageGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // image style
  const imageStyle = useAnimatedStyle(() => {
    const ow = origWidthSV.value;
    const oh = origHeightSV.value;
    const z = zoom.value;
    const dw = ow * z;
    const dh = oh * z;
    const left = (layoutW - dw) / 2 + translateX.value;
    const top = (layoutH - dh) / 2 + translateY.value;
    return {
      position: "absolute",
      left,
      top,
      width: dw,
      height: dh,
    };
  });

  // Overlay styles for outside crop area
  const overlayStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  }));

  const cropMaskStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: boxY.value,
    left: boxX.value,
    width: boxW.value,
    height: boxH.value,
    backgroundColor: "transparent",
  }));

  const boxStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: boxX.value,
      top: boxY.value,
      width: boxW.value,
      height: boxH.value,
      borderWidth: 2,
      borderColor: "#fff",
      backgroundColor: "rgba(255,255,255,0.1)",
    };
  });

  // Improved handle styles
  const handleCommonStyle = {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#5ba1d6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const tlStyle = { left: -16, top: -16 };
  const trStyle = { right: -16, top: -16 };
  const blStyle = { left: -16, bottom: -16 };
  const brStyle = { right: -16, bottom: -16 };

  // crop action
  const handleCrop = async () => {
    if (!origWidth || !origHeight || origWidthSV.value === 0) {
      Alert.alert("Wait", "Image not ready yet.");
      return;
    }
    setLoading(true);

    // get current values and clamp for crop
    let currentBoxX = boxX.value;
    let currentBoxY = boxY.value;
    let currentBoxW = boxW.value;
    let currentBoxH = boxH.value;
    currentBoxX = Math.max(0, Math.min(layoutW - currentBoxW, currentBoxX));
    currentBoxY = Math.max(0, Math.min(layoutH - currentBoxH, currentBoxY));
    currentBoxW = Math.max(40, Math.min(layoutW - currentBoxX, currentBoxW));
    currentBoxH = Math.max(40, Math.min(layoutH - currentBoxY, currentBoxH));

    const currentZoom = zoom.value;
    const currentTX = translateX.value;
    const currentTY = translateY.value;
    const ow = origWidth;
    const oh = origHeight;
    const dw = ow * currentZoom;
    const dh = oh * currentZoom;
    const imageLeft = (layoutW - dw) / 2 + currentTX;
    const imageTop = (layoutH - dh) / 2 + currentTY;

    let originX = (currentBoxX - imageLeft) / currentZoom;
    let originY = (currentBoxY - imageTop) / currentZoom;
    let cw = currentBoxW / currentZoom;
    let ch = currentBoxH / currentZoom;

    // clamp to image bounds
    originX = Math.max(0, Math.min(ow - cw, originX));
    originY = Math.max(0, Math.min(oh - ch, originY));
    cw = Math.min(cw, ow - originX);
    ch = Math.min(ch, oh - originY);

    const cropOriginX = Math.round(originX);
    const cropOriginY = Math.round(originY);
    const cropW = Math.round(cw);
    const cropH = Math.round(ch);

    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropOriginX,
              originY: cropOriginY,
              width: cropW,
              height: cropH,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      setCroppedUri(result.uri);
      setCroppedWidth(result.width);
      setCroppedHeight(result.height);
      setStep("preview");
    } catch (err) {
      Alert.alert("Crop failed", String(err));
    } finally {
      setLoading(false);
    }
  };


  const handleDone = async () => {
    if (croppedUri && type) {
      try {
        await AsyncStorage.setItem("croppedUri", croppedUri);
        await AsyncStorage.setItem("type", type);
      } catch (error) {
        console.error("Error saving to AsyncStorage:", error);
      }
      navigation.goBack();
    }
  };

  const handleBack = () => {
    setStep("crop");
    setCroppedUri(null);
    setCroppedWidth(null);
    setCroppedHeight(null);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-zinc-800">
        {step === "crop" ? (
          <>
            {/* Fullscreen Crop Step */}
            <View className="flex-1 relative overflow-hidden">
              <GestureDetector gesture={imageGesture}>
                <Animated.View style={imageStyle}>
                  <Image
                    source={{ uri: imageUri }}
                    className="flex-1"
                    resizeMode="contain"
                  />
                </Animated.View>
              </GestureDetector>

              {/* Overlay Mask */}
              <Animated.View style={overlayStyle} pointerEvents="none">
                <Animated.View style={cropMaskStyle} pointerEvents="none" />
              </Animated.View>

              {/* Crop Box */}
              <GestureDetector gesture={dragGesture}>
                <Animated.View style={boxStyle}>
                  {/* 4 corner handles */}
                  <GestureDetector gesture={tlGesture}>
                    <Animated.View style={[handleCommonStyle, tlStyle]} />
                  </GestureDetector>
                  <GestureDetector gesture={trGesture}>
                    <Animated.View style={[handleCommonStyle, trStyle]} />
                  </GestureDetector>
                  <GestureDetector gesture={blGesture}>
                    <Animated.View style={[handleCommonStyle, blStyle]} />
                  </GestureDetector>
                  <GestureDetector gesture={brGesture}>
                    <Animated.View style={[handleCommonStyle, brStyle]} />
                  </GestureDetector>
                </Animated.View>
              </GestureDetector>
            </View>

            {/* Header */}
            <View
              className="absolute left-5 right-5 items-center z-[1]"
              style={{ top: insets.top + 20 }}
            >
              <Text className="text-white text-[14px] text-center font-medium leading-5">
                Drag crop area, pinch/drag image to adjust, resize corners
              </Text>
            </View>

            {/* Action Buttons */}
            <View
              className="absolute left-5 right-5 flex-row justify-between z-[1]"
              style={{ bottom: insets.bottom + 20 }}
            >
              <Pressable
                className="bg-white p-3 rounded-full"
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left-circle" size={24} color="black" />
              </Pressable>
              <Pressable
                className="bg-primary p-3 rounded-full"
                onPress={handleCrop}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size={24} color="#fff" />
                ) : (
                  <Feather name="check" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </>
        ) : (
          <>
            {/* Preview Step */}
            <View className="flex-1 items-center justify-center">
              {croppedUri && croppedWidth && croppedHeight ? (
                <View className="flex-1 w-full p-[10px]">
                  <Image
                    source={{ uri: croppedUri }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <ActivityIndicator size="large" color="#fff" />
              )}
            </View>

            {/* Bottom Actions */}
            <View
              className="absolute left-5 right-5 flex-row gap-3 z-[1]"
              style={{ bottom: insets.bottom + 20 }}
            >
              <Button
                iconLeft={
                  <Feather name="arrow-left-circle" size={24} color="black" />
                }
                title="Back"
                variant="secondary"
                onPress={handleBack}
                className="!flex-1 py-[12px]"
                textClass="text-lg"
              />
              <Button
                iconRight={
                  <Feather name="check-circle" size={24} color="white" />
                }
                title="Done"
                variant="primary"
                onPress={handleDone}
                className="!flex-1 py-[12px]"
                textClass="text-lg"
              />
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default CropScreen;
