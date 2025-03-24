import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

export default function LoginScreen() {
  const { username: regUsername, password: regPassword } = useLocalSearchParams();
  const [username, setUsername] = useState(regUsername || '');
  const [password, setPassword] = useState(regPassword || '');

  const handleLogin = () => {
    if (username === regUsername && password === regPassword) {
      router.push('/');
    } else {
      alert('Invalid username or password');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Login</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="Username"
        value={username as string}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />
      <TextInput
        style={loginStyles.input}
        placeholder="Password"
        value={password as string}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <Button title="Login" onPress={handleLogin} color="#000" />
      <TouchableOpacity onPress={handleRegister} style={loginStyles.registerLink}>
        <Text style={loginStyles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const loginStyles = StyleSheet.create({
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
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#000',
    fontSize: 16,
  },
});