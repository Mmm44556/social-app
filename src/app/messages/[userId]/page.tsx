"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getChatMessages,
  getUserByUserId,
  type Message,
} from "@/app/actions/user.action";
import { useParams } from "next/navigation";
import { useGetDbUser } from "@/hooks/useGetDbUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useRealtimeChat } from "@/hooks/useRealTimeChat";
import { useChatScroll } from "@/hooks/useChatScroll";

type User = Awaited<ReturnType<typeof getUserByUserId>>;

export default function ChatPage() {
  const { data: currentUser } = useGetDbUser();
  const params = useParams() as { userId: string };
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const isMobile = useIsMobile();
  const { scrollToBottom, containerRef } = useChatScroll();
  // Get the messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", params.userId],
    queryFn: () => getChatMessages(params.userId),
    enabled: !!params.userId,
  }) as UseQueryResult<Message[]>;

  // Get the current chat user (receiver)
  const { data: currentChatUser } = useQuery({
    queryKey: ["user", params.userId],
    queryFn: () => getUserByUserId(params.userId),
    enabled: !!params.userId,
  }) as UseQueryResult<User>;

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  //   const handleSendMessage = async () => {
  //     if (!newMessage.trim()) return;

  //     try {
  //       const response = await fetch("/api/chat", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           content: newMessage,
  //           receiverId: params.userId,
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to send message");
  //       }

  //       const message = await response.json();
  //       queryClient.setQueryData(
  //         ["messages", params.userId],
  //         (old: Message[]) => [...old, message]
  //       );
  //       setNewMessage("");
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //     }
  //   };

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName: `chat:${params.userId}`,
    currentUserId: currentUser?.id || "",
    activate: !!currentUser?.id,
  });

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      sendMessage({
        content: newMessage,
        senderId: currentUser?.id || "",
        receiverId: params.userId,
        createdAt: new Date(),
        sender: {
          id: currentUser?.id || "",
          username: currentUser?.username || "",
          avatarUrl: currentUser?.avatarUrl || "",
        },
        receiver: {
          id: params.userId,
          username: currentChatUser?.username || "",
          avatarUrl: currentChatUser?.avatarUrl || "",
        },
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        isDeleted: false,
      });
      setNewMessage("");
    },
    [newMessage, isConnected, sendMessage, currentUser, currentChatUser]
  );

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...messages, ...realtimeMessages];
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id)
    );
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMessages;
  }, [messages, realtimeMessages]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="-full max-lg:pt-5">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between max-md:border-b-0">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={currentChatUser?.avatarUrl || ""} />
              <AvatarFallback>
                {currentChatUser?.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="font-medium">{currentChatUser?.username}</h2>
          </div>
        </div>
      </div>
      {/* Messages */}
      <ScrollArea
        ref={containerRef}
        className="flex-1 p-2 md:p-4 bg-gray-50 max-h-[calc(100dvh-10rem)] h-full overflow-y-auto max-md:max-h-[calc(100dvh-16rem)]"
      >
        <div className="space-y-4">
          {allMessages.map((message) => {
            const isCurrentUser = message.senderId === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start space-x-2 max-w-[70%]">
                  <Avatar>
                    <AvatarImage
                      src={message.sender.avatarUrl || ""}
                      alt={message.sender.username}
                    />
                    <AvatarFallback>
                      {message.sender.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(message.createdAt, {
                        addSuffix: false,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      {/* Message Input */}
      <div className="p-2 sm:p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(e);
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
