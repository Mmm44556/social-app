import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { getUserByClerkId } from "@/app/actions/user.action";
interface MobileNavProps {
  className?: string;
}

export async function MobileNav({ className }: MobileNavProps) {
  const user = await currentUser();
  const dbUser = await getUserByClerkId(user?.id ?? "");
  return (
    <div
      className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", className)}
    >
      {/* Main navigation bar */}
      <div className="flex justify-around items-center py-4 px-2  text-white bg-white dark:bg-black">
        <Link href="/home" className="flex flex-col items-center">
          <Home className="h-6 w-6 text-gray-400" />
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <Search className="h-6 w-6 text-gray-400" />
        </Link>
        <Link href="#" className="flex flex-col items-center relative">
          <Heart className="h-6 w-6 text-gray-400" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Link>

        {dbUser === null ? (
          <SignInButton mode="modal">
            <Link href="/home" className="flex flex-col items-center">
              <User className="h-6 w-6 text-gray-400" />
            </Link>
          </SignInButton>
        ) : (
          <Link
            href={`/${dbUser.tagName}`}
            className="flex flex-col items-center"
          >
            <User className="h-6 w-6 text-gray-400" />
          </Link>
        )}
      </div>
    </div>
  );
}
