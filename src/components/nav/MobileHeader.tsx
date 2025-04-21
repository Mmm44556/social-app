"use client";

import { ChevronLeft, Search, Bell, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface MobileHeaderProps {
  title: string;
  showActions?: boolean;
  className?: string;
}

export function MobileHeader({
  title,
  showActions = true,
  className,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800",
        "px-4 py-3  flex items-center justify-between lg:hidden ",
        "shadow-sm",
        className
      )}
    >
      <div className="flex items-center">
        {pathname !== "/home" && (
          <Button
            variant="ghost"
            size="none"
            className="mr-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        )}
        <h1
          className="text-lg font-semibold truncate max-w-[200px]"
          onClick={() => router.push("/home")}
        >
          {title}
        </h1>
      </div>

      {showActions && (
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreVertical className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      )}
    </header>
  );
}
