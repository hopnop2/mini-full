import { createContext, useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  timestamp?: number;
  image?: string | null;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: { text: string; image?: string | null }) => Promise<void>;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  removeMultipleTodos: (ids: number[]) => void;
  updateTodo: (updatedTodo: Todo) => void;
  setTodos: (todos: Todo[]) => void;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  addTodo: async () => {},
  toggleTodo: () => {},
  removeTodo: () => {},
  removeMultipleTodos: () => {},
  updateTodo: () => {},
  setTodos: () => {},
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from('todos').select('*');
      if (!error && data) {
        setTodos(data);
      } else {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async ({ text, image }: { text: string; image?: string | null }) => {
    const newTodo = {
      text,
      done: false,
      timestamp: new Date().getTime(),
      image,
    };
    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo]) // ไม่ส่ง id เพราะ Supabase จะสร้างเอง
      .select();
    if (error) {
      console.error('Error adding todo:', error);
      throw error; // โยนข้อผิดพลาดเพื่อให้จัดการในหน้า CreateTodo
    } else if (data) {
      setTodos([...todos, data[0]]); // ใช้ data[0] ที่มี id จาก Supabase
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, done: !todo.done };
      const { error } = await supabase
        .from('todos')
        .update({ done: updatedTodo.done })
        .eq('id', id);
      if (!error) {
        setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      }
    }
  };

  const removeTodo = async (id: number) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const removeMultipleTodos = async (ids: number[]) => {
    const { error } = await supabase.from('todos').delete().in('id', ids);
    if (!error) {
      setTodos(todos.filter((todo) => !ids.includes(todo.id)));
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    const { error } = await supabase
      .from('todos')
      .update(updatedTodo)
      .eq('id', updatedTodo.id);
    if (!error) {
      setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
    }
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, removeTodo, removeMultipleTodos, updateTodo, setTodos }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;