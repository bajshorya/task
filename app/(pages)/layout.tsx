"use client";
import { usePathname } from "next/navigation";
import { SidebarDemo } from "@/components/SidebarDemo";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isAuthPage =
    pathname?.includes("/signin") || pathname?.includes("/signup");

  return (
    <div className="min-h-screen flex-">
      {!isAuthPage && <SidebarDemo />}
      <div className="flex-1 p-2 md:p-10 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        {children}
      </div>
    </div>
  );
};

export default Layout;
