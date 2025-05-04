"use client";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Message, sendMessageToDb } from "@/app/actions/user.action";
import { useChat } from "@/contexts/ChatContext";
import { upload } from "@vercel/blob/client";
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
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, async (payload) => {
        const message = payload.payload as Message;
        setMessages((current) => {
          const exists = current.find((m) => m.id === message.id);
          if (exists) {
            // merge/replace（以新 message 為主）
            return current.map((m) =>
              m.id === message.id ? { ...m, ...message } : m
            );
          }
          // 新訊息
          return [...current, message];
        });
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
    async (message: Message, files?: File[]) => {
      if (!channel || !isConnected) return;
      // 過濾內容
      const filteredContent = message.content.replace(
        /<img[^>]*src=["']blob:[^"']*["'][^>]*>/g,
        ""
      );

      // 產生預設 messageId
      const preMessageId = message.id || uuidv4();
      // 1. 先 optimistic UI，馬上 setMessages，images 為空陣列
      const optimisticMessage = {
        ...message,
        id: preMessageId,
        images: [],
        content: filteredContent,
      };
      setMessages((current) => [...current, optimisticMessage]);
      setLatestMessage(chatRoomId, optimisticMessage);
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: optimisticMessage,
      });

      // 2. 上傳圖片（如有）
      let uploadResults: PromiseSettledResult<any>[] = [];
      if (files && files.length > 0) {
        uploadResults = await Promise.allSettled(
          files.map(async (file) => {
            const uploadResult = await upload(
              `pre-messages/${preMessageId}/${file.name}`,
              file,
              {
                access: "public",
                handleUploadUrl: "/api/image",
                clientPayload: preMessageId,
              }
            );
            return uploadResult;
          })
        );
      }
      const images = uploadResults.map((result) => {
        if (result.status === "fulfilled") {
          return result.value.url;
        }
        return null;
      });
      const imagesFilter = images.filter(Boolean);

      // 3. 寫入資料庫
      let messageId = preMessageId;
      try {
        const dbMessage = await sendMessageToDb({
          content: filteredContent,
          receiverId: message.receiverId,
        });
        messageId = dbMessage.id;
        // 4. 如果有圖片，補綁定到 message
        if (imagesFilter.length > 0) {
          await fetch("/api/message", {
            method: "POST",
            body: JSON.stringify({
              messageId,
              images: imagesFilter,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      } catch (e) {
        console.log(e, "error");
      }

      // 5. 圖片上傳完成後，根據 messageId 更新本地 state
      if (imagesFilter.length > 0) {
        // 1. 本地 state 補圖
        setMessages((current) =>
          current.map((msg) =>
            msg.id === preMessageId ? { ...msg, images: imagesFilter } : msg
          )
        );
      }
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: { ...optimisticMessage, images: imagesFilter },
      });
    },
    [channel, isConnected, chatRoomId, setLatestMessage]
  );
  return { messages, sendMessage, isConnected };
}
