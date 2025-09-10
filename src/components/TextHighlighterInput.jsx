import React, { useMemo, useRef, useState, useCallback, memo } from "react";
import { TextInput, Text, View, StyleSheet } from "react-native";

const TextHighlighterInput = ({
  value,
  onChangeText,
  placeholder = "Write a comment...",
  multiline = true,
  disabled = false,
  inputStyle = {},
  minMLHeight = 60,
  maxLength,
}) => {
  const inputRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const baseTextStyle = useMemo(() => ({
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
  }), []);

  const handleChangeText = useCallback((text) => {
    const oldText = value || '';
    const newText = text;
    let cursorPos = selection.start;

    if (newText.length > oldText.length) {
      cursorPos += newText.length - oldText.length;
    } else {
      cursorPos -= oldText.length - newText.length;
      cursorPos = Math.max(0, cursorPos);
    }

    onChangeText(text);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          selection: { start: cursorPos, end: cursorPos }
        });
      }
    });
  }, [value, selection.start, onChangeText]);

  const highlightedText = useMemo(() => {
    if (!value) {
      return (
        <Text style={[baseTextStyle, { color: "#999" }]}>
          {placeholder}
        </Text>
      );
    }

    const parts = value.split(/(\s+)/);
    return parts.map((part, index) => {
      const isTag = part.startsWith("@") || part.startsWith("#");
      return (
        <Text key={index} style={[baseTextStyle, { color: isTag ? "#5ba1d6" : "black" }]}>
          {part}
        </Text>
      );
    });
  }, [value, placeholder, baseTextStyle]);

  return (
    <View style={[styles.container, { minHeight: minMLHeight }]}>
      <View style={styles.overlay} pointerEvents="none">
        <Text style={[styles.wrapText, baseTextStyle]}>
          {highlightedText}
        </Text>
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        onSelectionChange={({ nativeEvent }) => setSelection(nativeEvent.selection)}
        multiline={multiline}
        editable={!disabled}
        placeholder=""
        maxLength={maxLength}
        autoCorrect={false}
        autoCapitalize="none"
        style={[
          styles.input,
          baseTextStyle,
          {
            color: "transparent",
            includeFontPadding: false,
            padding: 10,
          },
          inputStyle,
        ]}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  input: {
    padding: 10,
  },
  wrapText: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
    flexShrink: 1,
  },
});

// Memo wrap for perf
export default memo(TextHighlighterInput);
