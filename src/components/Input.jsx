import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TextHighlighterInput from "./TextHighlighterInput";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  inputStyle,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  className = "h-full w-full",
  wrapClass = "mb-3",
  icon,
  disabled = false,
  onSend,
  onClear,
  isCommentInput = false,
  highlightMentions = false,
  multiline = false,
  minMLHeight,
  height,
  isSearchInput = false,
  maxLength,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isInteractiveInput = highlightMentions || isCommentInput;
  const isPassword = secureTextEntry && !isPasswordVisible;

  const inputContainerStyles = {
    minHeight: multiline ? 0 : 50,
    paddingHorizontal: 12,
    paddingVertical: multiline ? 4 : 0,
  };

  const textInputStyles = {
    flex: 1,
    fontSize: 16,
    color: disabled ? "#888" : "#000",
    paddingVertical: multiline ? 12 : 0,
    paddingTop:
      Platform.OS === "android" && !multiline ? 1 : multiline ? 12 : 0,
    ...inputStyle,
  };

  return (
    <View className="w-full mb-0">
      {/* Label */}
      {label && (
        <Text className="text-base font-medium text-gray-800 mb-2">
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={`
          flex-row items-center border rounded-xl bg-white
          ${disabled ? "border-gray-200 bg-gray-100" : "border-gray-300"}
          ${wrapClass}
          ${height || ""}
        `}
        style={inputContainerStyles}
      >
        {/* Icon */}
        {icon && !isInteractiveInput && (
          <Feather
            name={icon}
            size={22}
            color={disabled ? "#aaa" : "#666"}
            style={{ marginRight: 6 }}
          />
        )}

        {/* Input */}
        {isInteractiveInput ? (
          <TextHighlighterInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            multiline={multiline}
            disabled={disabled}
            minMLHeight={minMLHeight}
            inputStyle={inputStyle}
            maxLength={maxLength}
          />
        ) : (
          <TextInput
            autoCorrect={autoCorrect}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={isPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={!disabled}
            placeholderTextColor="#999"
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            style={textInputStyles}
            className={className}
          />
        )}

        {/* Password Toggle Icon */}
        {secureTextEntry && !isInteractiveInput && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ marginLeft: 6 }}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        )}

        {/* Clear Icon */}
        {(isSearchInput && value?.length > 0) && (
          <TouchableOpacity onPress={onClear} style={{ marginLeft: 6 }}>
            <Feather name="x" size={24} color="#999" />
          </TouchableOpacity>
        )}

        {/* Comment Send */}
        {isCommentInput && (
          <TouchableOpacity
            onPress={onSend}
            disabled={disabled || !value?.trim()}
            style={{ marginLeft: 8 }}
          >
            <Feather
              name="send"
              size={24}
              color={disabled || !value?.trim() ? "#aaa" : "#5ba1d6"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(Input);