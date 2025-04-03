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
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/app/actions/user.action";

export async function AppUser() {
  // const user = await currentUser();
  // if (user) await syncUser();
  return (
    <>
      <SignedIn>
        <SidebarMenu className="items-center  px-1">
          <SidebarMenuItem className="w-full">
            <Avatar className="h-8 !w-full rounded-lg size-8 ">
              <AvatarFallback className="rounded-lg bg-transparent  cols-s justify-start c gap-2">
                <UserButton />
                <span className="text-xs font-bold truncate ">
                  {/* {user?.primaryEmailAddress?.emailAddress} */}
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
