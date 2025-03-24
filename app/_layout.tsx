import { TodoProvider } from "@/context/Todo.context";
import { Stack, router } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    router.replace("/login");
  }, []);

  return (
    <PaperProvider>
      <TodoProvider>
        <Stack>
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
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              headerShown: false,
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