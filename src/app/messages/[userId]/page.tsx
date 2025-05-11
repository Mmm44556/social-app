"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getChatMessages,
  getUserByUserId,
  type Message,
} from "@/app/actions/user.action";
import { useParams, useRouter } from "next/navigation";
import { useGetDbUser } from "@/hooks/useGetDbUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useRealtimeChat } from "@/hooks/useRealTimeChat";
import { useChatScroll } from "@/hooks/useChatScroll";
import CommentUtilsBar from "@/components/CommentUtilsBar";
import { useCreateEditor } from "@/hooks/useCreateEditor";
import { EditorContent } from "@tiptap/react";
import BioText from "@/components/profile/BioText";
import { Skeleton } from "@/components/ui/skeleton";

type User = Awaited<ReturnType<typeof getUserByUserId>>;

export default function ChatPage() {
  const navigator = useRouter();
  const { data: currentUser } = useGetDbUser();
  const params = useParams() as { userId: string };
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messageRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<Array<{ url: string; file: File }> | []>(
    []
  );
  const editor = useCreateEditor(newMessage, setNewMessage, {
    placeholder: "Type a message...",
  });
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
      if ((!newMessage && images.length === 0) || !isConnected) return;
      sendMessage(
        {
          content: newMessage,
          images: images.map((image) => image.url),
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
        },
        images.map((image) => image.file)
      );
      setNewMessage("");
      setImages([]);
      editor?.commands.clearContent();
    },
    [
      newMessage,
      isConnected,
      sendMessage,
      currentUser,
      currentChatUser,
      params,
      images,
      editor,
    ]
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

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between max-md:border-b-0 max-xl:hidden">
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
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigator.push(`/${currentChatUser?.tagName}`)}
          >
            <Avatar>
              <AvatarImage src={currentChatUser?.avatarUrl || ""} />
              <AvatarFallback>
                {currentChatUser?.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="font-medium group-hover:underline">
              {currentChatUser?.username}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      {isLoading ? (
        <div className="flex-1 p-2 md:p-4 bg-gray-50 space-y-4 h-full overflow-y-auto">
          {new Array(6).fill(0).map((_, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start space-x-2 max-w-[50%] w-full">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="p-3 rounded-lg bg-gray-100 w-full">
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : allMessages.length > 0 ? (
        <ScrollArea
          viewportRef={containerRef}
          className="flex-1 p-2 md:p-4 bg-gray-50 max-h-[calc(100dvh-10rem)] h-full overflow-y-auto max-md:max-h-[calc(100dvh-16rem)]"
        >
          <div className="space-y-4 ">
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
                      <BioText text={message.content} />
                      {message.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt="message image"
                              className="rounded-md"
                            />
                          ))}
                        </div>
                      )}
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
      ) : (
        <div className="flex items-center justify-center flex-1 p-2 md:p-4 bg-gray-50  h-full overflow-y-auto">
          <p className="text-gray-500">No messages yet</p>
        </div>
      )}
      {/* Message Input */}
      <div className="p-2 sm:p-4 border-t bg-white">
        <div className="flex space-x-2 items-center">
          <EditorContent
            editor={editor}
            placeholder="Type a message..."
            className="w-full h-full border px-1 rounded-md"
            onKeyDown={(e) => {
              if (e.metaKey && e.key === "Enter") {
                handleSendMessage(e);
              }
            }}
          />

          <CommentUtilsBar
            setImages={setImages}
            inputFileRef={messageRef}
            editor={editor!}
            enableImageInsert={true}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
