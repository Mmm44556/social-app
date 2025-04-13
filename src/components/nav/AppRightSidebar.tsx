import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import SuggestedUser from "@/components/SuggestedUser";

async function AppRightSidebar() {
  const { userId } = await auth();
  if (!userId) return <div className="col-span-3"></div>;
  return (
    <aside className="hidden lg:block lg:col-span-5 ">
      <div className="sticky top-0">
        {/* Suggested Users */}
        <SuggestedUser />

        {/* Trending Categories */}
        <Card className="mb-4 rounded-xl shadow-none border p-6">
          <CardHeader>
            <h2 className="text-xl font-bold">What&apos;s news</h2>
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
