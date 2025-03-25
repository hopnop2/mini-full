import { StyleSheet, Text, View, TouchableOpacity, Image, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
import * as ImagePicker from "expo-image-picker";
import { Alert } from 'react-native';
import { decode } from "base64-arraybuffer";

export default function Profile() {
  const [displayName, setDisplayName] = useState('ชื่อผู้ใช้');
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ดึงข้อมูลผู้ใช้เมื่อหน้าโหลด
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('Error fetching user:', userError?.message || 'No user found');
          router.replace('/login');
          return;
        }

        setUserId(user.id);

        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          if (data.display_name) {
            setDisplayName(data.display_name);
          }
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        setDisplayName('ชื่อผู้ใช้');
        setAvatarUrl('https://via.placeholder.com/150');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ขอ permission สำหรับแกลเลอรี่เมื่อหน้าโหลด
  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  // จัดการปุ่มย้อนกลับของระบบ
  useEffect(() => {
    const backAction = () => {
      router.replace('/'); // ไปหน้า Index เมื่อกดปุ่มย้อนกลับของระบบ
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // ฟังก์ชันสำหรับเลือกและอัปโหลดรูปภาพ
  const handleUploadAvatar = async () => {
    try {
      const libraryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (!libraryPermission.granted) {
        const newLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!newLibraryPermission.granted) {
          Alert.alert("ข้อผิดพลาด", "ต้องให้สิทธิ์การเข้าถึงแกลเลอรี่เพื่อเลือกภาพ");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setLoading(true);

        const fileName = `avatar_${userId}_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decode(result.assets[0].base64), {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        const publicUrl = data.publicUrl;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) throw updateError;

        setAvatarUrl(publicUrl);
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการการกดปุ่มย้อนกลับใน header
  const handleBackPress = () => {
    router.replace('/'); // ไปหน้า Index
  };

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7} // เพิ่ม activeOpacity เพื่อให้เห็น feedback เมื่อกด
        >
          <Ionicons name="arrow-back-outline" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>โปรไฟล์</Text>
      </View>

      {/* ส่วนข้อมูลโปรไฟล์ */}
      <View style={styles.profileContainer}>
        {/* รูปโปรไฟล์ */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton} onPress={handleUploadAvatar}>
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ชื่อผู้ใช้ */}
        <Text style={styles.username}>{loading ? 'กำลังโหลด...' : displayName}</Text>
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
    marginLeft: 40, // เพิ่ม marginLeft เพื่อให้ปุ่มย้อนกลับไม่ถูกบัง
  },
  backButton: {
    position: "absolute",
    left: 15,
    zIndex: 1, // เพิ่ม zIndex เพื่อให้ปุ่มอยู่ด้านหน้า
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
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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