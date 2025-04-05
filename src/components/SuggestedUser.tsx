import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getSuggestedUsers } from "@/app/actions/user.action";
import FollowButton from "./FollowButton";

export default async function SuggestedUser() {
  const suggestedUsers = await getSuggestedUsers();
  if (!suggestedUsers.length) return null;

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-black dark:border dark:border-white">
      <CardHeader>
        <h2 className="text-xl font-bold">People you may know</h2>
      </CardHeader>
      <CardContent className="space-y-4 [&_button]:cursor-pointer">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl || ""} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user._count.followers} followers
              </div>
            </div>
            <FollowButton postUserId={user.id} />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Link href="#" className="text-theme hover:underline">
          View all suggestions
        </Link>
      </CardFooter>
    </Card>
  );
}
