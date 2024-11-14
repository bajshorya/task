"use client";
import React, { useEffect, useState } from "react";
import {
  Links,
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconRun } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getAuth, signOut, User } from "firebase/auth";
import app from "@/config/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const auth = getAuth(app);

export function SidebarDemo() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Track auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Handle Logout/Redirect for Login
  const handleAuthToggle = async () => {
    if (user) {
      try {
        await signOut(auth);
        console.log("User signed out");
        alert("User signed out");
        // Don't redirect, just update the button text to "Login"
        setUser(null);
      } catch (error) {
        console.error("Sign-out error:", error);
      }
    } else {
      router.push("/signin");
    }
  };

  // Define links with conditional auth toggle for Login/Logout
  const links: Links[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Add Task",
      href: "/add-task",
      icon: (
        <IconRun className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: user ? "Logout" : "Login",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
      onClick: handleAuthToggle, // Only Login/Logout uses onClick
    },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) =>
                link.href ? (
                  <Link href={link.href} key={idx}>
                    <div>
                      <SidebarLink link={link} />
                    </div>
                  </Link>
                ) : (
                  <button
                    key={idx}
                    onClick={link.onClick}
                    className="w-full text-left"
                  >
                    <SidebarLink link={link} />
                  </button>
                )
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        {/* Dashboard content here */}
      </div>
    </div>
  );
};
