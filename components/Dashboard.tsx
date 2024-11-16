import React, { DragEvent, useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import TaskCard, { TaskCardProps } from "../components/ui/TaskCard";
import { auth, db } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export const Dashboard: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskCardProps[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [sortCriterion, setSortCriterion] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = async () => {
    try {
      if (user) {
        const tasksCollection = collection(db, "tasks");
        const tasksQuery = query(
          tasksCollection,
          where("userId", "==", user.uid)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksList = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title ?? "",
          description: doc.data().description ?? "",
          dueDate: doc.data().dueDate ?? "",
          priority: doc.data().priority ?? "low",
          status: doc.data().status ?? "To Do",
        })) as TaskCardProps[];
        setTasks(tasksList);
      }
    } catch (error) {
      console.error("Error fetching tasks from Firestore:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedTaskId(id);
  };

  const handleDrop = async (status: "To Do" | "In Progress" | "Completed") => {
    if (!draggedTaskId) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggedTaskId ? { ...task, status } : task
      )
    );

    try {
      const taskDoc = doc(db, "tasks", draggedTaskId);
      await updateDoc(taskDoc, { status });
    } catch (error) {
      console.error("Error updating task status:", error);
    }

    setDraggedTaskId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortCriterion === "deadline") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortCriterion === "priority") {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const groupedTasks = {
    "To Do": sortedTasks.filter((task) => task.status === "To Do"),
    "In Progress": sortedTasks.filter((task) => task.status === "In Progress"),
    Completed: sortedTasks.filter((task) => task.status === "Completed"),
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-xl font-semibold">
        <button
          onClick={() => router.push("/signin")}
          className="border p-3 bg-slate-900 rounded-lg mt-3"
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 p-4">
      <div>
        <div className="m-3">
          <Dropdown
            label="Filter"
            dismissOnClick={false}
            className="text-black bg-gray-300"
          >
            <Dropdown.Header className="bg-black text-white">
              Status
            </Dropdown.Header>
            <Dropdown.Item
              onClick={() => setFilterStatus("To Do")}
              className={`${
                filterStatus === "To Do" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              To Do
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setFilterStatus("In Progress")}
              className={`${
                filterStatus === "In Progress"
                  ? "bg-blue-100 text-blue-600"
                  : ""
              }`}
            >
              In Progress
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setFilterStatus("Completed")}
              className={`${
                filterStatus === "Completed" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              Completed
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header className="bg-black text-white ">
              Priority
            </Dropdown.Header>
            <Dropdown.Item
              onClick={() => setFilterPriority("high")}
              className={`${
                filterPriority === "high" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              High
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setFilterPriority("medium")}
              className={`${
                filterPriority === "medium" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              Medium
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setFilterPriority("low")}
              className={`${
                filterPriority === "low" ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              Low
            </Dropdown.Item>
          </Dropdown>
        </div>

        <button
          className="m-3 border px-4 py-1 rounded-md  "
          onClick={() => {
            setFilterStatus(null);
            setFilterPriority(null);
          }}
        >
          Clear Filters
        </button>

        <button
          className="m-3 border px-4 py-1 rounded-md"
          onClick={() =>
            setSortCriterion((prev) =>
              prev === "deadline" ? "priority" : "deadline"
            )
          }
        >
          Sort by {sortCriterion === "deadline" ? "Priority" : "Deadline"}
        </button>
      </div>

      {Object.entries(groupedTasks).map(([status, tasks]) => (
        <div
          key={status}
          className="w-1/3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() =>
            handleDrop(status as "To Do" | "In Progress" | "Completed")
          }
        >
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
                  onDelete={deleteTask}
                  onDragStart={handleDragStart}
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
