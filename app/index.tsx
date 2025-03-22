import { Link } from "expo-router";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components";
import TodoContext from "@/context/Todo.context";
import Card from "@/components/Card";

export default function Index() {
  const { todos } = useContext(TodoContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.todoHeader}>รายการของฉัน</Text>
      </View>

      <ScrollView
        style={styles.todoContainer}
        contentContainerStyle={styles.todoContentContainer}
      >
        {todos.length > 0 ? (
          todos
            .slice()
            .reverse()
            .map((todo) => <Card key={todo.id} todo={todo} />)
        ) : (
          <View style={styles.noTodoContainer}>
            <Text style={styles.noTodoText}>ไม่พบรายการ</Text>
            <Text style={styles.noTodoSubText}>เพิ่มรายการใหม่ด้านล่าง</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Link asChild href="/create">
          <AppButton onPress={() => {}} style={styles.createButton}>
            <Text style={styles.buttonText}>+ เพิ่มรายการ</Text>
          </AppButton>
        </Link>
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
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  todoHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  todoContainer: {
    flex: 1,
  },
  todoContentContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  noTodoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noTodoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    opacity: 0.8,
  },
  noTodoSubText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  createButton: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});