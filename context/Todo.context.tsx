// TodoContext.tsx
import { createContext, useState } from "react";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  timestamp?: number;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  removeMultipleTodos: (ids: number[]) => void; // ฟังก์ชันใหม่
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  addTodo: () => {},
  toggleTodo: () => {},
  removeTodo: () => {},
  removeMultipleTodos: () => {}, // ค่าเริ่มต้น
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos([
      ...todos,
      {
        id: todos.length + 1,
        text,
        done: false,
        timestamp: new Date().getTime(),
      },
    ]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      })
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // ฟังก์ชันใหม่: ลบโน้ตหลายตัวพร้อมกัน
  const removeMultipleTodos = (ids: number[]) => {
    setTodos(todos.filter((todo) => !ids.includes(todo.id)));
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, removeTodo, removeMultipleTodos }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;