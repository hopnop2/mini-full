import { Link, router } from "expo-router";
import { useContext, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
  Animated,
  BackHandler,
  Image, // เพิ่ม Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TodoContext from "@/context/Todo.context";
import { Todo } from "@/context/Todo.context";
import Card from "@/components/Card";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

export default function Index() {
  const { todos, removeMultipleTodos } = useContext(TodoContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [menuHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('isLoggedIn');
      console.log("Logged out successfully");

      setModalVisible(false);
      router.replace("/login");
    } catch (error: any) {
      console.error('Error logging out:', error.message);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถล็อกเอาท์ได้ กรุณาลองใหม่");
    }
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

  const openPopup = (todo: Todo) => setSelectedTodo(todo);
  const closePopup = () => setSelectedTodo(null);

  const toggleMenu = () => {
    if (menuExpanded) {
      Animated.timing(menuHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuExpanded(false));
    } else {
      setMenuExpanded(true);
      Animated.timing(menuHeight, {
        toValue: 120,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={30} color="#FFFFFF" style={styles.headerIconLeft} />
        <Text style={styles.todoHeader}>รายการของฉัน</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person-outline" size={24} color="#FFFFFF" style={styles.headerIconRight} />
        </TouchableOpacity>
      </View>

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
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setModalVisible(false);
                router.replace("/about");
              }}
            >
              <Ionicons name="information-circle-outline" size={20} color="#000000" />
              <Text style={styles.modalText}>เกี่ยวกับ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FF0000" />
              <Text style={[styles.modalText, { color: "#FF0000" }]}>ล็อกเอาท์</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
                onPress={() => openPopup(todo)}
              />
            ))
        ) : (
          <View style={styles.noTodoContainer}>
            <Text style={styles.noTodoText}>ไม่พบรายการ</Text>
            <Text style={styles.noTodoSubText}>เพิ่มรายการใหม่ด้านล่าง</Text>
          </View>
        )}
      </ScrollView>

      {selectedIds.length > 0 && (
        <TouchableOpacity style={styles.deleteSelectedButton} onPress={handleRemoveSelected}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteSelectedText}>ลบที่เลือก ({selectedIds.length})</Text>
        </TouchableOpacity>
      )}

      <View style={styles.menuContainer}>
        <Animated.View style={[styles.menuExpanded, { height: menuHeight }]}>
          {menuExpanded && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.replace("/about");
                  toggleMenu();
                }}
              >
                <Ionicons name="information-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.menuItemText}>เกี่ยวกับ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.replace("/create");
                  toggleMenu();
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.menuItemText}>สร้าง</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>เมนู</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedTodo !== null}
        onRequestClose={closePopup}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            {selectedTodo && (
              <>
                {selectedTodo.image && (
                  <Image
                    source={{ uri: selectedTodo.image }}
                    style={styles.popupImage}
                  />
                )}
                <Text style={styles.popupTitle}>{selectedTodo.text}</Text>
                <Text style={styles.popupTimestamp}>
                  สร้างเมื่อ: {selectedTodo.timestamp
                    ? new Date(selectedTodo.timestamp).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "ไม่ระบุ"}
                </Text>
                <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
                  <Ionicons name="close-circle-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.closeButtonText}>ปิด</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  },
  todoHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  headerIconLeft: { marginRight: 10 },
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
  todoContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
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
    left: 20,
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteSelectedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  menuContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  menuButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  menuExpanded: {
    backgroundColor: "#000000",
    borderRadius: 15,
    width: 150,
    overflow: "hidden",
    position: "absolute",
    bottom: 50,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItemText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    maxWidth: 350,
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center",
  },
  popupImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  popupTitle: { fontSize: 20, fontWeight: "bold", color: "#000000", marginBottom: 10 },
  popupTimestamp: { fontSize: 14, color: "#666666", marginBottom: 20 },
  closeButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  closeButtonText: { color: "#FFFFFF", fontWeight: "bold", marginLeft: 5 },
});