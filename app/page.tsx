"use client";
import "../app/page.css"
import { useQuery } from "react-query";
import { TodoWrapper } from '@/components/TodoWrapper';
const fetchTodos = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default function Home() {
  const { data, isLoading } = useQuery({
    queryFn: () => fetchTodos("http://localhost:3000/todoapps"),
    queryKey: ["todos"],
  });

  return (
    
    <div className="App">
    <TodoWrapper></TodoWrapper>
    </div>
  );
}