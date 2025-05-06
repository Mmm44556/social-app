import Link from "next/link";
import { Home, User, MessageSquare } from "lucide-react";
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

        {/* Messages */}
        {dbUser ? (
          <Link href="/messages" className="flex flex-col items-center">
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </Link>
        ) : (
          <SignInButton mode="modal">
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </SignInButton>
        )}

        {/* Profile */}
        {dbUser ? (
          <Link
            href={`/${dbUser.tagName}`}
            className="flex flex-col items-center"
          >
            <User className="h-6 w-6 text-gray-400" />
          </Link>
        ) : (
          <SignInButton mode="modal">
            <Link href="/home" className="flex flex-col items-center">
              <User className="h-6 w-6 text-gray-400" />
            </Link>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
