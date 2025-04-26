"use client";

import {
  ChevronLeft,
  Search,
  Bell,
  MoreVertical,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
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
  const { user } = useUser();
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[50] bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800",
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
          {user && (
            <Button
              variant="ghost"
              size="none"
              className="relative"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="size-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="none">
                <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto z-50" side="top">
              <DropdownMenuItem asChild>
                {user ? (
                  <SignOutButton>
                    <Button variant="ghost">Log out</Button>
                  </SignOutButton>
                ) : (
                  <SignInButton mode="modal">
                    <Button variant="ghost">Log in</Button>
                  </SignInButton>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
