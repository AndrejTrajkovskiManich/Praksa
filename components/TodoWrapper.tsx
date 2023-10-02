import React, { useState } from "react";
import { useQuery } from "react-query";
import { Todo } from "./Todo.tsx";
import { TodoForm } from "./TodoForm.tsx";
import { useMutation, useQueryClient } from 'react-query';
import { EditTodoForm } from "./EditTodoForm.tsx"; 

const fetchTodos = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  isEditing: boolean;
}

export const TodoWrapper: React.FC = () => {
  const queryClient = useQueryClient();
  const [todos, setTodos] = useState<TodoItem[]>([]);
   const { mutate: setIsTodoEditMode } = useMutation({
    mutationFn: setIsTodoEditModeFunc,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
  async function setIsTodoEditModeFunc(data: {
    id: number;
  isEditing: boolean;
  }) {
    const updatedData = {
    isEditing: data.isEditing,
    };
    try {
      const response = await fetch(`http://localhost:3000/todos/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(`An error occurred: ${error.message}`);
    }
  }
  // const addTodo = (data: string) => {
  //   setTodos([
  //     ...todos,
  //     { id: new Date().valueOf(), task: data, completed: false, isEditing: false },
  //   ]);
  // };
  
  // const deleteTodo = (id: number) =>
  // setTodos(todos.filter((data) => data.id !== id));
  
  // const toggleComplete = (id: number) => {
  //   setTodos(
  //     todos.map((data) =>
  //     data.id === id ? { ...data, completed: !data.completed } : data
  //     )
  //     );
  //   };
    
    const editTodo = (id: number) => {
      setTodos(
        todos.map((data) =>
        data.id === id ? { ...data, isEditing: !data.isEditing } : data
        )
        );
      };
      
      // const editTask = (task: string, id: number) => {
      //   setTodos(
      //     todos.map((data) =>
      //     data.id === id ? { ...data, task, isEditing: !data.isEditing } : data
      //     )
      //     );
      //   };
        
        const { data, isLoading } = useQuery({
          queryFn: () => fetchTodos("http://localhost:3000/todos"),
          queryKey: ["todos"],
         });
  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm  />

      {data?.map((data:TodoItem) =>
        data.isEditing ? (
          <EditTodoForm key={data.id} task={data} setIsTodoEditMode={setIsTodoEditMode}/>
        ) : (
          <Todo
            key={data.id}
            task={data}
          editATodoFile={editTodo}
          
          />
        )
      )}
    </div>
  );
};
