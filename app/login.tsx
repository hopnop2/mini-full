import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [storedUsername, setStoredUsername] = useState('');
  const [storedPassword, setStoredPassword] = useState('');

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUsername) setStoredUsername(savedUsername);
        if (savedPassword) setStoredPassword(savedPassword);
      } catch (error) {
        console.error('Error loading data', error);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = () => {
    if (username === storedUsername && password === storedPassword) {
      router.replace('/'); // ใช้ replace เพื่อแทนที่ stack
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>ยินดีต้อนรับกลับ</Text>
      <Text style={loginStyles.subtitle}>ลงชื่อเข้าใช้เพื่อดำเนินการต่อ</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="ชื่อผู้ใช้"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />
      <TextInput
        style={loginStyles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
        <Text style={loginStyles.loginButtonText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister} style={loginStyles.registerLink}>
        <Text style={loginStyles.registerText}>ยังไม่มีบัญชี? <Text style={loginStyles.registerHighlight}>สมัครสมาชิก</Text></Text>
      </TouchableOpacity>
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
});