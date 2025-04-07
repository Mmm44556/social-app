import Link from "next/link";
import {
  Home,
  MessageSquare,
  Search,
  Bell,
  User,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import type { DB_User } from "@/app/actions/user.action";
const navItems = [
  {
    title: "Home",
    icon: Home,
    linkFn: () => `/home`,
    isActive: true,
  },
  {
    title: "Explore",
    icon: Search,
    linkFn: () => `/explore`,
  },
];

export default function NavBar({ user }: { user: DB_User }) {
  return (
    <Card className="p-2 gap-0 rounded-2xl ">
      <CardContent className="grid px-0">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto ">
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.linkFn()}
                    className="relative flex h-12 items-center gap-4 rounded-md px-4 transition-colors duration-150 hover:bg-gray-200/50"
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}

              {/* Notifications */}
              <li>
                <Link
                  href={`/notifications`}
                  className="relative flex h-12 items-center gap-4 rounded-md px-4 transition-colors duration-150 hover:bg-gray-200/50"
                >
                  <Bell className="h-6 w-6" />
                  <span>Notifications</span>
                  {(user?.receivedNotifications?.length ?? 0) > 0 ? (
                    <div className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full  px-1.5 text-xs font-medium bg-theme text-white">
                      {user?.receivedNotifications?.length ?? 0}
                    </div>
                  ) : null}
                </Link>
              </li>

              {/* Messages */}
              <li>
                <Link
                  href={`/messages`}
                  className="relative flex h-12 items-center gap-4 rounded-md px-4 transition-colors duration-150 hover:bg-gray-200/50"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Messages</span>
                </Link>
              </li>

              {/* Profile */}
              <li>
                <Link
                  href={`/${user?.tagName}`}
                  className="relative flex h-12 items-center gap-4 rounded-md px-4 transition-colors duration-150 hover:bg-gray-200/50"
                >
                  <User className="h-6 w-6" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <a className="relative flex h-12 items-center gap-4 rounded-md px-4 transition-colors duration-150 hover:bg-gray-200/50">
                      <Settings className="h-6 w-6" />
                      <span>Settings</span>
                    </a>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <SignOutButton>
                        <Button variant="ghost">Log out</Button>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
      </CardContent>
    </Card>
  );
}
