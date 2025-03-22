import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import React from "react";

interface AppButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle; // เพิ่ม style เป็น optional property
}

export default function AppButton({
  children = "Create Todo",
  onPress = () => {},
  style, // เพิ่ม style ใน props
}: AppButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.createTodoButton, style]} // รวม style จาก props กับ style เดิม
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createTodoButton: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 20,
    margin: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});