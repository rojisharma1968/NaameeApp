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

const NewPassScreen = ({ navigation }) => {
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
        <View className="flex-1 justify-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View className="px-5">
              <Text className="text-3xl font-semibold text-white text-center mb-8">
                Create New Password
              </Text>

              <Input icon="key" placeholder="Enter Current Password" />
              <Input
                icon="lock"
                placeholder="Enter Your Password"
                secureTextEntry
              />
              <Input
                icon="lock"
                placeholder="Confirm Password"
                secureTextEntry
              />
              <Button variant="white" title="Submit" onPress={()=>navigation.navigate('login')} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default NewPassScreen;
