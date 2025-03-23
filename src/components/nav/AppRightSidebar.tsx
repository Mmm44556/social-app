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
import { useState } from "react";
// Mock data for suggested users
const suggestedUsers = [
  {
    id: "1",
    name: "Emma Watson",
    username: "emmawatson",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Actress, activist, book lover",
  },
  {
    id: "2",
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Software engineer at Tech Co.",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    username: "sarahjohnson",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Travel photographer | Explorer",
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

function AppRightSidebar() {
  const [sliceCategories, setSliceCategories] = useState({
    end: 4,
    categories: trendingCategories.slice(0, 4),
  });
  return (
    <div className="hidden lg:block lg:col-span-3">
      <div className="sticky top-20 space-y-6">
        {/* Suggested Users */}
        <Card className="border-0 shadow-sm bg-white dark:bg-black dark:border dark:border-white">
          <CardHeader>
            <h2 className="text-xl font-bold">Suggested for you</h2>
          </CardHeader>
          <CardContent className="space-y-4 [&_button]:cursor-pointer">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.bio}
                  </div>
                </div>
                <Button className="bg-theme hover:bg-theme-hover text-white">
                  Follow
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Link href="#" className="text-theme hover:underline">
              View all suggestions
            </Link>
          </CardFooter>
        </Card>

        {/* Trending Categories */}
        <Card className="border-0 shadow-sm bg-white dark:bg-black dark:border dark:border-white">
          <CardHeader>
            <h2 className="text-xl font-bold">Popular categories</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 [&_button]:cursor-pointer">
              {sliceCategories.categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="rounded-full border-theme text-theme hover:bg-theme hover:text-white"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
              <Button
                variant="outline"
                className="rounded-full cursor-pointer"
                onClick={() =>
                  setSliceCategories((prev) => {
                    if (prev.end >= trendingCategories.length) {
                      return {
                        end: 4,
                        categories: trendingCategories.slice(0, 4),
                      };
                    } else {
                      const newEnd = prev.end + 4;
                      return {
                        end: newEnd,
                        categories: trendingCategories.slice(0, newEnd),
                      };
                    }
                  })
                }
              >
                {sliceCategories.end >= trendingCategories.length
                  ? "+ More"
                  : "+ More"}
              </Button>
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
    </div>
  );
}

export default AppRightSidebar;
