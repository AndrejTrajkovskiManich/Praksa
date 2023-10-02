import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { TodoItem } from './TodoWrapper';

interface Props{
task:TodoItem,
editATodoFile:(id:number)=>void
}


export const  Todo=({task,editATodoFile}:Props)=> {

  const queryClient = useQueryClient();
  const { mutate: setIsTodoCompleted } = useMutation({
    mutationFn: setIsTodoCompletedFunc,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
  async function setIsTodoCompletedFunc(data: {
    id: number;
    completed: boolean;
  }) {
    const updatedData = {
      completed: data.completed,
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
  

   const { mutate: onDeleteATodo } = useMutation({
    mutationFn: deleteData,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
     async function deleteData(id: number) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Resource deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  return (

    <div className='Todo'>
      
      <p onClick={()=>setIsTodoCompleted({id:task.id,completed:!task.completed})} className={`${task.completed?'completed':" "}`}>{task.task}</p>
    
      <div className='icons'>
    <FontAwesomeIcon icon={faPenToSquare} onClick={()=>setIsTodoEditMode({id:task.id,isEditing:!task.isEditing})}></FontAwesomeIcon>
    <FontAwesomeIcon icon={faTrash} onClick={()=>onDeleteATodo(task.id)}></FontAwesomeIcon>
    </div>
    </div>
  )
}