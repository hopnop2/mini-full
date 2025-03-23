import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import React from "react";

interface AppButtonProps {
  onPress?: () => void; // Optional
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function AppButton({
  children = "Create Todo",
  onPress = () => {},
  style,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.createTodoButton, style]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createTodoButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 20,
    margin: 10,
    borderRadius: 30,
    alignItems: "center",
  },
});