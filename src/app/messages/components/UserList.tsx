"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, usePathname } from "next/navigation";
import { useGetDbUserId } from "@/hooks/useGetDbUser";
import { createClient } from "@/lib/supabase/client";
import { useChat } from "@/contexts/ChatContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import BioText from "@/components/profile/BioText";
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
  console.log(latestMessages);
  return (
    <>
      <div className="flex flex-col  bg-white border-r h-full max-xl:h-fit max-xl:border-b max-xl:border-r-0">
        <div className="p-4 max-xl:hidden">
          <div className="flex items-center justify-between">
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
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 max-lg:flex max-lg:gap-1 ">
            {usersState.map((user) => {
              const latestMessage =
                latestMessages[`chat:${[userId, user.id].sort().join(":")}`];
              return (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center p-3 lg:rounded-lg cursor-pointer hover:bg-gray-100 max-lg:hover:rounded-full duration-200  ",
                    pathname === `/messages/${user.id}`
                      ? "bg-gray-100  max-lg:rounded-full"
                      : ""
                  )}
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
                  <div className="ml-3 flex-1 overflow-hidden max-lg:hidden">
                    <div className="flex flex-col">
                      <h3 className="font-medium truncate">{user.username}</h3>
                      {latestMessage && (
                        <p className="flex items-center text-xs text-gray-500">
                          <span className="max-w-[100px] inline-block ">
                            <BioText
                              text={latestMessage?.content}
                              className="[&_p]:truncate  [&_p]:overflow-hidden  [&_p]:max-w-[100px]"
                            />
                            {latestMessage?.images.length > 0 && (
                              <span className="text-xs text-gray-500">
                                sent {latestMessage?.images.length} files
                              </span>
                            )}
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
