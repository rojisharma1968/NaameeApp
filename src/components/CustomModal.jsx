// Updated CustomModal.js to support dynamic textClass and optimized for performance
import { Text, View, Modal, Pressable, Animated, Keyboard, useWindowDimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useRef, useMemo, memo, useCallback } from "react";
import Button from "./Button";
import Input from "./Input";

const CustomModal = memo(
  ({
    visible,
    onClose,
    type = "alert", // "alert" | "post" | "input" | "password"
    options = [], // 👈 custom options array
    onEdit,
    onDelete,
    onShare,
    onConfirm, // 👈 generic confirm instead of only logout
    inputValue,
    onChangeInput,
    placeholder,
    onSubmit,
    title,
    alertbtntext1 = "Cancel",
    alertbtntext2 = "Confirm",
    newPassword,
    onChangeNewPassword,
    confirmNewPassword,
    onChangeConfirmNewPassword,
  }) => {
    const slideAnim = useRef(new Animated.Value(300)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    const useSlide = type === "post";
    const useBounce = type === "input" || type === "password";

    const defaultTitle = useMemo(
      () =>
        type === "alert"
          ? "Are you sure?"
          : type === "input"
            ? "Enter value"
            : type === "password"
              ? "Change Password"
              : "",
      [type]
    );

    const defaultPostOptions = useMemo(
      () => [
        {
          title: "Report",
          variant: "textDanger",
          handle: () => console.log("Report"),
        },
        { title: "Edit", handle: onEdit },
        { title: "Delete", variant: "textDanger", handle: onDelete },
        { title: "Share", handle: onShare },
        { title: "Cancel", variant: "textMuted", handle: onClose },
      ],
      [onEdit, onDelete, onShare, onClose]
    );

    useEffect(() => {
      if (visible) {
        if (useSlide) {
          slideAnim.stopAnimation();
          slideAnim.setValue(300);
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();
        } else if (useBounce) {
          scaleAnim.stopAnimation();
          scaleAnim.setValue(0.9);
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      }
    }, [visible, useSlide, useBounce, slideAnim, scaleAnim]);

    const handleClose = useCallback(() => {
      Keyboard.dismiss(); // Dismiss keyboard immediately on overlay click or close
      if (useSlide) {
        slideAnim.stopAnimation();
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onClose());
      } else if (useBounce) {
        scaleAnim.stopAnimation();
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        onClose();
      }
    }, [useSlide, useBounce, onClose, slideAnim, scaleAnim]);

    const { height } = useWindowDimensions(); // Use dimensions for better responsiveness if needed

    return (
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={handleClose}
      >
        {/* Backdrop */}
        <Pressable
          onPress={handleClose}
          className={`flex-1 bg-black/40 ${type === "post" ? "px-0" : "px-5"}`}
          style={{ justifyContent: type === "post" ? "flex-end" : "center" }}
        >
          {/* Keyboard handling wrapper */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : "height"}
            keyboardVerticalOffset={0}
          >
            {/* Modal content wrapper (prevent closing when touched) */}
            <View onStartShouldSetResponder={() => true}>
              <Animated.View
                style={{
                  transform: [
                    { translateY: useSlide ? slideAnim : 0 },
                    { scale: useBounce ? scaleAnim : 1 },
                  ],
                  maxHeight: height * 0.9, // Prevent overflow on small screens
                }}
                className={`bg-white rounded-xl p-4 ${type === "alert" ? "py-6" : ""}`}
              >
                {type === "post" ? (
                  <>
                    {(options.length > 0 ? options : defaultPostOptions).map(
                      (btn) => (
                        <Button
                          key={btn.title}
                          title={btn.title}
                          variant={btn.variant || "text"}
                          className="!py-4"
                          textClass={`text-lg font-medium ${btn.textClass || ''}`}
                          onPress={() => btn.handle?.()}
                        />
                      )
                    )}
                  </>
                ) : type === "input" ? (
                  <>
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                      {title || defaultTitle}
                    </Text>
                    <Input
                      value={inputValue}
                      onChangeText={onChangeInput}
                      placeholder={placeholder}
                      wrapClass="bg-gray-100 rounded-xl px-4 py-3 mb-4"
                      autoFocus
                    />
                    <View className="flex-row justify-end gap-3">
                      <Button
                        title="Cancel"
                        onPress={handleClose}
                        variant="secondary"
                        className="!px-6 !py-2"
                        textClass="text-lg"
                      />
                      <Button
                        title="Save"
                        onPress={() => {
                          onSubmit();
                          handleClose();
                        }}
                        variant="primary"
                        className="!px-6 !py-2"
                        textClass="text-lg"
                      />
                    </View>
                  </>
                ) : type === "password" ? (
                  <>
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                      {title || defaultTitle}
                    </Text>
                    <Input
                      label="New Password"
                      value={newPassword}
                      onChangeText={onChangeNewPassword}
                      placeholder="Enter new password"
                      secureTextEntry={true}
                      wrapClass="bg-gray-100 rounded-xl px-4 py-3 mb-4"
                    />
                    <Input
                      label="Confirm Password"
                      value={confirmNewPassword}
                      onChangeText={onChangeConfirmNewPassword}
                      placeholder="Confirm new password"
                      secureTextEntry={true}
                      wrapClass="bg-gray-100 rounded-xl px-4 py-3 mb-4"
                    />
                    <View className="flex-row justify-end gap-3">
                      <Button
                        title="Change Password"
                        onPress={() => {
                          onSubmit();
                          handleClose();
                        }}
                        variant="primary"
                        className="!px-6 !py-2"
                        textClass="text-lg"
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text className="text-center text-xl font-medium text-zinc-800 mb-5">
                      {title || defaultTitle}
                    </Text>
                    <View className="flex-row justify-evenly mt-2">
                      <Button
                        title={alertbtntext1}
                        onPress={handleClose}
                        variant="secondary"
                        className="!px-6 !py-2"
                        textClass="text-lg"
                      />
                      <Button
                        title={alertbtntext2}
                        onPress={() => {
                          onConfirm();
                          handleClose();
                        }}
                        variant="danger"
                        className="!px-6 !py-2"
                        textClass="text-lg"
                      />
                    </View>
                  </>
                )}
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    );
  }
);

export default CustomModal;