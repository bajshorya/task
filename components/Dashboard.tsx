import React, { use, useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import TaskCard, { TaskCardProps } from "../components/ui/TaskCard";
import { auth, db } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
const Dashboard: React.FC = () => {
  const router = useRouter();
  const routeToSignin = () => {
    router.push("/signin");
  };
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (user) {
          const tasksCollection = collection(db, "tasks");
          const tasksQuery = query(
            tasksCollection,
            where("userId", "==", user.uid)
          );
          const tasksSnapshot = await getDocs(tasksQuery);
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
        }
      } catch (error) {
        console.error("Error fetching tasks from Firestore:", error);
      }
    };

    fetchTasks();
  }, [user]);

  const groupedTasks = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Completed: tasks.filter((task) => task.status === "Completed"),
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-xl font-semibold">
        Hey !!!! wanna Schedule your task more efficiently ... <br />
        SIGNIN to Find out the way to do that in the most fun way possible
        <br />
        <button
          onClick={routeToSignin}
          className="border p-3 bg-slate-900 rounded-lg mt-3"
        >
          Get Started
        </button>
      </div>
    );
  }
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
                  id={task.id}
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
