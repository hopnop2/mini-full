import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import TodoContext, { Todo } from "@/context/Todo.context";
import { Checkbox } from "react-native-paper";
import { useContext } from "react";

interface CardProps {
  todo: Todo;
}

export default function Card({ todo }: CardProps) {
  const { removeTodo, toggleTodo } = useContext(TodoContext);

  const handleRemoveTodo = (id: number) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeTodo?.(id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={() => handleRemoveTodo(todo.id)}
      activeOpacity={0.5}
      key={todo.id}
      style={style.todoCard}
    >
      <Checkbox.Item
        label=""
        status={todo.done ? "checked" : "unchecked"}
        onPress={() => toggleTodo?.(todo.id)}
      />

      <Text style={style.todoTitle}>{todo.text}</Text>
      <Text>
        {new Date(todo.timestamp!).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  // todo card
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 30,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    elevation: 2,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 500,
  },
});
