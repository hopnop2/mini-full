import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import TodoContext, { Todo } from "@/context/Todo.context";
import { Checkbox } from "react-native-paper";
import { useContext } from "react";

interface CardProps {
  todo: Todo;
}

export default function Card({ todo }: CardProps) {
  const { removeTodo, toggleTodo } = useContext(TodoContext);

  const handleRemoveTodo = (id: number) => {
    Alert.alert("ลบรายการ", "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?", [
      {
        text: "ยกเลิก",
        style: "cancel",
      },
      {
        text: "ลบ",
        style: "destructive",
        onPress: () => removeTodo?.(id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={() => handleRemoveTodo(todo.id)}
      activeOpacity={0.7}
      style={styles.todoCard}
    >
      <Checkbox.Item
        label=""
        status={todo.done ? "checked" : "unchecked"}
        onPress={() => toggleTodo?.(todo.id)}
        color="#000000" // Checkbox สีดำ
        uncheckedColor="#666666" // Checkbox ที่ยังไม่เลือกเป็นสีเทาเข้ม
      />
      <View style={styles.textContainer}>
        <Text style={styles.todoTitle}>{todo.text}</Text>
        <Text style={styles.todoTimestamp}>
          {new Date(todo.timestamp!).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#FFFFFF", // การ์ดสีขาว
    borderWidth: 1,
    borderColor: "#000000", // ขอบสีดำ
    borderRadius: 10,
    elevation: 3, // เงาสำหรับ Android
    shadowColor: "#000000", // เงาสีดำสำหรับ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000", // ข้อความสีดำ
  },
  todoTimestamp: {
    fontSize: 14,
    color: "#666666", // Timestamp สีเทาเข้ม
    marginTop: 2,
  },
});