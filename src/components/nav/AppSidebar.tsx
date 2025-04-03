import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Auth from "../auth/Auth";
import { AppUser } from "./AppUser";
import { syncUser } from "@/app/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export default async function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r-white dark:border-r-gray-800"
    >
      <SidebarContent className="pt-16 dark:bg-black">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 [&_a]:text-xl [&_li]:hover:bg-gray-900 [&_li]:rounded-md   ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="dark:bg-black">
        {/* User */}
        {/* <AppUser /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
