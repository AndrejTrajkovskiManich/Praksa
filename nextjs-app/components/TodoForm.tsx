import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { TodoItem } from './TodoWrapper';

export const TodoForm: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const queryClient = useQueryClient();

  const postData = async (newTodoData: TodoItem) => {
    try {
      // Remove the 'id' property from the request body
      const { id, ...requestData } = newTodoData;

      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Send the modified request data without 'id'
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server error response
        throw new Error(data.message || 'Failed to create todo');
      }

      return data;
    } catch (error) {
      // Handle network error or JSON parsing error
      if (error instanceof Error) {
        throw new Error(`Failed to create todo: ${error.message}`);
      } else {
        throw new Error(`Failed to create todo: Unknown error`);
      }
    }
  };

  const { mutate } = useMutation(postData, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() !== '') {
      const newItem: TodoItem = {
        id: new Date().valueOf(),
        task: value,
        completed: false,
        isEditing: false,
      };

      try {
        const createdItem = await mutate(newItem);
        console.log('Created Todo Item:', createdItem);
        setValue('');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to create todo:', error.message);
        } else {
          console.error('Failed to create todo: Unknown error');
        }
      }
    }
  };

  return (
    <form className="TodoForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What is your task?"
        className="todo-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="todo-btn">
        Add Task
      </button>
    </form>
  );
};
