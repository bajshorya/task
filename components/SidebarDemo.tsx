"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconRun } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getAuth, signOut, User } from "firebase/auth";
import app, { addTaskToFirestore } from "@/config/firebase";
import { useRouter } from "next/navigation";
import TaskForm, { TaskData } from "../components/TaskForm";
import { Dashboard } from "./Dashboard";

const auth = getAuth(app);

export function SidebarDemo() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard"); // State to track the selected view
  const router = useRouter();
  const handleAddTask = async (taskData: TaskData) => {
    try {
      await addTaskToFirestore(taskData);
      console.log("New Task added to Firestore:", taskData);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleAuthToggle = async () => {
    if (user) {
      try {
        await signOut(auth);
        console.log("User signed out");
        alert("User signed out");
        setUser(null);
      } catch (error) {
        console.error("Sign-out error:", error);
      }
    } else {
      router.push("/signin");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: null,
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
      onClick: () => setCurrentView("dashboard"),
    },
    {
      label: "Add Task",
      href: null,
      icon: (
        <IconRun className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
      onClick: () => setCurrentView("taskForm"),
    },
    {
      label: user ? "Logout" : "Login",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
      onClick: handleAuthToggle,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="w-full text-left"
                >
                  <SidebarLink link={link} />
                </button>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1">
        <div className="p-2 md:p-10 text-white rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          {/* Render the current view based on selected link */}
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "taskForm" && (
            <div className="h-screen bg-neutral-900 flex items-center justify-center">
              <TaskForm onSubmit={handleAddTask} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
