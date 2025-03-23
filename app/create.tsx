import { AppButton } from "@/components";
import TodoContext from "@/context/Todo.context";
import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert, Dimensions, SafeAreaView } from "react-native";
import { TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function CreateTodo() {
  const { addTodo } = useContext(TodoContext);
  const [text, setText] = useState("");

  const handleAddTodo = () => {
    if (!text.trim()) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลรายการ");
      return;
    }

    addTodo?.(text);
    setText("");
    Alert.alert("สำเร็จ", "เพิ่มรายการเรียบร้อยแล้ว");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ส่วนหัว */}
        <View style={styles.header}>
          <Ionicons
            name="create-outline"
            size={width * 0.06}
            color="#FFFFFF"
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>เพิ่มรายการใหม่</Text>
        </View>

        {/* ฟอร์ม */}
        <View style={styles.formContainer}>
          <TextInput
            label="กรอกรายการ"
            value={text}
            onChangeText={(text) => setText(text)}
            mode="outlined"
            placeholder="พิมพ์รายการของคุณที่นี่"
            style={styles.input}
            outlineColor="#000000"
            activeOutlineColor="#000000"
            textColor="#000000"
            placeholderTextColor="#666666"
          />

          {/* ปุ่มสร้าง */}
          <AppButton onPress={handleAddTodo} style={styles.createButton}>
            <Text style={styles.buttonText}>สร้างรายการ</Text>
          </AppButton>

          {/* ปุ่มกลับ */}
          <Link href="/" asChild>
            <AppButton style={styles.backButton}>
              <Ionicons
                name="arrow-back-outline"
                size={width * 0.045}
                color="#000000"
              />
              <Text style={styles.backButtonText}>กลับ</Text>
            </AppButton>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
    gap: 25, // ระยะห่างระหว่าง element
  },
  input: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    fontSize: width * 0.04,
  },
  createButton: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  buttonText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: "60%",
    maxWidth: 200,
  },
  backButtonText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 5,
  },
});