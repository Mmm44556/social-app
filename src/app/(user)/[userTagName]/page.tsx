import { Fragment, useState } from "react";
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
import {
  getProfileByTagName,
  getCommentsByTagName,
} from "@/app/actions/profile.action";
import UnAuth from "@/components/auth/unAuth";
import PostCard from "@/components/comment/PostCard";
import FollowButton from "@/components/FollowButton";
import { Replies } from "@/components/(profile)/replies";
// Mock user data
const userData = {
  name: "John Doe",
  username: "johndoe",
  avatar: "",
  banner: "",
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

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userTagName: string }>;
}) {
  const { userTagName } = await params;
  const user = await getProfileByTagName(userTagName);
  if (!user) return <UnAuth />;
  const comments = await getCommentsByTagName(userTagName);
  return (
    <div className="bg-gray-50 dark:bg-[#1A202C] sticky top-0 z-50 ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm p-2 border-b">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{user.username}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user._count.comments} posts
              </p>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="h-48 md:h-64 bg-gray-200 dark:bg-gray-800 relative">
          {/* <img
            src={""}
            alt="Profile banner"
            className="w-full h-full object-cover"
          /> */}
        </div>

        {/* Profile Info */}
        <div className="relative">
          <div className="absolute -top-16 left-4 border-4 border-white dark:border-[#1A202C] rounded-full">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.imageUrl || ""} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-end pt-4 px-4 sticky top-0 z-10">
            <FollowButton
              dbUserId={user.id}
              className="w-fit"
              postUserId={user.id}
            />
          </div>

          <div className="mt-16 px-4">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{user.tagName}</p>

            {user.bio && <p className="mt-4">{user.bio}</p>}

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Link href="#" className="hover:underline">
                <span className="font-bold px-1">{user._count.following}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </Link>
              <Link href="#" className="hover:underline">
                <span className="font-bold px-1">{user._count.followers}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  Followers
                </span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="mt-6 [&_*]:!transition-all">
            <TabsList className="w-full h-12 p-0 rounded-none border-gray-950 [&_button]:cursor-pointer [&_button]:py-0 shadow-[0_1px_0_#e5e7eb]">
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
              {comments.map((comment) => (
                <Fragment key={comment.id}>
                  <PostCard
                    comment={comment}
                    dbUserId={user.id}
                    className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-5"
                  />
                </Fragment>
              ))}
            </TabsContent>

            <TabsContent value="replies" className="mt-4">
              <Replies />
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
