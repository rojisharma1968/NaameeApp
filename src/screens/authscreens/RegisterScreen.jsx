import React, { useEffect } from "react";
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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RegisterScreen = ({ navigation }) => {
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
        <View className="flex-1 justify-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View className="px-5">
              <Text className="text-3xl font-semibold text-center mb-2 text-white">
                Create Account
              </Text>
              <Text className="text-lg text-center text-white mb-8 w-[80%] leading-[1.2] mx-auto">
                Fill your information below or register with your social account
              </Text>

              {/* Inputs */}
              <Input icon="at-sign" placeholder="Enter Username" />
              <Input icon="user" placeholder="Enter Name" />
              <Input icon="mail" placeholder="Enter Your Email" />
              <Input
                icon="lock"
                placeholder="Enter Your Password"
                secureTextEntry={true}
              />

              <Button variant="white" title="Sign in" className="mb-8" />
            </View>
          </KeyboardAvoidingView>
          <View>
            <Text className="mt-3 text-lg text-center text-white">
              Already have an Account?{" "}
              <Text
                onPress={() => navigation.navigate("login")}
                className="underline"
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default RegisterScreen;
