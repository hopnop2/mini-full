import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  // กำหนดตัวแปร State สำหรับเก็บค่าของ Email และ Password
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // กำหนดตัวแปรเก็บสถานะการ submit ข้อมูล
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add alert config state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: Array<{
      text: string;
      onPress: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>;
  }>({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });

  // ตรวจสอบเซสชันเมื่อเริ่มต้น
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/'); // ถ้ามีเซสชันอยู่แล้ว ให้ไปหน้า Index
      }
    };
    checkSession();
  }, []);

  // ฟังก์ชัน submit form สำหรับการเข้าสู่ระบบ
  const submit = async () => {
    setIsSubmitting(true);

    if (form.email === "" || form.password === "") {
      setAlertConfig({
        visible: true,
        title: "ข้อมูลไม่ครบถ้วน",
        message: "กรุณากรอกอีเมลและรหัสผ่าน",
        buttons: [
          {
            text: "ตกลง",
            onPress: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setAlertConfig({
          visible: true,
          title: "เกิดข้อผิดพลาด",
          message: error.message.includes('Invalid login credentials')
            ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            : error.message,
          buttons: [
            {
              text: "ตกลง",
              onPress: () =>
                setAlertConfig((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
        // ล้าง token เก่า (ถ้ามี)
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('isLoggedIn');
        setIsSubmitting(false);
        return;
      }

      // บันทึก token และสถานะล็อกอิน
      await AsyncStorage.setItem("token", data.session.access_token);
      await AsyncStorage.setItem("isLoggedIn", "true");

      setAlertConfig({
        visible: true,
        title: "ล็อกอินสำเร็จ",
        message: "ยินดีต้อนรับกลับ",
        buttons: [
          {
            text: "ตกลง",
            onPress: () => {
              setAlertConfig((prev) => ({ ...prev, visible: false }));
              router.replace("/"); // เปลี่ยนเส้นทางไปหน้า Index
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error during login:', error);
      setAlertConfig({
        visible: true,
        title: "เกิดข้อผิดพลาด",
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        buttons: [
          {
            text: "ตกลง",
            onPress: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
      setIsSubmitting(false);
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>ยินดีต้อนรับกลับ</Text>
      <Text style={loginStyles.subtitle}>ลงชื่อเข้าใช้เพื่อดำเนินการต่อ</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="อีเมล"
        value={form.email}
        onChangeText={(e) => setForm({ ...form, email: e })}
        placeholderTextColor="#888"
        editable={!isSubmitting}
        keyboardType="email-address"
      />
      <TextInput
        style={loginStyles.input}
        placeholder="รหัสผ่าน"
        value={form.password}
        onChangeText={(e) => setForm({ ...form, password: e })}
        secureTextEntry
        placeholderTextColor="#888"
        editable={!isSubmitting}
      />
      <TouchableOpacity
        style={[loginStyles.loginButton, isSubmitting && { opacity: 0.6 }]}
        onPress={submit}
        disabled={isSubmitting}
      >
        <Text style={loginStyles.loginButtonText}>
          {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : "เข้าสู่ระบบ"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/register")} style={loginStyles.registerLink}>
        <Text style={loginStyles.registerText}>
          ยังไม่มีบัญชี? <Text style={loginStyles.registerHighlight}>สมัครสมาชิก</Text>
        </Text>
      </TouchableOpacity>

      {alertConfig.visible && (
        <View style={loginStyles.alertContainer}>
          <Text style={loginStyles.alertText}>{alertConfig.title}</Text>
          <Text style={loginStyles.alertText}>{alertConfig.message}</Text>
          {alertConfig.buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={loginStyles.alertButton}
              onPress={button.onPress}
            >
              <Text style={loginStyles.alertButtonText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    color: '#000',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 16,
  },
  registerHighlight: {
    color: '#000',
    fontWeight: 'bold',
  },
  alertContainer: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  alertText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  alertButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});