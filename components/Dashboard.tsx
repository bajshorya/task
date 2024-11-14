import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import TaskCard, { TaskCardProps } from "../components/ui/TaskCard"; 
import { db } from "@/config/firebase";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, "tasks");
        const tasksSnapshot = await getDocs(tasksCollection);
        const tasksList = tasksSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? "", 
            description: data.description ?? "",
            dueDate: data.dueDate ?? "",
            priority: data.priority ?? "low",
            status: data.status ?? "To Do",
          } as TaskCardProps;
        });
        setTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks from Firestore:", error);
      }
    };

    fetchTasks();
  }, []);

  // Group tasks by status
  const groupedTasks = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Completed: tasks.filter((task) => task.status === "Completed"),
  };

  return (
    <div className="flex space-x-4 p-4">
      {Object.entries(groupedTasks).map(([status, tasks]) => (
        <div key={status} className="w-1/3">
          <h2 className="text-2xl font-bold mb-4">{status}</h2>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id} // Pass id here
                  title={task.title}
                  description={task.description}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  status={task.status}
                />
              ))
            ) : (
              <p className="text-gray-500">No tasks</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
