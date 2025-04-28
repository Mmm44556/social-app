"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Message } from "@/app/actions/user.action";
import { useChat } from "@/contexts/ChatContext";

interface UseRealtimeChatProps {
  roomName: string;
  activate: boolean;
  currentUserId: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({
  roomName,
  activate,
  currentUserId,
}: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { setLatestMessage } = useChat();

  const chatRoomId = useMemo(() => {
    // Sort the IDs to ensure consistent room ID regardless of who initiated the chat
    const ids = [currentUserId, roomName.split(":")[1]].sort();
    return `chat:${ids.join(":")}`;
  }, [currentUserId, roomName]);

  useEffect(() => {
    if (!activate) return;
    console.log("Chat Room ID:", chatRoomId);

    const newChannel = supabase.channel(chatRoomId);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const message = payload.payload as Message;
        setMessages((current) => [...current, message]);
        setLatestMessage(chatRoomId, message);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomName, supabase, activate, chatRoomId, setLatestMessage]);

  const sendMessage = useCallback(
    async (message: Message) => {
      if (!channel || !isConnected) return;
      // Update local state immediately for the sender
      setMessages((current) => [...current, message]);
      setLatestMessage(chatRoomId, message);
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
    },
    [channel, isConnected, chatRoomId, setLatestMessage]
  );
  return { messages, sendMessage, isConnected };
}
