"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, usePathname } from "next/navigation";
import { useGetDbUserId } from "@/hooks/useGetDbUser";
import { createClient } from "@/lib/supabase/client";
import { useChat } from "@/contexts/ChatContext";
import { formatDistanceToNow } from "date-fns";
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  status?: "online" | "offline";
  lastMessage?: string;
  lastSeen?: Date;
  unread?: number;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const supabase = createClient();
  const [usersState, setUsersState] = useState<User[]>(users);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: userId } = useGetDbUserId();
  const [showSidebar, setShowSidebar] = useState(true);

  const { latestMessages } = useChat();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!userId) return;

    const presenceChannel = supabase.channel("online-users", {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Subscribe to presence changes
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const newState = presenceChannel.presenceState();
        setUsersState((prevUsers) => {
          return prevUsers.map((user) => ({
            ...user,
            status: newState[user.id] ? "online" : "offline",
          }));
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Set initial presence
          await presenceChannel.track({
            online_at: new Date().toISOString(),
            user_id: userId,
          });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [userId, supabase]);
  return (
    <>
      <div className="md:flex flex-col  bg-white border-r absolute md:relative z-10 h-full max-md:top-16 max-md:inset-0 max-md:h-fit max-md:border-b max-md:border-r-0">
        <div className="p-4 border-b max-md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Chats</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon"></Button>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations"
              className="pl-9 bg-gray-100"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 max-md:flex max-md:gap-1 ">
            {usersState.map((user) => {
              const latestMessage =
                latestMessages[`chat:${[userId, user.id].sort().join(":")}`];
              return (
                <div
                  key={user.id}
                  className={`flex items-center p-3 md:rounded-lg cursor-pointer hover:bg-gray-100 ${
                    pathname === `/messages/${user.id}`
                      ? "bg-gray-100  max-md:rounded-full"
                      : ""
                  }`}
                  onClick={() => {
                    router.push(`/messages/${user.id}`);
                  }}
                >
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.status === "online" && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden max-md:hidden">
                    <div className="flex flex-col">
                      <h3 className="font-medium truncate">{user.username}</h3>
                      {latestMessage && (
                        <p className="flex items-center text-xs text-gray-500">
                          <span className="max-w-[100px] inline-block truncate">
                            {latestMessage?.content}
                          </span>
                          <span className=" before:content-['·'] before:mx-1 before:text-xl before:align-middle ">
                            {latestMessage?.createdAt &&
                              formatDistanceToNow(latestMessage?.createdAt, {
                                addSuffix: true,
                              })}
                          </span>
                        </p>
                      )}
                    </div>
                    {user.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage}
                      </p>
                    )}
                  </div>
                  {user.unread && user.unread > 0 && (
                    <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unread}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
