"use client";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export function AppUser() {
  const { open } = useSidebar();
  const { user } = useUser();
  console.log(user);
  return (
    <>
      <SignedIn>
        <SidebarMenu
          className={cn(
            "transition-all duration-300",
            open ? "px-2" : "items-center px-0"
          )}
        >
          <SidebarMenuItem className="w-full">
            <Avatar className="h-8 !w-full rounded-lg size-8 px-5s ">
              <AvatarFallback className="rounded-lg bg-transparent justify-start  gap-2">
                <UserButton />
                <span
                  data-sidebar-open={open}
                  className="text-xs font-bold truncate "
                >
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </AvatarFallback>
            </Avatar>
          </SidebarMenuItem>
        </SidebarMenu>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </>
  );
}
