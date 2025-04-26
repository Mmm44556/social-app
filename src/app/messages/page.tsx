"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Search, Send, Menu, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock user data
const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Are we still meeting tomorrow?",
    lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "I sent you the project files",
    lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unread: 0,
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Let me know when you're free",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 0,
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Thanks for your help!",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: 1,
  },
  {
    id: 5,
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "See you at the meeting",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unread: 0,
  },
];

// Mock conversation data
const conversations = {
  1: [
    {
      id: 1,
      sender: 1,
      text: "Hey there! How's your day going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 2,
      sender: "me",
      text: "Pretty good, thanks! Just finishing up some work.",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
    },
    {
      id: 3,
      sender: 1,
      text: "Nice! Are we still meeting tomorrow for coffee?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      id: 4,
      sender: 1,
      text: "I was thinking maybe 10am at the usual place?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  2: [
    {
      id: 1,
      sender: 2,
      text: "Hi, I just finished the design for the homepage",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 2,
      sender: "me",
      text: "That was quick! Can I see it?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    },
    {
      id: 3,
      sender: 2,
      text: "Sure, I sent you the project files",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ],
  3: [
    {
      id: 1,
      sender: "me",
      text: "Hey Alex, do you have time to review my code?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: 2,
      sender: 3,
      text: "Sure, I can do it tomorrow morning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
    {
      id: 3,
      sender: "me",
      text: "Perfect, thank you!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: 4,
      sender: 3,
      text: "Let me know when you're free",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
  4: [
    {
      id: 1,
      sender: 4,
      text: "Can you help me with the database issue?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: 2,
      sender: "me",
      text: "What's happening with it?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    },
    {
      id: 3,
      sender: 4,
      text: "It keeps disconnecting when I run the migration",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 4,
      sender: "me",
      text: "Try checking the connection string, there might be an issue with the credentials",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    },
    {
      id: 5,
      sender: 4,
      text: "That fixed it! Thanks for your help!",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
  5: [
    {
      id: 1,
      sender: "me",
      text: "Hi David, are you coming to the team meeting today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
    {
      id: 2,
      sender: 5,
      text: "Yes, I'll be there",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
    },
    {
      id: 3,
      sender: 5,
      text: "See you at the meeting",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  ],
} as any;

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState(
    conversations[selectedUser.id]
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Set initial sidebar visibility based on screen size
  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  //   throw new Promise((resolve) => setTimeout(resolve, 2000));
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setChatMessages(conversations[user.id]);

    // On mobile, hide the sidebar when a user is selected
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "me",
      text: messageInput,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-full max-lg:pt-5 ">
      {/* Sidebar - User List */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex flex-col  md:w-80 lg:w-96 w-full bg-white border-r absolute md:relative z-10 h-full max-md:top-16 max-md:inset-0`}
      >
        <div className="p-4 border-b">
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
          <div className="p-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedUser.id === user.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    <span className="text-xs text-gray-500">
                      {format(user.lastSeen, "h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage}
                  </p>
                </div>
                {user.unread > 0 && (
                  <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {user.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !showSidebar || !isMobile ? "block" : "hidden"
        } md:blocks`}
      >
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
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
            <Avatar>
              <AvatarImage
                src={selectedUser.avatar || "/placeholder.svg"}
                alt={selectedUser.name}
              />
              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h2 className="font-medium">{selectedUser.name}</h2>
              <p className="text-xs text-gray-500">
                {selectedUser.status === "online"
                  ? "Online"
                  : "Last seen " + format(selectedUser.lastSeen, "h:mm a")}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 p-2 md:p-4 bg-gray-50 max-h-[calc(100dvh-10rem)]"
        >
          <div className="space-y-4">
            {chatMessages.map((message: any) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== "me" && (
                  <Avatar className="mr-2 h-8 w-8 hidden sm:block">
                    <AvatarImage
                      src={
                        users.find((u) => u.id === message.sender)?.avatar ||
                        "/placeholder.svg"
                      }
                    />
                    <AvatarFallback>
                      {users
                        .find((u) => u.id === message.sender)
                        ?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="max-w-[75%] sm:max-w-[70%]">
                  <div
                    className={`p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                      message.sender === "me"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      message.sender === "me" ? "text-right" : ""
                    }`}
                  >
                    {format(message.timestamp, "h:mm a")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-2 sm:p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!messageInput.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
