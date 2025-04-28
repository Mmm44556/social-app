"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Message } from "@/app/actions/user.action";

interface ChatContextType {
  currentRoomId: string | null;
  latestMessages: Record<string, Message | null>;
  setCurrentRoomId: (roomId: string | null) => void;
  setLatestMessage: (roomId: string, message: Message | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [latestMessages, setLatestMessages] = useState<
    Record<string, Message | null>
  >({});

  const setLatestMessage = (roomId: string, message: Message | null) => {
    setLatestMessages((prev) => ({
      ...prev,
      [roomId]: message,
    }));
  };

  const handleSetCurrentRoomId = (roomId: string | null) => {
    if (!roomId) {
      setCurrentRoomId(null);
      return;
    }

    // 確保聊天室 ID 是排序過的
    const [prefix, ...ids] = roomId.split(":");
    const sortedIds = ids.sort();
    const sortedRoomId = `${prefix}:${sortedIds.join(":")}`;
    setCurrentRoomId(sortedRoomId);
  };

  return (
    <ChatContext.Provider
      value={{
        currentRoomId,
        latestMessages,
        setCurrentRoomId: handleSetCurrentRoomId,
        setLatestMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context as ChatContextType;
}
