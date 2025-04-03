import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { auth } from "@clerk/nextjs/server";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import SuggestedUser from "@/components/SuggestedUser";
const year = new Date().getFullYear();

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
  {
    id: "5",
    name: "Gaming",
    icon: "🎮",
    posts: "78.3K",
  },
  {
    id: "6",
    name: "Fashion",
    icon: "👗",
    posts: "53.7K",
  },
  {
    id: "7",
    name: "Music",
    icon: "🎵",
    posts: "41.9K",
  },
  {
    id: "8",
    name: "Art",
    icon: "🎨",
    posts: "29.4K",
  },
  {
    id: "9",
    name: "Books",
    icon: "📚",
    posts: "18.6K",
  },
  {
    id: "10",
    name: "Movies",
    icon: "🎬",
    posts: "37.2K",
  },
  {
    id: "11",
    name: "Photography",
    icon: "📷",
    posts: "43.8K",
  },
  {
    id: "12",
    name: "Science",
    icon: "🔬",
    posts: "22.1K",
  },
  {
    id: "13",
    name: "Finance",
    icon: "💰",
    posts: "31.5K",
  },
  {
    id: "14",
    name: "Design",
    icon: "✏️",
    posts: "27.3K",
  },
  {
    id: "15",
    name: "Sports",
    icon: "⚽",
    posts: "59.2K",
  },
  {
    id: "16",
    name: "Pets",
    icon: "🐾",
    posts: "64.7K",
  },
  {
    id: "17",
    name: "Health",
    icon: "🩺",
    posts: "38.5K",
  },
  {
    id: "18",
    name: "Nature",
    icon: "🌲",
    posts: "25.9K",
  },
  {
    id: "19",
    name: "DIY",
    icon: "🔨",
    posts: "19.8K",
  },
  {
    id: "20",
    name: "Humor",
    icon: "😂",
    posts: "82.4K",
  },
  {
    id: "21",
    name: "Parenting",
    icon: "👶",
    posts: "28.7K",
  },
  {
    id: "22",
    name: "Education",
    icon: "🎓",
    posts: "15.3K",
  },
  {
    id: "23",
    name: "Sustainability",
    icon: "♻️",
    posts: "14.6K",
  },
  {
    id: "24",
    name: "Crypto",
    icon: "🪙",
    posts: "21.2K",
  },
];

async function AppRightSidebar() {
  const { userId } = await auth();
  if (!userId) return <div className="col-span-3"></div>;
  return (
    <aside className="hidden lg:block lg:col-span-5 ">
      <div className="space-y-6 sticky top-20 ">
        {/* Suggested Users */}
        <SuggestedUser />

        {/* Trending Categories */}
        <Card className="mb-4 rounded-xl shadow-none border p-6">
          <CardHeader>
            <h2 className="text-xl font-bold">What's news</h2>
          </CardHeader>
          <CardContent className="flex gap-3 px-0">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">User Name</span>
                <span className="text-sm text-muted-foreground">@username</span>
                <span className="text-sm text-muted-foreground">· 2h</span>
              </div>
              <p className="mt-1">
                This is a sample post in your social media feed. It could
                contain text, images, or other content.
              </p>
              <div className="mt-3 flex">
                <Button variant="ghost" size="sm">
                  <Heart className="size-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="size-4" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="size-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Footer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Help Center
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Cookie Policy
            </Link>
            <Link href="#" className="hover:underline">
              Accessibility
            </Link>
          </div>
          <p>
            {new Date().getFullYear()} Created by{" "}
            <Link
              href="https://github.com/Mmm44556"
              target="_blank"
              className="hover:underline"
            >
              Mmm44556
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AppRightSidebar;
