import { Link } from "expo-router";
import { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TodoContext from "@/context/Todo.context";
import Card from "@/components/Card";

export default function Index() {
  const { todos, removeMultipleTodos } = useContext(TodoContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleLogout = () => {
    console.log("Logged out");
    setModalVisible(false);
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = () => {
    Alert.alert("ลบโน้ต", "คุณแน่ใจหรือไม่ว่าต้องการลบโน้ตที่เลือก?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: () => {
          removeMultipleTodos(selectedIds);
          setSelectedIds([]);
          Alert.alert("สำเร็จ", "ลบโน้ตที่เลือกเรียบร้อยแล้ว");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* แถบหัวเรื่อง */}
      <View style={styles.header}>
        <Ionicons name="book-outline" size={30} color="#FFFFFF" style={styles.headerIconLeft} />
        <Text style={styles.todoHeader}>รายการของฉัน</Text>
        {/* ปุ่มสร้าง (อยู่ด้านบน) */}
        <Link asChild href="/create">
          <TouchableOpacity style={styles.createButtonHeader}>
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person-outline" size={24} color="#FFFFFF" style={styles.headerIconRight} />
        </TouchableOpacity>
      </View>

      {/* Modal เมนูโปรไฟล์ */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Link href="/about" asChild>
              <TouchableOpacity style={styles.modalItem} onPress={() => setModalVisible(false)}>
                <Ionicons name="information-circle-outline" size={20} color="#000000" />
                <Text style={styles.modalText}>เกี่ยวกับ</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.modalItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FF0000" />
              <Text style={[styles.modalText, { color: "#FF0000" }]}>ล็อกเอาท์</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* รายการการ์ด */}
      <ScrollView style={styles.todoContainer} contentContainerStyle={styles.todoContentContainer}>
        {todos.length > 0 ? (
          todos
            .slice()
            .reverse()
            .map((todo) => (
              <Card
                key={todo.id}
                todo={todo}
                isSelected={selectedIds.includes(todo.id)}
                onSelect={handleSelect}
              />
            ))
        ) : (
          <View style={styles.noTodoContainer}>
            <Text style={styles.noTodoText}>ไม่พบรายการ</Text>
            <Text style={styles.noTodoSubText}>เพิ่มรายการใหม่ด้านบน</Text>
          </View>
        )}
      </ScrollView>

      {/* ปุ่มลบที่เลือก (อยู่ด้านล่าง) */}
      {selectedIds.length > 0 && (
        <TouchableOpacity style={styles.deleteSelectedButton} onPress={handleRemoveSelected}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteSelectedText}>ลบที่เลือก ({selectedIds.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  headerIconLeft: { marginRight: 10 },
  todoHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  createButtonHeader: { marginRight: 10 },
  headerIconRight: { marginLeft: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    maxWidth: 300,
    borderWidth: 2,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalText: { fontSize: 18, color: "#000000", marginLeft: 10 },
  todoContainer: { flex: 1 },
  todoContentContainer: { padding: 15, paddingBottom: 80 },
  noTodoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noTodoText: { fontSize: 20, fontWeight: "600", color: "#000000", opacity: 0.8 },
  noTodoSubText: { fontSize: 16, color: "#666666", marginTop: 5, fontStyle: "italic" },
  deleteSelectedButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  deleteSelectedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});