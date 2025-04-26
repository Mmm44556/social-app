"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Construction } from "lucide-react";
import SuggestedUser from "@/components/SuggestedUser";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function AppRightSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  if (!user) return null;

  return (
    <aside
      className={cn(
        "col-span-2 max-lg:hidden",
        pathname === "/messages" && "hidden"
      )}
    >
      <div className="sticky top-6">
        {/* <SuggestedUser /> */}

        <Card className="mb-4 rounded-xl shadow-none border p-6">
          <CardHeader className="p-0">
            <h2 className="text-xl font-bold">Developing...</h2>
          </CardHeader>
          <CardContent className="flex gap-3 px-0">
            {/* <div className="flex-1">
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
            </div> */}
            <Construction className="size-10 m-auto" />
          </CardContent>
        </Card>
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Help Center
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Cookie Policy
            </a>
            <a href="#" className="hover:underline">
              Accessibility
            </a>
          </div>
          <p>
            {new Date().getFullYear()} Created by{" "}
            <a
              href="https://github.com/Mmm44556"
              target="_blank"
              className="hover:underline"
            >
              Mmm44556
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AppRightSidebar;
