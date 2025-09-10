import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import OTPInput from "../../components/OtpInput";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ForgotPassScreen = ({ navigation }) => {
  const [isAvailabel, setAvailable] = useState(false);
  useEffect(() => {
    const showSub = Keyboard.addListener(
      "keyboardWillShow",
      handleKeyboardAnim
    );
    const hideSub = Keyboard.addListener(
      "keyboardWillHide",
      handleKeyboardAnim
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleKeyboardAnim = (e) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary relative">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View className="flex-1 justify-center px-5">
              <Text className="text-3xl font-semibold text-center mb-2 text-white">
                Forgot Password
              </Text>
              <Text className="text-lg text-center text-white mb-8 leading-[1.2] w-[80%] mx-auto">
                Enter your registered email to receive an OTP and reset your
                password.
              </Text>

              {/* Inputs */}
              <Input
                disabled={isAvailabel}
                icon="mail"
                placeholder="Enter Your Email"
              />
              {isAvailabel && <OTPInput length={6} />}
              {isAvailabel ? (
                <Button
                  variant="white"
                  onPress={() => navigation.navigate("NewPassword")}
                  title="Submit OTP"
                  className="mb-8 mt-5"
                />
              ) : (
                <Button
                  variant="white"
                  onPress={() => setAvailable((prev) => !prev)}
                  title="Get OTP"
                  className="mb-8"
                />
              )}

              <Text className="text-lg text-center text-white">
                Don't have an Account?{" "}
                <Text
                  onPress={() => navigation.navigate("Register")}
                  className="underline"
                >
                  Signup
                </Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassScreen;
