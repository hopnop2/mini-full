import { AppButton } from "@/components";
import TodoContext from "@/context/Todo.context";
import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Link href="/" asChild>
            <Ionicons
              name="arrow-back-outline"
              size={isLargeScreen ? 30 : width * 0.06}
              color="#FFFFFF"
              style={styles.backIcon}
            />
          </Link>
          <Ionicons
            name="create-outline"
            size={isLargeScreen ? 30 : width * 0.06}
            color="#FFFFFF"
            style={styles.headerIconLeft}
          />
          <Text style={[styles.headerText, { marginLeft: 0 }]}>เพิ่มรายการใหม่</Text>
        </View>

        {/* ฟอร์ม */}
        <ScrollView contentContainerStyle={styles.formContainer}>
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
            multiline
            minHeight={100}
            maxHeight={200}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddTodo}
          />
          <AppButton onPress={handleAddTodo} style={styles.createButton}>
            <Text style={styles.buttonText}>สร้างรายการ</Text>
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: isLargeScreen ? 15 : 10,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: {
    marginLeft: 10,
    position: "absolute",
    left: 0,
  },
  headerIconLeft: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: isLargeScreen ? 26 : width * 0.055,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: isLargeScreen ? 40 : width * 0.05,
    paddingVertical: isLargeScreen ? 50 : 30,
    marginTop: 20,
  },
  input: {
    width: isLargeScreen ? "80%" : "90%",
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    fontSize: isLargeScreen ? 18 : width * 0.045,
    padding: 15,
    marginBottom: isLargeScreen ? 30 : 20,
    borderColor: "#000000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createButton: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    paddingVertical: isLargeScreen ? 16 : 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: isLargeScreen ? "50%" : "80%",
    maxWidth: 300,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    fontSize: isLargeScreen ? 20 : width * 0.045,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});