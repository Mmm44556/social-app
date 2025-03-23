"use client";

import { useState } from "react";
import { Grid, Image, Menu, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import AppRightSidebar from "@/components/nav/AppRightSidebar";
import { UtilsToggleGroup } from "@/components/UtilsToggleGroup";
// Mock data for posts
const posts = [
  {
    id: "1",
    user: {
      name: "Jane Cooper",
      username: "janecooper",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just shipped a new feature to production! 🚀 #coding #webdev",
    image: "/placeholder.svg?height=300&width=400",
    timestamp: "2h",
    likes: 24,
    comments: 5,
    shares: 3,
    category: "Technology",
  },
  {
    id: "2",
    user: {
      name: "Alex Morgan",
      username: "alexmorgan",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Working on a new design system for our product. Excited to share more soon!",
    image: "/placeholder.svg?height=300&width=400",
    timestamp: "4h",
    likes: 56,
    comments: 12,
    shares: 8,
    category: "Design",
  },
  {
    id: "3",
    user: {
      name: "Sam Wilson",
      username: "samwilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just finished reading 'Atomic Habits' by James Clear. Highly recommend it to everyone! #books #productivity",
    timestamp: "6h",
    likes: 89,
    comments: 15,
    shares: 20,
    category: "Books",
  },
  {
    id: "4",
    user: {
      name: "Taylor Swift",
      username: "taylorswift",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "New album dropping next month! Stay tuned for more updates. #music #newalbum",
    image: "/placeholder.svg?height=300&width=400",
    timestamp: "8h",
    likes: 1024,
    comments: 512,
    shares: 256,
    category: "Music",
  },
];

// Mock data for trending categories
const trendingCategories = [
  {
    id: "1",
    name: "Technology",
    icon: "💻",
    posts: "12.5K",
  },
  {
    id: "2",
    name: "Travel",
    icon: "✈️",
    posts: "45.2K",
  },
  {
    id: "3",
    name: "Food",
    icon: "🍕",
    posts: "32.1K",
  },
  {
    id: "4",
    name: "Fitness",
    icon: "💪",
    posts: "67.8K",
  },
];

export default function Page() {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    // In a real app, this would send the post to an API
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setPostContent("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F9F5FF] dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:auto-cols-fr grid-flow-col">
          {/* Main Content */}
          <div className="md:col-span-9 lg:col-span-9">
            <div className="bg-white dark:bg-black rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">What's new with you?</h1>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      className={
                        viewMode === "list"
                          ? "bg-[#9333EA] hover:bg-[#7E22CE]"
                          : ""
                      }
                      onClick={() => setViewMode("list")}
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      className={
                        viewMode === "grid"
                          ? "bg-[#9333EA] hover:bg-[#7E22CE]"
                          : ""
                      }
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs for Feed */}

              <Tabs defaultValue="discover">
                <div className="border-b border-gray-100 dark:border-gray-800 p-3">
                  <TabsList className="w-full gap-2">
                    <TabsTrigger value="discover" className="flex-1">
                      Discover
                    </TabsTrigger>
                    <TabsTrigger value="following" className="flex-1">
                      Following
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="flex-1">
                      Trending
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Create Post */}
                <div className="border-b border-gray-100 dark:border-gray-800 p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl} alt="User" />
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Share something interesting..."
                        className="border-0 bg-gray-50 dark:bg-gray-800 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                      <div className="flex justify-between mt-4">
                        <UtilsToggleGroup />
                        <Button
                          className="bg-theme hover:bg-theme-hover text-white rounded-full"
                          onClick={handleCreatePost}
                          disabled={!postContent.trim() || isLoading}
                        >
                          {isLoading ? "Posting..." : "Share"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <TabsContent value="discover" className="m-0 p-4">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {posts.map((post) => (
                        <Card
                          key={post.id}
                          className="overflow-hidden dark:border-[#2f3336] shadow-md"
                        >
                          {post.image && (
                            <div className="relative aspect-video w-full overflow-hidden">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt="Post image"
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                {post.category}
                              </div>
                            </div>
                          )}
                          <CardHeader className="p-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={post.user.avatar}
                                  alt={post.user.name}
                                />
                                <AvatarFallback>
                                  {post.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {post.user.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {post.timestamp} ago
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="text-sm line-clamp-3">
                              {post.content}
                            </p>
                          </CardContent>
                          <CardFooter className="p-3 pt-0 flex justify-between">
                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-1 text-gray-500 hover:text-theme-hover">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  ></path>
                                </svg>
                                <span className="text-xs">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 text-gray-500 hover:text-theme-hover">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  ></path>
                                </svg>
                                <span className="text-xs">{post.comments}</span>
                              </button>
                            </div>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-theme-hover">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                ></path>
                              </svg>
                              <span className="text-xs">Share</span>
                            </button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <Card
                          key={post.id}
                          className="overflow-hidden border-none shadow-md"
                        >
                          <div className="p-4">
                            <div className="flex gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={post.user.avatar}
                                  alt={post.user.name}
                                />
                                <AvatarFallback>
                                  {post.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">
                                    {post.user.name}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    @{post.user.username}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    ·
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {post.timestamp}
                                  </span>
                                  <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-0.5 rounded-full">
                                    {post.category}
                                  </span>
                                </div>
                                <p className="mt-2">{post.content}</p>
                                {post.image && (
                                  <div className="mt-3 rounded-xl overflow-hidden">
                                    <img
                                      src={post.image || "/placeholder.svg"}
                                      alt="Post image"
                                      className="w-full h-auto object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex gap-6 mt-4">
                                  <button className="flex items-center gap-2 text-gray-500 hover:text-[#9333EA]">
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      ></path>
                                    </svg>
                                    <span>{post.comments}</span>
                                  </button>
                                  <button className="flex items-center gap-2 text-gray-500 hover:text-[#9333EA]">
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                      ></path>
                                    </svg>
                                    <span>{post.shares}</span>
                                  </button>
                                  <button className="flex items-center gap-2 text-gray-500 hover:text-[#9333EA]">
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                      ></path>
                                    </svg>
                                    <span>{post.likes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="following" className="m-0 p-0">
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">
                        Your feed is empty
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Follow some creators to see their content here
                      </p>
                      <Button className="mt-4 bg-[#9333EA] hover:bg-[#7E22CE] text-white">
                        Discover creators
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="m-0 p-0">
                  <div className="p-4 space-y-4">
                    {trendingCategories.map((category) => (
                      <Card
                        key={category.id}
                        className="overflow-hidden border-none shadow-md"
                      >
                        <div className="p-4 flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-2xl">
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold">{category.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category.posts} posts
                            </p>
                          </div>
                          <Button className="bg-[#9333EA] hover:bg-[#7E22CE] text-white">
                            Explore
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Sidebar */}
          <AppRightSidebar />
        </div>
      </div>
    </div>
  );
}
