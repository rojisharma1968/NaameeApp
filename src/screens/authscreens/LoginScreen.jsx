import { useEffect } from "react";
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
  Image
} from "react-native";

import SocialButton from "../../components/SocialButton";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useUser } from "../../context/userContext";


if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoginScreen = ({ navigation }) => {
  const { login } = useUser();
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
    <SafeAreaView className="flex-1 relative bg-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center px-5">
          <Image
            source={require("../../../assets/icon.png")}
            style={{
              width: 80,
              height: 80,
              marginInline: "auto",
              marginBottom: 10,
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View className="w-full">
              <Input icon="mail" placeholder="Enter Your Email" />
              <Input
                icon="lock"
                placeholder="Enter Your Password"
                secureTextEntry
              />
            </View>
          </KeyboardAvoidingView>
          <Text
            onPress={() => navigation.navigate("ForgotPassword")}
            className="text-right text-base mb-3 underline text-white"
          >
            Forgot Password?
          </Text>

          <Button
            onPress={login}
            variant="white"
            title="Sign in"
            className="mb-8"
          />

          <View className="items-center">
            <Text className="text-lg text-white">- Or sign in with -</Text>
            <View className="flex-row mt-3 space-x-3">
              <SocialButton
                iconSource={require("../../../assets/images/google-icon.png")}
              />
              <SocialButton
                iconSource={require("../../../assets/images/apple-icon.png")}
              />
              <SocialButton
                iconSource={require("../../../assets/images/facebook-icon.png")}
              />
            </View>
          </View>

          <Text className="mt-8 text-lg text-center text-white">
            Don't have an Account?{" "}
            <Text
              onPress={() => navigation.navigate("Register")}
              className="underline"
            >
              Signup
            </Text>
          </Text>
          <View className="absolute bottom-5 inset-x-0 px-5">
            <Text className="text-center text-base text-white">
              By signing in, you agree to our Terms & Privacy.
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;
