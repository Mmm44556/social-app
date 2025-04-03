import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CreatePost from "@/components/CreatePost";

export default function HomePage() {
  return (
    <main className="min-h-screen space-y-6 rounded-xl w-full lg:col-span-9 md:col-span-9">
      <CreatePost />

      {/* Main Posts */}
      <main className="flex-1">
        <div className="mx-auto">
          {/* Feed content would go here */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="mb-4 rounded-xl shadow-none border p-6">
              <CardContent className="flex gap-3 px-0">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">User Name</span>
                    <span className="text-sm text-muted-foreground">
                      @username
                    </span>
                    <span className="text-sm text-muted-foreground">· 2h</span>
                  </div>
                  <p className="mt-1">
                    This is a sample post in your social media feed. It could
                    contain text, images, or other content.
                  </p>
                  <div className="mt-3 aspect-video rounded-lg bg-muted" />
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
          ))}
        </div>
      </main>
    </main>
  );
}
