import React , {useState} from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { TodoItem } from './TodoWrapper';

interface Props{
task:TodoItem,
setIsTodoEditMode:(data: {
    id: number;
  isEditing: boolean;
  })=>any
}

export const  EditTodoForm=({task,setIsTodoEditMode}:Props)=> {
  const queryClient = useQueryClient();
  const { mutate: onEditATodo } = useMutation({
    mutationFn: editATodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
  
   async function editATodo(data: { id: number; newData: string }) {
    const updatedData = {
      task: data.newData,
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
    const [value,setValue]=useState(task.task);
    const handleSubmit=(e: React.FormEvent)=>{
e.preventDefault();
onEditATodo({id:task.id,newData:value})
setIsTodoEditMode({id:task.id,isEditing:false})
setValue('')
    }
  return (
    <form className='TodoForm' onSubmit={handleSubmit}>
        <input type='text' placeholder='Update Task' className='todo-input' value={value} onChange={(e)=>setValue(e.target.value)}></input>
        <button type='submit' className='todo-btn'> Update Task</button>
    </form>
  )
}