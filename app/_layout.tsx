import { TodoProvider } from "@/context/Todo.context";
import { Stack, router } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        if (username && password) {
          router.replace('/'); // ถ้ามีข้อมูลล็อกอิน ไปหน้า index
        } else {
          router.replace('/welcom'); // ถ้าไม่มี ไปหน้า welcome
        }
      } catch (error) {
        console.error('Error checking login status', error);
        router.replace('/welcom');
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <PaperProvider>
      <TodoProvider>
        <Stack>
          <Stack.Screen
            name="welcom"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              headerShown: true,
              title: "สร้างโน้ต",
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              headerShown: true,
              title: "เกี่ยวกับ",
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </TodoProvider>
    </PaperProvider>
  );
}