import React, { useState, useRef } from "react";
import { View, TextInput, Text, Dimensions } from "react-native";

const OTPInput = ({ length = 6, onChange = () => {} }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const screenWidth = Dimensions.get("window").width;
  const spacing = 8 * length;
  const inputWidth = (screenWidth - spacing - 52) / length; 

  const handleChange = (text, index) => {
    if (text.length > 1) {
      handlePaste(text);
      return;
    }

    if (text && !/^[0-9]$/.test(text)) return;

    if (index > 0 && otp[index - 1] === "") return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }
  };

  const handlePaste = (pastedText) => {
    const cleanedText = pastedText.replace(/\D/g, "").slice(0, length);
    if (cleanedText.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < length && i < cleanedText.length; i++) {
        newOtp[i] = cleanedText[i];
      }
      setOtp(newOtp);
      onChange(newOtp.join(""));

      const lastFilledIndex = Math.min(cleanedText.length - 1, length - 1);
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const handleFocus = (index) => {
    if (index > 0 && otp[index - 1] === "") {
      inputRefs.current[0].focus();
    }
  };

  return (
    <View style={{ marginTop: 8, width: "100%" }}>
      <Text
       className='mb-3 text-lg font-semibold text-white'
      >
        Enter OTP
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        {Array(length)
          .fill()
          .map((_, index) => (
            <React.Fragment key={index}>
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={{
                  backgroundColor:'white',
                  width: inputWidth,
                  height: 50,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginHorizontal: 4,
                  textAlign: "center",
                  fontSize: 20,
                  textAlignVertical: "center",
                  paddingVertical: 0,
                  includeFontPadding: false,
                }}
                value={otp[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                keyboardType="numeric"
                maxLength={index === 0 ? length : 1}
                autoFocus={index === 0}
                textContentType="oneTimeCode"
                pointerEvents={index === 0 || otp[index - 1] !== "" ? "auto" : "none"}
              />
              {index === 2 && (
                <Text
                  style={{
                    color:'white',
                    fontSize: 20,
                    marginHorizontal: 4,
                    alignSelf: "center",
                  }}
                >
                  -
                </Text>
              )}
            </React.Fragment>
          ))}
      </View>
    </View>
  );
};

export default OTPInput;