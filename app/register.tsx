import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // เก็บ username และ password ลง AsyncStorage
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      // ไปหน้า login
      router.push('/login');
    } catch (error) {
      console.error('Error saving data', error);
      alert('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>สร้างบัญชี</Text>
      <Text style={registerStyles.subtitle}>สมัครสมาชิกเพื่อเริ่มต้น</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="ชื่อผู้ใช้"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />
      <TextInput
        style={registerStyles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={registerStyles.registerButton} onPress={handleRegister}>
        <Text style={registerStyles.registerButtonText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')} style={registerStyles.loginLink}>
        <Text style={registerStyles.loginText}>มีบัญชีแล้ว? <Text style={registerStyles.loginHighlight}>เข้าสู่ระบบ</Text></Text>
      </TouchableOpacity>
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
});