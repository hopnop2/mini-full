import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../utils/supabase';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    title: '',
    message: '',
    buttons: [],
  });

  const handleRegister = async () => {
    setError('');

    // ตรวจสอบว่าฟิลด์ไม่ว่าง
    if (!displayName || !email || !password || !phone) {
      setAlertConfig({
        visible: true,
        title: 'ข้อมูลไม่ครบถ้วน',
        message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        buttons: [
          {
            text: 'ตกลง',
            onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })),
          },
        ],
      });
      return;
    }

    try {
      // 1. สร้างผู้ใช้ใหม่
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName,
          },
        },
      });

      if (authError) throw authError;

      // 2. สร้าง/อัปเดตข้อมูลในตาราง profiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            display_name: displayName,
            phone: phone,
            avatar_url: null,
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      setAlertConfig({
        visible: true,
        title: 'สมัครสมาชิกสำเร็จ',
        message: 'คุณสามารถล็อกอินได้แล้ว',
        buttons: [
          {
            text: 'ตกลง',
            onPress: () => {
              setAlertConfig(prev => ({ ...prev, visible: false }));
              router.replace('/login');
            },
          },
        ],
      });
    } catch (error: any) { // เปลี่ยนจาก Error เป็น any
      setError(error.message);
      setAlertConfig({
        visible: true,
        title: 'เกิดข้อผิดพลาด',
        message: error.message,
        buttons: [
          {
            text: 'ตกลง',
            onPress: () => setAlertConfig(prev => ({ ...prev, visible: false })),
          },
        ],
      });
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>สร้างบัญชี</Text>
      <Text style={registerStyles.subtitle}>สมัครสมาชิกเพื่อเริ่มต้น</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="ชื่อที่แสดง"
        value={displayName}
        onChangeText={setDisplayName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={registerStyles.input}
        placeholder="เบอร์โทรศัพท์"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#888"
        keyboardType="phone-pad"
      />
      <TextInput
        style={registerStyles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        keyboardType="email-address"
      />
      <TextInput
        style={registerStyles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      {error ? (
        <Text style={registerStyles.errorText}>{error}</Text>
      ) : null}
      <TouchableOpacity style={registerStyles.registerButton} onPress={handleRegister}>
        <Text style={registerStyles.registerButtonText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/login')} style={registerStyles.loginLink}>
        <Text style={registerStyles.loginText}>
          มีบัญชีแล้ว? <Text style={registerStyles.loginHighlight}>เข้าสู่ระบบ</Text>
        </Text>
      </TouchableOpacity>

      {alertConfig.visible && (
        <View style={registerStyles.alertContainer}>
          <Text style={registerStyles.alertText}>{alertConfig.title}</Text>
          <Text style={registerStyles.alertText}>{alertConfig.message}</Text>
          {alertConfig.buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={registerStyles.alertButton}
              onPress={button.onPress}
            >
              <Text style={registerStyles.alertButtonText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const registerStyles = StyleSheet.create({
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
  registerButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginHighlight: {
    color: '#000',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
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