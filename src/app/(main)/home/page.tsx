import CreatePost from "@/components/CreatePost";
import { getFeed } from "@/app/actions/comment.action";
import { Fragment } from "react";
import PostCard from "@/components/comment/PostCard";
import { getDbUserId } from "@/app/actions/user.action";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const { posts } = await getFeed();
  // 用來處理用戶按讚
  const dbUserId = await getDbUserId();
  return (
    <div
      className={cn(
        "space-y-6 col-span-6 max-lg:col-span-5 max-lg:pt-10 max-lg:pb-16",
        dbUserId === null ? "col-span-5" : ""
      )}
    >
      <CreatePost />

      {/* Main Posts */}
      <div className="border-t">
        {posts.map((post) => (
          <Fragment key={post.id}>
            <PostCard
              comment={post}
              dbUserId={dbUserId}
              className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-5"
              pathToRevalidate="/home"
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
