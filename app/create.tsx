import { AppButton } from "@/components";
import TodoContext from "@/context/Todo.context";
import { useContext, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";

export default function CreateTodo() {
  const { addTodo } = useContext(TodoContext);
  const [text, setText] = useState("");

  const handleAddTodo = () => {
    if (!text) {
      Alert.alert("Error", "Please enter a todo");
      return;
    }

    // add todo
    addTodo?.(text);
    setText("");
    Alert.alert("Success", "Todo added successfully");
  };

  return (
    <View style={style.container}>
      <Text style={style.headerText}>Add Your Todo</Text>

      <View style={style.formContainer}>
        <TextInput
          label="Enter Todo"
          value={text}
          onChangeText={(text) => setText(text)}
          mode="outlined"
          placeholder="Enter your todo"
        />

        <AppButton onPress={handleAddTodo}>Create Todo</AppButton>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  formContainer: {
    marginVertical: 20,
    gap: 20,
  },
});
