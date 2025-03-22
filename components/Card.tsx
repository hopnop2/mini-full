// Card.tsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TodoContext, { Todo } from "@/context/Todo.context";
import { useContext } from "react";

interface CardProps {
  todo: Todo;
  isSelected: boolean; // สถานะว่าโน้ตนี้ถูกเลือกหรือไม่
  onSelect: (id: number) => void; // ฟังก์ชันสำหรับเลือก/ยกเลิกเลือก
}

export default function Card({ todo, isSelected, onSelect }: CardProps) {
  const { removeTodo } = useContext(TodoContext);

  const handleRemoveTodo = (id: number) => {
    Alert.alert("ลบโน้ต", "คุณแน่ใจหรือไม่ว่าต้องการลบโน้ตนี้?", [
      {
        text: "ยกเลิก",
        style: "cancel",
      },
      {
        text: "ลบ",
        style: "destructive",
        onPress: () => {
          removeTodo?.(id);
          Alert.alert("สำเร็จ", "ลบโน้ตเรียบร้อยแล้ว");
        },
      },
    ]);
  };

  return (
    <View style={styles.noteCard}>
      {/* Checkbox สำหรับเลือก */}
      <TouchableOpacity onPress={() => onSelect(todo.id)}>
        <Ionicons
          name={isSelected ? "checkbox-outline" : "square-outline"}
          size={24}
          color="#333333"
          style={styles.selectIcon}
        />
      </TouchableOpacity>

      {/* ข้อความโน้ต */}
      <View style={styles.textContainer}>
        <Text style={styles.noteTitle}>{todo.text}</Text>
        <Text style={styles.noteTimestamp}>
          {new Date(todo.timestamp!).toLocaleString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* ไอคอนลบ */}
      <TouchableOpacity onPress={() => handleRemoveTodo(todo.id)}>
        <Ionicons
          name="trash-outline"
          size={20}
          color="#666666"
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    fontFamily: "monospace",
  },
  noteTimestamp: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
    fontStyle: "italic",
  },
  deleteIcon: {
    marginLeft: 10,
  },
  selectIcon: {
    marginRight: 10,
  },
});