import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

// ป้องกันการกำหนดชื่อฟังก์ชันซ้ำโดยใช้ชื่อที่ไม่ซ้ำกับ default export อื่น
export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    router.push({
      pathname: '/login',
      params: { username, password },
    });
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>Register</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="Username"
        value={username as string} // บังคับให้เป็น string เพื่อแก้ error TS
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Password"
        value={password as string} // บังคับให้เป็น string เพื่อแก้ error TS
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <Button title="Register" onPress={handleRegister} color="#000" />
    </View>
  );
}

// เปลี่ยนชื่อ styles เพื่อป้องกันการ冲突
const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
});