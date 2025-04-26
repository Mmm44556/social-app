"use client";

import CreatePost from "@/components/CreatePost";
import { Fragment, useEffect, useState } from "react";
import PostCard from "@/components/comment/PostCard";
import { getDbUserId, getUserByClerkId } from "@/app/actions/user.action";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useFeed } from "@/hooks/useFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonList } from "@/components/PostSkeleton";

export default function HomePage() {
  const { ref, inView } = useInView();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getDbUserId();
      setDbUserId(id);
      if (id) {
        const user = await getUserByClerkId(id);
        setDbUser(user);
      }
    };
    fetchUser();
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useFeed();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div
      className={cn(
        "space-y-6 col-span-6 max-lg:col-span-5 max-lg:pt-10 max-lg:pb-16",
        dbUserId === null ? "col-span-5" : ""
      )}
    >
      <CreatePost dbUser={dbUser} />
      {/* Main Posts */}

      {isFetching ? (
        <SkeletonList />
      ) : (
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
      )}

      {/* Loading indicator */}
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <Skeleton className="w-full h-10" />}
      </div>
    </div>
  );
}
