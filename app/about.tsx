import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerText}>โปรไฟล์</Text>
      </View>

      {/* ส่วนข้อมูลโปรไฟล์ */}
      <View style={styles.profileContainer}>
        {/* รูปโปรไฟล์ */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // รูปตัวอย่าง สามารถเปลี่ยนได้
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ชื่อผู้ใช้ */}
        <Text style={styles.username}>ชื่อผู้ใช้</Text>
        <Text style={styles.bio}>คำอธิบายสั้นๆ เกี่ยวกับตัวคุณ</Text>

        {/* ข้อมูลเพิ่มเติม */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#000000" />
            <Text style={styles.infoText}>example@email.com</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color="#000000" />
            <Text style={styles.infoText}>เข้าร่วม: มีนาคม 2025</Text>
          </View>
        </View>

        {/* ปุ่มแก้ไขโปรไฟล์ */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>แก้ไขโปรไฟล์</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#000000",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000000",
    borderRadius: 15,
    padding: 5,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 30,
    alignItems: "center", // จัดให้อยู่ตรงกลาง
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // จัดให้เนื้อหาในแต่ละ item อยู่ตรงกลาง
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});