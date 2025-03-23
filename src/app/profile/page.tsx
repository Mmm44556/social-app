"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Link2,
  MapPin,
  MoreHorizontal,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data
const userData = {
  name: "John Doe",
  username: "johndoe",
  avatar: "/placeholder.svg?height=120&width=120",
  banner: "/placeholder.svg?height=300&width=1200",
  bio: "Software developer | Open source contributor | Coffee enthusiast",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  joinDate: "March 2020",
  following: 245,
  followers: 1024,
  posts: [
    {
      id: "1",
      content:
        "Just released a new open-source project! Check it out at github.com/johndoe/awesome-project",
      timestamp: "2h",
      likes: 45,
      comments: 12,
      reposts: 8,
    },
    {
      id: "2",
      content:
        "Working on some exciting new features for my app. Can't wait to share them with you all!",
      timestamp: "1d",
      likes: 89,
      comments: 24,
      reposts: 15,
    },
    {
      id: "3",
      content:
        "Attended an amazing tech conference today. Met so many brilliant minds and learned a lot!",
      timestamp: "2d",
      likes: 124,
      comments: 32,
      reposts: 21,
    },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A202C]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{userData.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userData.posts.length} posts
              </p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="h-48 md:h-64 bg-gray-200 dark:bg-gray-800 relative">
          <img
            src={userData.banner || "/placeholder.svg"}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-4">
          <div className="absolute -top-16 left-4 border-4 border-white dark:border-[#1A202C] rounded-full">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant={isFollowing ? "outline" : "default"}
              className={
                isFollowing
                  ? "border-[#3098FF] text-[#3098FF]"
                  : "bg-[#3098FF] hover:bg-[#2180d8]"
              }
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          <div className="mt-16">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              @{userData.username}
            </p>

            <p className="mt-4">{userData.bio}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-gray-500 dark:text-gray-400">
              {userData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.website && (
                <div className="flex items-center gap-1">
                  <Link2 className="h-4 w-4" />
                  <a
                    href={userData.website}
                    className="text-[#3098FF] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {userData.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Link href="#" className="hover:underline">
                <span className="font-bold">{userData.following}</span>{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </Link>
              <Link href="#" className="hover:underline">
                <span className="font-bold">{userData.followers}</span>{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  Followers
                </span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="posts" className="flex-1">
                Posts
              </TabsTrigger>
              <TabsTrigger value="replies" className="flex-1">
                Replies
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                Media
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex-1">
                Likes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4">
              {userData.posts.map((post) => (
                <div key={post.id} className="border-b p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{userData.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          @{userData.username}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          ·
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {post.timestamp}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2">{post.content}</p>
                      <div className="flex gap-6 mt-4">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-[#3098FF]">
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
                        <button className="flex items-center gap-2 text-gray-500 hover:text-green-500">
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            ></path>
                          </svg>
                          <span>{post.reposts}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500">
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
                        <button className="flex items-center gap-2 text-gray-500 hover:text-[#3098FF]">
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
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="replies" className="mt-4">
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No replies yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    When you reply to someone, it will show up here.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-4">
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No media yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    When you post photos or videos, they will show up here.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-4">
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No likes yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Posts you like will show up here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
