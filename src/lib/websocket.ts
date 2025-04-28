import { create } from "zustand";

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribeToChat: (chatId: string) => void;
  unsubscribeFromChat: (chatId: string) => void;
  sendMessage: (chatId: string, message: string) => void;
}

const useWebSocketStore = create<WebSocketState>((set: any, get: any) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const socket = new WebSocket("ws://localhost:3001/ws");

    socket.onopen = () => {
      console.log("WebSocket connected");
      set({ socket, isConnected: true });

      // 發送認證消息（如果有用戶認證）
      const token = localStorage.getItem("token");
      if (token) {
        socket.send(
          JSON.stringify({
            type: "auth",
            token,
          })
        );
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "notification":
          // 處理通知（新消息、在線狀態等）
          console.log("Received notification:", data);
          break;
        case "message":
          // 處理聊天消息
          console.log("Received message:", data);
          break;
        case "chat_list":
          // 處理聊天列表更新
          console.log("Received chat list update:", data);
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      set({ socket: null, isConnected: false });

      // 嘗試重新連接
      setTimeout(() => {
        get().connect();
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },

  subscribeToChat: (chatId: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.send(
        JSON.stringify({
          type: "subscribe",
          chatId,
        })
      );
    }
  },

  unsubscribeFromChat: (chatId: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.send(
        JSON.stringify({
          type: "unsubscribe",
          chatId,
        })
      );
    }
  },

  sendMessage: (chatId: string, message: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.send(
        JSON.stringify({
          type: "message",
          chatId,
          content: message,
        })
      );
    }
  },
}));
export default useWebSocketStore;
