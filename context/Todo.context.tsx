import { createContext, useState } from "react";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  timestamp?: number;
  image?: string | null; // เพิ่ม property image
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: { text: string; image?: string | null }) => void; // ปรับ type ของ addTodo
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  removeMultipleTodos: (ids: number[]) => void;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  addTodo: () => {},
  toggleTodo: () => {},
  removeTodo: () => {},
  removeMultipleTodos: () => {},
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = ({ text, image }: { text: string; image?: string | null }) => {
    setTodos([
      ...todos,
      {
        id: todos.length + 1,
        text,
        done: false,
        timestamp: new Date().getTime(),
        image, // เพิ่ม image เข้าไปใน todo
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