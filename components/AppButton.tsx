import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AppButtonProps {
  onPress: () => void;
  children: string;
}

export default function AppButton({
  children = "Create Todo",
  onPress = () => {},
}: AppButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={style.createTodoButton}
      onPress={onPress}
    >
      <Text style={style.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  // button
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
